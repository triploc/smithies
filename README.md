![Smithies](/package.jpg "Smithies")

Any of you boys smithies? Or if not smithies per se, otherwise trained in the metallurgical arts before fate and circumstance led you on a life of aimless wandering?

# A.W. Smithies

AWS application enablers.  Turns complicated Amazon Web Service API's into simple application concepts.

## But how?

```javascript
var smith = require("smithies"),
    config = { accessKeyId: "*", secretAccessKey: "*", region: "us-east-1" };

smith.AWS.config(config);

var bucket = new smith.s3.Bucket("bucketname", config),
    email = new smith.ses.Email(config),
    queue = new smith.sqs.Queue(config),
    exec = new smith.lambda.Executor(config);
```

## S3

S3 is Amazon's cloud drive.  Each "drive" is called a "bucket" and has a cloud-wide unique name.

```javascript
var bucket = new smith.s3.Bucket("bucket-fuckit", [config]);
```

The `config` object contains options from the [AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property).

### bucket.create([options,] cb)

Creates a new bucket.

The optional `options` argument contains parameters from the [AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property).

### bucket.erase(cb)

Deletes the bucket.

### bucket.read(file, cb)

Reads a file from the S3 bucket.  The contents of the file is passed to the `cb` as a buffer unless the `Content-Type` header is json-like, in which case it is automatically parsed.

### bucket.write(file, content, cb)

Write an S3 file with the given content (i.e. a Buffer, Typed Array, Blob, String, or ReadableStream).  The file is private and only accessible to the writer.  The `Content-Type` is set based on a [`mime.lookup`](https://github.com/broofa/node-mime#mimelookuppath).

### bucket.publish(file, content, cb)

Writes an S3 file with the given content.  Functionality is identical to `bucket.write` except the file is publicly accessible (readable but not writeable) at https://s3.amazonaws.com/[bucket]/[file].

### bucket.delete(file, cb)

Deletes an S3 file.

### bucket.uploadPolicy(file, redirect, duration, maxSizeMB)

Creates an upload policy to facilitate a direct upload to the S3 bucket.  The file will only be accessible to the creator of the policy.  Use the returned structure to create an HTML form [like this](http://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-post-example.html).

### bucket.list(like, cb)

List files in the bucket that begin with `like`.

### bucket.copy(source, dest, cb)

Copy a file already on S3.

### bucket.move(source, dest, cb)

Moves a file already on S3.

## SES

SES is Amazon's scalable email dispatcher.  Once your owneership of an email or domain is established, you can send emails originating from that source and let Amazon handle the complications of making sure your message doesn't end up in spam.

```javascript
var email = new smith.ses.Email([config]);
```

The `config` object contains options from the [AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#constructor-property).

### email.sendText(from, to, cc, bcc, subject, body, cb)

Sends an email from a verified address with a textual body.

### email.sendHtml(from, to, cc, bcc, subject, html, cb)

Sends an email from a verified address with an HTML body.

### email.verifyEmailAddress(email, cb)

Sends a verification email to the supplied address.  Once verified, mail can be sent on behalf of this address.

### email.listEmailAddresses(cb)

Lists all verified email addresses.

### email.deleteEmailAddress(id, cb)

Deletes a verified email address.

### email.statistics(cb)

Gets statistics on sent email.  Results are [like this](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#getSendStatistics-property).

### smith.ses.inlineStyling(html, relativeTo, cb)

Uses [Juice](https://github.com/Automattic/juice) to inline styles in HTML content.  CSS classes and external stylesheets do not work in certain email clients and websites (such as Gmail).

## SQS

SQS is Amazon's scalable queue service.  Queues are useful for implementing background processing at fixed or elastic scale.

```javascript
var queue = new smith.ses.Queue([config]);
```

The `config` object contains options from the [AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property).

### queue.create(name, [options,] cb)

Creates a queue with the given name.  Optional [AWS SDK Attribute](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#createQueue-property) `options` can be supplied.

### queue.use(name, cb)

Looks up the url of the given queue name and uses this for all subsequent operations.  Either `create` or `use` needs to be called before other methods can be called successfully.

### queue.delete(cb)

Deletes the queue that has been created or is being used.

### queue.empty(cb)

Flushes all pending messages from the queue.

### queue.count(cb)

Gets an approximate number of messages in the queue.

### queue.send(message, cb)

Sends a message to the queue.

### queue.receive(count, cb)

Receives up to 10 messages from the queue.

### queue.complete(handle, cb)

Completes the processing of a message.

### queue.handle(count, cb)

Combines the `receive` and `complete` methods.  Receives up to 10 messages from the queue.  Each message will have a `complete` method to make processing easier.  Unlike the top-level `complete` method, a callback parameter is not required.

## Lambda

Lambda is Amazon's function container service, a mini-environment that can provides horizontal scale to a single function.  When combined with SQS, it enables elastic scale background processing.

```javascript
var exec = new smith.lambda.Executor([config]);
```

The `config` object contains options from the [AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#constructor-property).

### exec.create(options, cb)

Creates a new Lambda function.

### exec.update(options, cb)

Updates the code for an existing Lambda function.

### exec.delete(id, cb)

Deletes a Lambda function.

### exec.invoke(fn, ...args)

Invokes a Lambda function.  The first argument is the function name and the remaining arguments are spread into the function.

### smith.lambda.buildZip(options, cb)

Builds a Lambda deployment package from the current environment.  The callback returns a `Buffer` containing the generated zip file.