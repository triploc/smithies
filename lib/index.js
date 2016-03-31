var AWS = require("aws-sdk");

exports.AWS = AWS;

exports.lambda = require("./lambda");

exports.s3 = require("./s3");

exports.ses = require("./ses");

exports.sqs = require("./sqs");