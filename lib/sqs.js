"use strict";

require("sugar");

var AWS = require("aws-sdk");

class Queue {
    
    constructor(config) {
        this.SQS = new AWS.SQS(config);
    }
    
    create(name, options, cb) {
        if (Object.isFunction(options) && !cb) {
            cb = options;
            options = { };
        }

        this.SQS.createQueue({ QueueName: name, Attributes: options }, function(err, data) {
            if (err) cb(err);
            else {
                this.url = data.QueueUrl;
                cb();
            }
        });
    }
    
    use(name, cb) {
        this.SQS.getQueueUrl({ QueueName: name }, function(err, data) {
            if (err) cb(err);
            else {
                this.url = data.QueueUrl;
                cb();
            }
        });
    }
    
    delete(cb) {
        this.SQS.deleteQueue({ QueueUrl: this.url }, cb);
    }
    
    empty(cb) {
        this.SQS.purgeQueue({ QueueUrl: this.url }, cb);
    }
    
    count(cb) {
        SQS.getQueueAttributes({ 
            QueueUrl: this.url,
            AttributeNames: [ "ApproximateNumberOfMessages" ]
        }, function(err, data) {
            if (err) cb(err);
            else cb(null, parseInt(data.Attributes.ApproximateNumberOfMessages));
        });
    }

    send(message, cb) {
        SQS.sendMessage({
            QueueUrl: this.url,
            MessageBody: JSON.stringify(message)
        }, cb);
    }
    
    receive(count, cb) {
        sqs.receiveMessage({
            QueueUrl: url,
            AttributeNames: [ 'All' ],
            MaxNumberOfMessages: count || 1,
            MessageAttributeNames: [ 'All' ]
        }, function(err, data) {
            if (err) cb(err);
            else cb(null, data ? data.Messages : null);
        });
    }
    
    complete(handle, cb) {
        sqs.deleteMessage({
            QueueUrl: this.url,
            ReceiptHandle: handle,
        }, cb); 
    }

    handle(count, cb) {
        if (Object.isFunction(count) && cb == null) {
            cb = count;
            count = 1;
        }
        
        getMessages(url, count, function(err, messages) {
            if (err) cb(err);
            else if (messages) {
                messages.map(m => { 
                    m.complete = (cb => { 
                        if (cb == null) cb = (() => { });
                        this.complete(m.ReceiptHandle, cb);
                    }); 
                });
            }
            else cb();
        });
    }
    
}

exports.Queue = Queue;