require("dotenv").config();
import {path} from "path";
import {fs} from "fs";
const { s3Client } = require("../config/s3Client");
const bucketName = "weddio";
const region = "us-east-2";

// UPLOAD FILE TO S3
async function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams)); // this will upload file to S3
    return data;
  }catch(err){
    console.log("Err: ", err);
  }
}

// DOWNLOAD FILE FROM S3
async function getFileStream(fileKey) {
    const bucketParams = {
    Key: fileKey,
    Bucket: bucketName,
    };
    try {
      // Create a helper function to convert a ReadableStream to a string.
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        });
  
      // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
      const data = await s3Client.send(new GetObjectCommand(bucketParams));
      // Convert the ReadableStream to a string.
      const bodyContents = await streamToString(data.Body);
      console.log(bodyContents);
      return bodyContents;
    } catch (err) {
      console.log("Error", err);
    }
}

module.exports = { uploadFile, getFile };