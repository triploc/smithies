![Smithies](/package.jpg "Smithies")

Any of you boys smithies? Or if not smithies per se, otherwise trained in the metallurgical arts before fate and circumstance led you on a life of aimless wandering.

# A.W. Smithies

AWS application enablers.  Turns complicated Amazon Web Service API's into simple application concepts.

## But how?

```javascript
var smith = require("smithies"),
    config = { accessKeyId: "*", secretAccessKey: "*", region: "us-east-1" };

smith.AWS.config(config);

var bucket = new smith.s3.Bucket(config),
    email = new smith.ses.Email(config),
    queue = new smith.sqs.Queue(config),
    exec = new smith.lambda.Executor(config);
```

## S3

S3 is Amazon's cloud drive.  Each "drive" is called a "bucket" and has a cloud-wide unique name.

```javascript
var bucket = new smith.s3.Bucket(config);
bucket.setBucket("bucket-fuckit");
```

### bucket.create(options, cb)

### bucket.delete(options, cb)

### bucket.read(file, cb)

### bucket.write(file, content, cb)

### bucket.publish(file, content, cb)

### bucket.uploadPolicy(file, redirect, duration, maxSizeMB)

### bucket.list(like, cb)

## SES

SES is Amazon's scalable email dispatcher.  Once your owneership of an email or domain is established, you can send emails originating from that source and let Amazon handle the complications of making sure your message doesn't end up in spam.

```javascript
var email = new smith.ses.Email(config);
```

### email.verifyEmail(email, cb)

### email.verifyDomain(domain, cb)

### email.listIdentities(cb)

### email.deleteIdentify(id, cb)

### email.sendText(from, to, cc, bcc, subject, body, cb)

### email.sendHtml(from, to, cc, bcc, subject, html, cb)

### smith.ses.inlineStyling

## SQS

SQS is Amazon's scalable queue service.  Queues are useful for implementing background processing at fixed or elastic scale.

```javascript
var queue = new smith.ses.Queue(config);
```

### queue.create(name, options, cb)

### queue.open(name, cb)

### queue.delete(cb)

### queue.empty(cb)

### queue.count(cb)

### queue.send(message, cb)

### queue.receive(count, cb)

### queue.complete(handle, cb)

### queue.handle.(count, cb)

## Lambda

Lambda is Amazon's function container service, a mini-environment that can provides horizontal scale to a single function.  When combined with SQS, it enables elastic scale background processing.

```javascript
var exec = new smith.lambda.Executor(config);
```

### exec.create(options, cb)

### exec.update(options, cb)

### exec.delete(id, cb)

### exec.inoke(fn, ...args)

### smith.lambda.buildZip(options, cb)

### smith.lambda.deleteZip(id, cb)