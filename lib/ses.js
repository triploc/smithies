"use strict";

require("sugar");

var async = require("async"),
    AWS = require("aws-sdk"),
    juice = require('juice'),
    path = require("path");

class Email {
    
    constructor(config) {
        this.SES = new AWS.SES(config);
    };
    
    sendText(from, to, cc, bcc, subject, body, cb) {
        var address = { };
        if (bcc) address.BccAddresses = (Array.isArray(bcc) ? bcc : [ bcc ]);
        if (cc) address.CcAddresses = (Array.isArray(cc) ? cc : [ cc ]);
        if (to) address.ToAddresses = (Array.isArray(to) ? to : [ to ]);

        this.SES.sendEmail({
            Destination: address,
            Message: {
                Body: { Text: { Data: body, Charset: 'UTF-8' } },
                Subject: { Data: subject, Charset: 'UTF-8' }
            },
            Source: from,
            ReplyToAddresses: [ from ],
            ReturnPath: from
        }, cb);
    }
    
    sendHtml(from, to, cc, bcc, subject, html, cb) {
        var address = { };
        if (bcc) address.BccAddresses = (Array.isArray(bcc) ? bcc : [ bcc ]);
        if (cc) address.CcAddresses = (Array.isArray(cc) ? cc : [ cc ]);
        if (to) address.ToAddresses = (Array.isArray(to) ? to : [ to ]);

        this.SES.sendEmail({
            Destination: address,
            Message: {
                Body: { Html: { Data: html, Charset: 'UTF-8' } },
                Subject: { Data: subject, Charset: 'UTF-8' }
            },
            Source: from,
            ReplyToAddresses: [ from ],
            ReturnPath: from
        }, cb);
    }

    verifyEmail(email, cb) {
        this.SES.verifyEmailIdentity({ EmailAddress: email }, cb);
    }

    verifyDomain(domain, cb) {
        this.SES.verifyDomainIdentity({ Domain: domain }, cb);
    }

    listIdentities(cb) {
        this.SES.listIdentities({ MaxItems: 0 }, cb);
    }

    deleteIdentity(id, cb) {
        this.SES.deleteIdentity({ Identity: id }, cb);
    }
    
}

exports.Email = Email;

exports.inlineStyling = function(html, relativeTo, cb) {
    juice.juiceResources(html, { webResources: { relativeTo: relativeTo } }, cb);
};