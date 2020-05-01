import AWS from 'aws-sdk';

export const emailSend = ({
  subject,
  to,
  from,
  message
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ses = new AWS.SES();
      let param = {
        Source: from,
        Destination: {
          ToAddresses: to
        },
        Message: {
          Subject: {
            Data: subject
          },
          Body: {
            Html: {
              Data: message
            }
          }
        }
      };
      console.log('params');
      console.log(param);
      ses.sendEmail(param, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log('data');
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