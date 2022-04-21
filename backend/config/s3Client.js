const AWS = require('aws-sdk');

const AWS_ACCESS_KEY = "AKIA6DVS6SCHHWSPUERM"
const AWS_SECRET_KEY = "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"


// Enter the name of the bucket that you have created here
const BUCKET_NAME = 'weddio';

const s3Client = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
});

module.exports = { s3Client }