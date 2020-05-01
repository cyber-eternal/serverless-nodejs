import { Config, CognitoIdentityCredentials } from 'aws-sdk';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import config from './../../config';

let conf = {
  IdentityPoolId: config.IdentityPoolId,
  UserPoolId: config.UserPoolId,
  ClientId: config.ClientId,
  region: config.region
};

Config.region = conf.region;
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: conf.IdentityPoolId
});

export const userPool = new CognitoUserPool({
  UserPoolId: conf.UserPoolId,
  ClientId: conf.ClientId,
});