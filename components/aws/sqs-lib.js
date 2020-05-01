import uuid from 'uuid/v1';
import AWS from 'aws-sdk';
const sqs = new AWS.SQS();

export const receiveMessage = (QueueUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      let messId = uuid();
      let params = {
        QueueUrl,
        AttributeNames: [
          'ALL'
        ],
        MaxNumberOfMessages: 1,
        ReceiveRequestAttemptId: messId,
        WaitTimeSeconds: 20,
      };
      sqs.receiveMessage(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.log(data);
          resolve(data);
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

export const createMessage = ({
  MessageGroupId,
  MessageBody,
  QueueUrl,
  fifo
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let messId = uuid();
      let params = {
        MessageBody,
        QueueUrl
      };
      if (fifo) (params.MessageGroupId = MessageGroupId) && (params.MessageDeduplicationId = messId);
      sqs.sendMessage(params, function (err, data) {
        if (err) {
          console.log('Error', err);
          reject(err);
        } else {
          console.log('Success', data.MessageId);
          resolve(data);
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

export const deleteMessageFromQueue = ({ ReceiptHandle, QueueUrl }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let params = {
        ReceiptHandle,
        QueueUrl
      };
      sqs.deleteMessage(params, function (err, data) {
        if (err) {
          console.log('Error', err);
          reject(err);
        } else {
          console.log('Delete message Success');
          resolve(data);
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

export const receiveSQS = (QueueUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sqsResponse = await receiveMessage(QueueUrl);
      if (!sqsResponse.Messages) {
        sqsResponse = await receiveSQS(QueueUrl);
      }
      resolve(sqsResponse);
    } catch (err) {
      reject(err);
    }
  });
};