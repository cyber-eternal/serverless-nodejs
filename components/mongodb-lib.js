import mongoose from 'mongoose';
import { config } from './../config';

let isConnected = false;
mongoose.Promise = global.Promise;

export const initialize = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('isConnected', isConnected, config.MongodbUrl);
      const urlConnection = config.MongodbUrl;
      if (isConnected) {
        resolve(isConnected);
        return;
      }
      const dbs = await mongoose.connect(urlConnection, { useNewUrlParser: true, useCreateIndex: true, });
      isConnected = dbs.connections[0].readyState;
      resolve(isConnected);
    } catch (e) {
      reject(e);
    }
  });
};

export const closeConnection = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.disconnect();
      isConnected = false;
      resolve(isConnected);
    } catch (e) {
      reject(e);
    }
  });
};

export const db = mongoose;