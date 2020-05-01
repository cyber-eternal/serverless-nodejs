import AWS from 'aws-sdk';
import config from './../../config';

let s3 = new AWS.S3({
  apiVersion: '2017-12-31',
  params: { Bucket: config.s3.bucketName }
});

// export const createAlbum = (albumName) => {
//   return new Promise((resolve, reject) => {
//     try {
//       albumName = albumName.trim();
//       if (!albumName) throw new Error('Album names must contain at least one non-space character.');
//       if (albumName.indexOf('/') !== -1) throw new Error('Album names cannot contain slashes.');
//       let albumKey = `${encodeURIComponent(albumName)}/`;
//       s3.headObject({ Key: albumKey }, (err, data) => {
//         if (!err) throw new Error('Album already exists.');
//         if (err.code !== 'NotFound') throw new Error(err.message);
//         s3.putObject({ Key: albumKey }, (err, data) => {
//           if (err) throw new Error(err.message);
//           console.log('Successfully created album.');
//           console.log('data createAlbum', data);
//           resolve(true);
//         });
//       });
//     } catch (error) {
//       console.log('Error in CreateAlbum', error);
//       reject(error);
//     }
//   });
// };

export const addPhoto = ({ albumName, img }) => {
  return new Promise((resolve, reject) => {
    try {
      let fileName = img.name;
      let imgData = img.data;
      let albumPhotosKey = `${encodeURIComponent(albumName)}/`;
      let photoKey = albumPhotosKey + fileName;
      s3.upload({
        Key: photoKey,
        Body: imgData,
        ACL: 'public-read'
      }, (err, data) => {
        if (err) throw new Error(err.message);
        console.log('Successfully uploaded photo.');
        console.log('data addPhoto', data);
        resolve(true);
      });
    } catch (error) {
      console.log('Error in add photo', error);
      reject(error);
    }
  });
};

export const uploadPhoto = (image, type, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imgName = `${type}${Date.now()}.jpg`;
      console.log('addPhoto start ');
      await addPhoto({ albumName: userId, img: { name: `${imgName}`, data: Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64') } });
      const imgUrl = `${config.s3.bucketUrl}/${userId}/${imgName}`;
      console.log('imgUrl', imgUrl);
      resolve(imgUrl);
    } catch (error) {
      console.log('Error in uploadPhoto', error);
      reject(error);
    }
  });
};

export const deletePhoto = ({ photoKey }) => {
  return new Promise((resolve, reject) => {
    try {
      s3.deleteObject({ Key: photoKey }, (err, data) => {
        if (err) throw new Error(err.message);
        console.log('Successfully deleted photo.');
        console.log('data deletePhoto', data);
        resolve(data);
      });
    } catch (error) {
      console.log('error in deletePhoto', error);
      reject(error);
    }
  });
};