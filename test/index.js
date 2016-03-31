require("sugar");

var chai = require("chai"),
    async = require("async"),
    expect = chai.expect,
    smithies = null;

chai.should();

describe('Module', function() {
    it("ain't broke", function() {
        smithies = require("../index");
    });
});

describe('S3', function() {
    it("exists", function() {
        smithies.s3.should.be.ok;
    });
    
    
});

describe('SES', function() {
    it("exists", function() {
        smithies.ses.should.be.ok;
    });  
});

describe('SQS', function() {
    it("exists", function() {
        smithies.sqs.should.be.ok;
    });  
});

describe('Lambda', function() {
    it("exists", function() {
        smithies.lambda.should.be.ok;
    });  
});