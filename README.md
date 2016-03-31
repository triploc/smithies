![Smithies](/package.jpg "Smithies")

    Any of you boys smithies? Or if not smithies per se, otherwise trained in the metallurgical arts before fate and circumstance led you on a life of aimless wandering.

# A.W. Smithies

AWS application enablers.  Turns complicated Amazon Web Service API's into simple application concepts.

## But how?

```javascript
var smith = require("smithies"),
    config = { accessKeyId: "*", secretAccessKey: "*", region: "us-east-1" };

smith.AWS.config(config);

var exec = new smith.lamda.Executor(config),
    bucket = new smith.s3.Bucket(config),
    email = new smith.ses.Email(config),
    queue = new smith.sqs.Queue(config);
```