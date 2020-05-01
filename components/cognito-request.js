import _ from 'lodash';
import uuid_v1 from 'uuid/v1';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from './../components/aws/cognito-lib';
import { config } from '../config';

export function registerInCognito(obj) {
  return new Promise((resolve, reject) => {
    try {
      let attributeList = [];
      let email = { Name: 'email', Value: obj.email },
        type = { Name: 'custom:type', Value: obj.userType },
        name = { Name: 'name', Value: obj.firstName },
        uuid = uuid_v1();
      let attributeEmail = new CognitoUserAttribute(email);
      let attributeUserType = new CognitoUserAttribute(type);
      let attributeName = new CognitoUserAttribute(name);
      attributeList.push(attributeEmail, attributeUserType, attributeName);
      userPool.signUp(uuid, obj.password, attributeList, null, (error, result) => {
        if (error) {
          console.log(error);
          resolve(error);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      console.log('error registerInCognito', error);
      reject(error);
    }
  });
}

export const updateCognitoAttributes = (attributes, username) => {
  console.log('username', username);
  return new Promise(async (resolve, reject) => {
    try {
      const validAttributes = _.omitBy(attributes, _.isNil);
      if (!Object.keys(validAttributes).length) {
        console.log('**** NOTHING TO UPDATE IN COGNITO ****');
        resolve(false);
      }
      let UserAttributes = [];
      _.forEach(validAttributes, (value, key) => {
        UserAttributes.push({ Name: key, Value: value });
      });
      let params = {
        UserAttributes,
        UserPoolId: config.UserPoolId,
        Username: username
      };
      console.log('params Cognito', params);
      let cognitoidentityserviceprovider = new CognitoIdentityServiceProvider();
      cognitoidentityserviceprovider.adminUpdateUserAttributes(params, (err, data) => {
        if (err) {
          console.log(err, err.stack); // an error occurred
          resolve(err);
        } else {
          resolve(data);
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};