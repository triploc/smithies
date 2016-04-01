"use strict";

require("sugar");

var async = require("async"),
    fs = require("fs"),
    uuid = require("node-uuid"),
    AWS = require("aws-sdk"),
    crypto = require('crypto'),
    mime = require('mime');

class Bucket {
    
    constructor(bucket, config) {
        this.bucket = bucket;
        this.options = options || { };
        this.S3 = AWS.S3(config);
        return this;
    }
    
    create(options, cb) {
        var params = {
            Bucket: this.bucket,
            ACL: 'private'
        };
        
        if (Object.isFunction(options) && cb == null) {
            cb = options;
            options = null;
        }
        
        if (options) {
            params = Object.merge(params, options);
        }
        
        this.S3.createBucket(options, function(err) {
            if (err) cb(err);
            else this.S3.waitFor('bucketExists', { Bucket: this.bucket }, cb);
        });
    }
    
    erase(cb) {
        this.S3.deleteBucket({ Bucket: this.bucket }, function(err) {
            if (err) cb(err);
            else this.S3.waitFor('bucketNotExists', { Bucket: this.bucket }, cb);
        });
    }
    
    read(file, cb) {
        S3.getObject({ 
            Bucket: this.bucket, 
            Key: file
        }, function(err, data) {
            if (err) cb(err);
            else {
                if (data && data.Body && data.ContentType.contains("json")) {
                    var content = null;
                    try { content = JSON.parse(data.Body.toString()); }
                    catch (ex) { cb(ex); return; }
                    cb(null, content);
                }
                else {
                    cb(null, data ? data.Body : null);
                }
            }
        });
    }
    
    write(file, content, cb) {
        if (Object.isObject(content)) {
            content = JSON.stringify(content);
        }
        
        S3.upload({ 
            Bucket: this.bucket, 
            Key: file,
            Body: content,
            ACL: 'private',
            ContentType: mime.lookup(file)
        }, cb);
    }
    
    publish(file, content, cb) {
        if (Object.isObject(content)) {
            content = JSON.stringify(content);
        }
        
        S3.upload({ 
            Bucket: this.bucket, 
            Key: file,
            Body: content,
            ACL: 'public-read',
            ContentType: mime.lookup(file)
        }, cb);
    }
    
    delete(file, cb) {
        s3.deleteObject({ Bucket: this.bucket, Key: file }, cb);
    }
    
    copy(source, dest, cb) {
        this.S3.copyObject({ Bucket: this.bucket, CopySource: source, Key: dest }, cb);
    }
    
    move(source, dest, cb) {
        this.copy(source, dest, function(err) {
            if (err) cb(err);
            else this.delete(source, cb);
        });
    }
    
    list(like, cb) {
        var done = false,
            files = [ ],
            marker = null;

        async.whilst(function() { 
            return done == false; 
        }, function(cb) {
            S3.listObjects({
                Bucket: this.bucket,
                Delimiter: "/",
                Prefix: like,
                Marker: marker
            }, function(err, data) {
                if (err) cb(err);
                else {
                    files.add(data.Contents.map("Key"));
                    done = !data.IsTruncated;
                    marker = data.NextMarker;                
                    cb();
                }
            });
        }, function(err) {
            cb(err, files);
        });    
    }
    
    downloadUrl(file, duration, cb) {
        var params = { Bucket: this.bucket, Key: file };
        if (duration) params.Expires = 60;
        s3.getSignedUrl('getObject', params, cb);
    }
    
    uploadUrl(file, duration, cb) {
        var params = { Bucket: this.bucket, Key: file };
        if (duration) params.Expires = 60;
        s3.getSignedUrl('putObject', duration, cb);
    }
    
    uploadPolicy(file, redirect, duration, maxSizeMB) {
        var dateObj = Date.create(),
            dateExp = Date.create(dateObj.getTime() + (duration || 600) * 1000);

        var policy = {
            "expiration": (dateExp.getUTCFullYear() + "-" + dateExp.getUTCMonth() + 1 + "-" + dateExp.getUTCDate() + "T" + dateExp.getUTCHours() + ":" + dateExp.getUTCMinutes() + ":" + dateExp.getUTCSeconds() + "Z"),
            "conditions": [
                { bucket: this.bucket },
                [ "eq", "$key", file ],
                { acl: "private" },
                [ "content-length-range", 0, (maxSizeMB || 25) * 1024 * 1024 ],
                [ "starts-with", "$Content-Type", "" ],
                { "success_action_redirect": redirect }
            ]
        };

        var policyString = JSON.stringify(policy),
            policyBase64 = new Buffer(policyString).toString('base64'),
            signature = crypto.createHmac("sha1", this.options.secretAccessKey).update(policyBase64);

        return {
            s3PolicyBase64: policyBase64,
            s3Signature: signature.digest("base64"),
            s3Key: this.options.accessKeyId,
            acl: "private",
            mime: mime.lookup(file),
            redirect: redirect,
            key: file
        };
    }
    
}

exports.Bucket = Bucket;
