"use strict";

require("sugar");

var AWS = require("aws-sdk"),
    execFile = require('child_process').execFile,
    uuid = require("node-uuid"),
    fs = require("fs"),
    ejs = require("ejs");

class Executor {
    
    constructor(options) {
        this.lambda = new AWS.Lambda(config);
    }
    
    create(options, cb) {
        options = options || { };
        buildZip(options, function(err, buffer) {
            if (err) cb(err);
            else {
                lambda.createFunction(Object.merge({
                    Code: { ZipFile: buffer },
                    FunctionName: options.id, 
                    Handler: options.id + ".handler",
                    Runtime: 'nodejs',
                    MemorySize: 128,
                    Publish: true
                }, options), cb);
            }
        });
    }
    
    update(options, cb) {
        buildZip(options, function(err, buffer) {
            if (err) cb(err);
            else {
                lambda.updateFunctionCode({
                    FunctionName: options.id,
                    Publish: true,
                    ZipFile: buffer
                }, cb);
            }
        });
    }
    
    delete(id, cb) {
        lambda.deleteFunction({ FunctionName: id }, cb);
    }
    
    invoke(fn) {
        lambda.invoke({
            FunctionName: fn,
            InvocationType: 'RequestResponse',
            LogType: 'None',
            Payload: JSON.stringify({ args: Array.create(arguments).from(1) })
        }, function(err, data) {
            if (err) cb(err);
            else {
                if (data.FunctionError == "Unhandled" || data.StatusCode != 200) {
                    cb(new Error("Generic Lambda invokation error. Status code " + data.StatusCode + "."));
                }
                else {
                    var response = JSON.parse(data.Payload);
                    if (data.FunctionError == "Handled") cb(response);
                    else cb(null, response);
                }
            }
        });
    }
    
}

exports.Executor = Executor;

function buildZip(options, cb) {
    if (!options.id) options.id = uuid();
    fs.writeFile(options.id + ".js", ejs.render(__dirname + "/lambda.ejs", options), function(err) {
        if (err) cb(err);
        else {
            execFile('zip', [ options.id + ".zip", "node_modules/", options.id + ".js" ], function(err) {
                if (err) cb(err);
                else {
                    fs.readFile(options.id + ".zip", function(err, buffer) {
                        if (err) cb(err);
                        else {
                            fs.unlink(id + ".js", function(err) {
                                if (err) cb(err);
                                else {
                                    fs.unlink(id + ".zip", function(err) {
                                        cb(err, data);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

exports.buildZip = buildZip;