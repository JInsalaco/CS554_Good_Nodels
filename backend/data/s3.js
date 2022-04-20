require("dotenv").config();
const fs = require('fs');
const {s3Client} = require('../config/s3Client')
// Enter the name of the bucket we are using for weddio
const BUCKET_NAME = 'weddio';

// UPLOAD FILE TO S3
const uploadFile = (fileName) => {
  // read content from the file
  const fileContent = fs.readFileSync(fileName);

  // setting up s3 upload parameters
  const params = {
      Bucket: BUCKET_NAME,
      Key: 'test.jpg', //name of the file in s3
      Body: fileContent //the actual contents of the file
  };

  // Uploading files to the bucket
  s3Client.upload(params, function(err, data) {
      if (err) {
          throw err
      }
      console.log(`File uploaded successfully. ${data.Location}`)
  });
};

// DOWNLOAD FILE FROM S3Client
const getFile = async (fileKey)=> {
  //Key is the name of the object we are uploading to S3Client
  //Bucket should be defined above
  const params = {
    Key: fileKey,
    Bucket: BUCKET_NAME,
    };

    try {
      // Pipe readstream to a file
      var file = fs.createWriteStream('C:/Users/Joseph/Documents/CS554_Good_Nodels/backend/data/cat.jpg');
      s3Client.getObject(params).createReadStream().pipe(file);
      console.log(file);
      return file;
    } catch (err) {
      console.log("Error", err);
    }
}

//DELETE FILE FROM S3
const deleteFile = (fileKey) => {
  const params = {
    Key: fileKey,
    Bucket: BUCKET_NAME,
  }
  try{
    s3Client.deleteObject(params, function(err,data){
      if(err){
        console.log("Error", err);
      }
      else{
      }
    });
    return `Successfully deleted file with key ${fileKey}`;
  } catch(err){
    console.log("Error: ", err);
  }
};

module.exports = { uploadFile, getFile, deleteFile };