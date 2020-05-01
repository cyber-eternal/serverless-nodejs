import _ from 'lodash';
import request from 'request';
import { config } from './../config';
import { parse } from 'json2csv';

export const requiredParams = (params, req) => {
  let response = {
    status: true,
    missing: []
  };
  _.each(params, (key) => {
    if (!req[key]) {
      response.status = false;
      response.missing.push(key);
    }
  });
  return response;
};

export const parseQuery = qstr => {
  let query = {};
  let a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
  for (let i = 0; i < a.length; i++) {
    let b = a[i].split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  return query;
};

export const filterEmailPlusSign = (str) => str.indexOf('+') !== -1 ? str.replace(str.substring(str.indexOf('+'), str.indexOf('@')), '') : str;

export const parseString = qstr => {
  let query = {};
  let a = qstr.split('\n');
  for (let i = 0; i < a.length; i++) {
    let b = a[i].split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  return query;
};

export function getPriceByPackage(price) {
  return config.packages[price - 1].price;
}

export const symbolConverter = data => {
  let finalData;
  if (data && data.length > 0 && typeof data !== 'number') {
    finalData = data.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/%/g, '&#37;');
  }
  return finalData;
};

export const getSubDomain = referrer => {
  let content = referrer.indexOf('http://') !== -1 ? referrer.replace('http://', '') : referrer.replace('https://', '');
  let splitData = content.split('.');
  console.log(splitData);
  return splitData.length >= 3 ? content : null;
};


// export const isBase64 = base64String => {
//   const regexp = /data:image\/([a-zA-Z]*);base64,([^\']*)/;
//   const valid = regexp.test(base64String);
//   return valid;
// };

// export const base64MimeType = encoded => {
//   if (typeof encoded !== 'string') return null;
//   const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
//   return (mime && mime.length) ? mime[1] : null;
// };

export const capitalize = string => string.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

export const capitalizeData = (data) => {
  return {
    ...data,
    firstName: capitalize(data.firstName),
    lastName: capitalize(data.lastName),
    address: capitalize(data.address),
    city: capitalize(data.city)
  };
};

export const options = ({
  url,
  method,
  data,
  headers = {}
}) => {
  let res = {
    url,
    headers: { ...{ 'Content-Type': 'application/json' }, ...headers },
    method,
  };
  if (method !== 'GET') res.body = JSON.stringify(data);
  return res;
};

export const requestPromise = ({
  url,
  method,
  data,
  headers = {}
}) => {
  return new Promise((resolve, reject) => {
    try {
      request(options({
        url,
        method,
        data,
        headers
      }), (error, response, body) => {
        error ? reject(error) : resolve({
          'body': body,
          'response': response,
          'header': response.headers
        });
      });
    } catch (error) {
      console.log('error in requestJSONPromise', error);
      reject(error);
    }
  });
};

export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = phone => {
  const re = /^((\+)?)([(\)]*\d{1}){8,13}$/;
  return re.test(phone);
};

export const delay = t => new Promise(res => setTimeout(res(true), t))

export const jsonToCsv = ({ fields, data, type }) => {
  const csv = parse(data, { fields });
  console.log('CSV parsed', new Date());
  if (type === 'Buffer') {
    return Buffer.from(csv, 'utf8');
  } else if (type === 'base64') {
    return Buffer.from(csv, 'utf8').toString('base64');
  } else {
    return csv;
  }
};