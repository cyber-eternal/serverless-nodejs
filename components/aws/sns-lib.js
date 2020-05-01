import AWS from 'aws-sdk';
const sns = new AWS.SNS();

export const publish = ({ topicArn, message, filterAttributes }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let params = {
        Message: message,
        MessageStructure: 'json',
        TopicArn: topicArn
      };
      if (filterAttributes) params.MessageAttributes = filterAttributes;
      console.log('publish params');
      console.log(params);
      sns.publish(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
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

export const createPushMessage = (pushBody, topicArn, filterAttributes) => {
  return {
    topicArn,
    message: JSON.stringify({
      default: JSON.stringify(pushBody),
    }),
    filterAttributes
  };
};