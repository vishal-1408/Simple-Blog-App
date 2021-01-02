const aws = require("aws-sdk");

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    bucket:'blogapi1408'
  });

module.exports = s3;