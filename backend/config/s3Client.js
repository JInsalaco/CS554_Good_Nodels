require("dotenv").config();
const AWS = require("aws-sdk");
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_SECRET_KEY;
const REGION = process.env.AWS_REGION;

AWS.config.update({
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
});

const s3Client = new AWS.S3({
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
});

const sesClient = new AWS.SES({
  apiVersion: "2010-12-01",
  signatureVersion: "v4",
  region: REGION,
});

module.exports = { s3Client, sesClient };
