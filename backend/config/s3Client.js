const AWS = require('aws-sdk');

const AWS_ACCESS_KEY = "AKIA6DVS6SCHPHOQ44GV"
const AWS_SECRET_KEY = "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"


// Enter the name of the bucket that you have created here
const BUCKET_NAME = 'weddio';

const s3Client = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
});

module.exports = { s3Client }

