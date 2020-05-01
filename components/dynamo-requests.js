import * as _ from 'lodash';
import * as dynamoDbLib from './aws/dynamodb-lib';
import config from './../config';

export const getItemByGSI = ({
  TableName,
  IndexName,
  attribute,
  value,
  sortKey,
  sortValue,
  filter,
  filterValue,
  operator,
  filter1,
  filterValue1,
  LastEvaluatedKey,
  ScanIndexForward,
  Limit
}) => {
  let params = {
    TableName: `${TableName}-${config.stage}`,
    KeyConditionExpression: '#attrKey = :attrValue',
    ExpressionAttributeValues: { ':attrValue': value },
    ExpressionAttributeNames: { '#attrKey': attribute },
  };
  if (IndexName) params.IndexName = IndexName;
  if (LastEvaluatedKey) params.ExclusiveStartKey = LastEvaluatedKey;
  if (ScanIndexForward) params.ScanIndexForward = false;
  if (Limit) params.Limit = Limit;
  if (sortKey && sortValue) {
    params.KeyConditionExpression += ' and #sortKey = :sortValue';
    params.ExpressionAttributeNames['#sortKey'] = sortKey;
    params.ExpressionAttributeValues[':sortKey'] = sortValue;
  }
  if (filter) {
    params.FilterExpression = `#${filter} = :${filter}`;
    params.ExpressionAttributeNames[`#${filter}`] = filter;
    params.ExpressionAttributeValues[`:${filter}`] = filterValue;
  }
  if (filter && filterValue && operator && filter1 && filterValue1) {
    params.FilterExpression += ` ${operator} #${filter1} = :${filter1}`;
    params.ExpressionAttributeNames[`#${filter1}`] = filter1;
    params.ExpressionAttributeValues[`:${filter1}`] = filterValue1;
  }
  console.log('params', params);
  return dynamoDbLib.call('query', params);
};

export const writeDataIntoDB = ({ TableName, Item }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let params = {
        TableName: `${TableName}-${config.stage}`,
        Item
      };
      console.log('params', params);
      await dynamoDbLib.call('put', params);
      resolve('success');
    } catch (error) {
      console.log(`error in write data into ${TableName}`, error);
      reject(error);
    }
  });
};

export const getAllItemsByGSI = (data) => { // data need be same as data for getItemByGSI
  return new Promise(async (resolve, reject) => {
    try {
      let finalData = [];
      let gettingData = await getItemByGSI(data);
      console.log('gettingData', gettingData);
      finalData = finalData.concat(gettingData.Items);
      if (gettingData.LastEvaluatedKey) {
        let final2 = await getAllItemsByGSI({ ...data, LastEvaluatedKey: gettingData.LastEvaluatedKey });
        finalData = finalData.concat(final2);
      }
      console.log('finalData', finalData);
      resolve(finalData);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

export const updateInDB = ({ TableName, Key, updatedData }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('updatedData', updatedData);
      const params = {
        TableName: `${TableName}-${config.stage}`,
        Key,
        UpdateExpression: 'SET #updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':updatedAt': Date.now()
        },
        ExpressionAttributeNames: {
          '#updatedAt': 'updatedAt'
        },
      };
      _.forEach(updatedData, (item, key) => {
        if (key !== 'id') {
          console.log('item', item);
          console.log('key', key);
          if (typeof item === 'string') {
            params.UpdateExpression += `, #${key} = :${key}`;
            params.ExpressionAttributeValues[`:${key}`] = item;
            params.ExpressionAttributeNames[`#${key}`] = key;
          } else if (typeof item === 'object' && Object.keys(item).length > 0) {
            _.forEach(item, (item1, key2) => {
              console.log('item1', item1);
              console.log('key2', key2);
              params.UpdateExpression += `, ${key}.#${key2} = :${key2}`;
              params.ExpressionAttributeValues[`:${key2}`] = item1;
              params.ExpressionAttributeNames[`#${key2}`] = key2;
            });
          }
        }
      });

      console.log('params', params);
      await dynamoDbLib.call('update', params);
      console.log('Attributes successfully updated');
      resolve('success');
    } catch (error) {
      console.log('ERROR in updateInDB', error);
      reject(error);
    }
  });
};

export const deleteAttributes = ({ TableName, Key, attributesList }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let params = {
        TableName: `${TableName}-${config.stage}`,
        Key,
      };
      if (attributesList.length) {
        params.UpdateExpression = '';
        params.ExpressionAttributeNames = {};
        let isFirst = true;
        for (const attribute of attributesList) {
          if (attribute !== attributesList[0]) isFirst = false;
          params.UpdateExpression += isFirst ? `#${attribute}` : `,#${attribute}`;
          params.ExpressionAttributeNames[`#${attribute}`] = attribute;
        }
        console.log('params', params);
        await dynamoDbLib.call('update', params);
        console.log('Attributes successfully removed');
        resolve('Attributes successfully removed');
      } else {
        console.log('Nothing to remove');
        resolve('Nothing to remove');
      }
    } catch (error) {
      console.log('ERROR in deleteAttributes', error);
      reject(error);
    }
  });
};