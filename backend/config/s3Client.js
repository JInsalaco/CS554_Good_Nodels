const dotenv = require('dotenv');
dotenv.config({ path: 'C:/Users/Joseph/Documents/CS554_Good_Nodels/backend/.env' });
const AWS = require('aws-sdk');
const ACCESS_KEY = process.env.AWS_ACCESS_KEY
const SECRET_KEY = process.env.AWS_SECRET_KEY
const REGION = process.env.REGION

AWS.config.update({
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,});

const s3Client = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
});

module.exports = { s3Client }