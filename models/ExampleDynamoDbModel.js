
'use strict';
import * as _ from 'lodash';
import * as dynamoDbLib from './../components/aws/dynamodb-lib';

export default class Example {
  constructor(inputData) {
    console.log('======inputData=======');
    console.log(inputData);
    this.tableName = `Example-${process.env.STAGE}`;
    this.id = inputData.id || null;
    this.title = inputData.title || null;
  }

  fetchData() {
    const finalObject = {
      id: this.id,
      title: this.title,
    };
    return _.omitBy(finalObject, _.isNil);
  }

  create() {
    let submitData = this.fetchData();
    submitData.createdAt = submitData.createdAt || Date.now();
    const params = {
      TableName: this.tableName,
      Item: submitData
    };
    return dynamoDbLib.call('put', params);
  }

  get() {
    let { id } = this.fetchData();
    let params = {
      TableName: this.tableName,
      Key: { id }
    };
    return dynamoDbLib.call('get', params);
  }

  update() {
    let modelData = this.fetchData();
    const params = {
      TableName: this.tableName,
      Key: {
        id: modelData.id
      },
      UpdateExpression: 'SET #updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':updatedAt': Date.now()
      },
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt'
      },
    };
    console.log('update params', params);
    _.forEach(modelData, (item, key) => {
      if (!['id', 'userId', 'approvedAt'].includes(key)) {
        params.UpdateExpression += `, #${key} = :${key}`;
        params.ExpressionAttributeValues[`:${key}`] = item;
        params.ExpressionAttributeNames[`#${key}`] = key;
      }
    });
    return dynamoDbLib.call('update', params);
  }
}