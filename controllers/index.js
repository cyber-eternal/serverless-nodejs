import { success, failure } from './../components/response-lib';

export const handler = async (event, context, callback) => {
  try {
    console.log('EVENT', JSON.stringify(event, null, 2));
    callback(null, success({ status: 200, message: 'Congratulations. Your first call is successful' }));
  } catch (error) {
    console.log('ERROR in handler', error);
    callback(null, failure({ status: error.status, message: error.message }));
  }
};