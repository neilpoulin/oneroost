var Client = require("node-rest-client").Client;
var MailParser = require("mailparser").MailParser;
var mailparser = new MailParser();
var PARSE_APP_ID = "TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq";
var PARSE_REST_KEY = "pXy1rBiEEAYEdkFSR0kHu8zUWLshXpX2KuRjmVBH";
var domain = "http://aws.oneroost.com/parse";

console.log("client installed")

var headers = getHeaders();

var query = {email: "neil@oneroost.com"};

var args = {
    parameters: {where: JSON.stringify( query )},
    headers: headers
}

var client = getClient();

client.methods.getUsers( args, function(data, response){
    // parsed response body as js object
        console.log(data);
        // raw response
        // console.log(response);
});


// setup an event listener when the parsing finishes
mailparser.on("end", function(mail_object){
    console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
    console.log("Subject:", mail_object.subject); // Hello world!
    console.log("Text body:", mail_object.text); // How are you today?
});

// send the email source to the parser
mailparser.write(getEmail());
mailparser.end();


function getClient( ){
    var client = new Client();
    client.registerMethod("getUsers", domain + "/classes/_User", "GET")
    return client;
}

function getHeaders()
{
    return {
        "X-Parse-Application-Id": PARSE_APP_ID,
        "X-Parse-REST-API-Key": PARSE_REST_KEY
    }
}


function getEmail(){
    return '{"notificationType":"Received","mail":{"timestamp":"2016-07-20T05:41:37.304Z","source":"neil.j.poulin@gmail.com","messageId":"1en6ud2oqpo3r8c1v22n23pu7bdr2e11t8rqb6o1","destination":["testing@reply.oneroost.com"],"headersTruncated":false,"headers":[{"name":"Return-Path","value":"<neil.j.poulin@gmail.com>"},{"name":"Received","value":"from mail-qt0-f173.google.com (mail-qt0-f173.google.com [209.85.216.173]) by inbound-smtp.us-east-1.amazonaws.com with SMTP id 1en6ud2oqpo3r8c1v22n23pu7bdr2e11t8rqb6o1 for testing@reply.oneroost.com; Wed, 20 Jul 2016 05:41:37 +0000 (UTC)"},{"name":"X-SES-Spam-Verdict","value":"PASS"},{"name":"X-SES-Virus-Verdict","value":"PASS"},{"name":"Received-SPF","value":"pass (spfCheck: domain of _spf.google.com designates 209.85.216.173 as permitted sender) client-ip=209.85.216.173; envelope-from=neil.j.poulin@gmail.com; helo=mail-qt0-f173.google.com;"},{"name":"Authentication-Results","value":"amazonses.com; spf=pass (spfCheck: domain of _spf.google.com designates 209.85.216.173 as permitted sender) client-ip=209.85.216.173; envelope-from=neil.j.poulin@gmail.com; helo=mail-qt0-f173.google.com; dkim=pass header.i=@gmail.com;"},{"name":"Received","value":"by mail-qt0-f173.google.com with SMTP id 52so21032546qtq.3 for <testing@reply.oneroost.com>; Tue, 19 Jul 2016 22:41:37 -0700 (PDT)"},{"name":"DKIM-Signature","value":"v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20120113; h=mime-version:from:date:message-id:subject:to; bh=MZ5FOSsFbUORZmXmyFmRArBBQk22z5XbXKf9l+j5gDs=; b=W4UwC+7Egxkq0yKgLLNXOWOBuuFzgxvZ67bupJWNwEhLD5OxTaURkrtBPoxOIuHP/sujuJ20h/9vizpLU6CNGCmvYhjvYeLqAsfsbM+9erQLBZbCMc9BB49+NhS24SPNShjKg7AgrwDI7BZ8kJTOz7hQ9YvzJsMwATo5mEwPz5ISbKS8RLC+z4Ewc4vWgtH0ruy3ow12+o6tyB1BEQni2KU5eZQ/stIymPjm6lYhIq6LlDZxJ6yDyYtYO/E2iw2JEmJDYl7if9SjA9nLy0RobAgnJmisGhiDjYKNGyNxTDmUptdr/AlDJKOPTPM6YLYqwaj1Y5xqqhqGo2Z8Ntr/vA=="},{"name":"X-Google-DKIM-Signature","value":"v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20130820; h=x-gm-message-state:mime-version:from:date:message-id:subject:to; bh=MZ5FOSsFbUORZmXmyFmRArBBQk22z5XbXKf9l+j5gDs=; b=AFmMDWlNpX/C5m6hVugNCBO3DWk8qRte9tTAzVebyD8uHz6b3NloIIK8aNufJ4FPkQ BTTPY9wZRkT8sQNPTAkCmgTdoJSRE0T7doCTINKbhThYCbRQmFnmV0kdMgmKjF+Bq36v fhYg+wpDa30uzhKEd8lfUoaMcaY9Qw5mcN2sS1Bbuit5yq1bPmCpnxtypM+zwNwgSQ9q xuSykH64TGe8bePSozUNdbRdcpIXR+U7dq1TjWdm/i7p0Z0oxIjTzJNeFnK6C3PK/bWh t2y5TdrUQG0A+tOoCx/2EXZzZhQ9jIW+92MfQp5fpGjKn7t/f03KiO9ixxj5TJZagLPT GsTw=="},{"name":"X-Gm-Message-State","value":"ALyK8tKsZMzOLaf+EktQcHe5sLcccXd+PDq2BWw4P7Jvyg6HGaqAq9AwqYoGtkGyUvaTL7mJU6YHuA8S54AsaQ=="},{"name":"X-Received","value":"by 10.200.55.215 with SMTP id e23mr69735991qtc.20.1468993296773; Tue, 19 Jul 2016 22:41:36 -0700 (PDT)"},{"name":"MIME-Version","value":"1.0"},{"name":"From","value":"Neil Poulin <neil.j.poulin@gmail.com>"},{"name":"Date","value":"Wed, 20 Jul 2016 05:41:27 +0000"},{"name":"Message-ID","value":"<CANrYnY3DHroVUAvtrJABAsjiedhrSiYWO_C3R5TNMz56c_VTjA@mail.gmail.com>"},{"name":"Subject","value":"this is the subject"},{"name":"To","value":"\"testing@reply.oneroost.com\" <testing@reply.oneroost.com>"},{"name":"Content-Type","value":"multipart/alternative; boundary=001a11471b9ca1bb5705380aa71c"}],"commonHeaders":{"returnPath":"neil.j.poulin@gmail.com","from":["Neil Poulin <neil.j.poulin@gmail.com>"],"date":"Wed, 20 Jul 2016 05:41:27 +0000","to":["\"testing@reply.oneroost.com\" <testing@reply.oneroost.com>"],"messageId":"<CANrYnY3DHroVUAvtrJABAsjiedhrSiYWO_C3R5TNMz56c_VTjA@mail.gmail.com>","subject":"this is the subject"}},"receipt":{"timestamp":"2016-07-20T05:41:37.304Z","processingTimeMillis":311,"recipients":["testing@reply.oneroost.com"],"spamVerdict":{"status":"PASS"},"virusVerdict":{"status":"PASS"},"spfVerdict":{"status":"PASS"},"dkimVerdict":{"status":"PASS"},"action":{"type":"SNS","topicArn":"arn:aws:sns:us-east-1:062773471215:email-reply","encoding":"UTF8"}},"content":"Return-Path: <neil.j.poulin@gmail.com>\r\nReceived: from mail-qt0-f173.google.com (mail-qt0-f173.google.com [209.85.216.173])\r\n by inbound-smtp.us-east-1.amazonaws.com with SMTP id 1en6ud2oqpo3r8c1v22n23pu7bdr2e11t8rqb6o1\r\n for testing@reply.oneroost.com;\r\n Wed, 20 Jul 2016 05:41:37 +0000 (UTC)\r\nX-SES-Spam-Verdict: PASS\r\nX-SES-Virus-Verdict: PASS\r\nReceived-SPF: pass (spfCheck: domain of _spf.google.com designates 209.85.216.173 as permitted sender) client-ip=209.85.216.173; envelope-from=neil.j.poulin@gmail.com; helo=mail-qt0-f173.google.com;\r\nAuthentication-Results: amazonses.com;\r\n spf=pass (spfCheck: domain of _spf.google.com designates 209.85.216.173 as permitted sender) client-ip=209.85.216.173; envelope-from=neil.j.poulin@gmail.com; helo=mail-qt0-f173.google.com;\r\n dkim=pass header.i=@gmail.com;\r\nReceived: by mail-qt0-f173.google.com with SMTP id 52so21032546qtq.3\r\n        for <testing@reply.oneroost.com>; Tue, 19 Jul 2016 22:41:37 -0700 (PDT)\r\nDKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n        d=gmail.com; s=20120113;\r\n        h=mime-version:from:date:message-id:subject:to;\r\n        bh=MZ5FOSsFbUORZmXmyFmRArBBQk22z5XbXKf9l+j5gDs=;\r\n        b=W4UwC+7Egxkq0yKgLLNXOWOBuuFzgxvZ67bupJWNwEhLD5OxTaURkrtBPoxOIuHP/s\r\n         ujuJ20h/9vizpLU6CNGCmvYhjvYeLqAsfsbM+9erQLBZbCMc9BB49+NhS24SPNShjKg7\r\n         AgrwDI7BZ8kJTOz7hQ9YvzJsMwATo5mEwPz5ISbKS8RLC+z4Ewc4vWgtH0ruy3ow12+o\r\n         6tyB1BEQni2KU5eZQ/stIymPjm6lYhIq6LlDZxJ6yDyYtYO/E2iw2JEmJDYl7if9SjA9\r\n         nLy0RobAgnJmisGhiDjYKNGyNxTDmUptdr/AlDJKOPTPM6YLYqwaj1Y5xqqhqGo2Z8Nt\r\n         r/vA==\r\nX-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n        d=1e100.net; s=20130820;\r\n        h=x-gm-message-state:mime-version:from:date:message-id:subject:to;\r\n        bh=MZ5FOSsFbUORZmXmyFmRArBBQk22z5XbXKf9l+j5gDs=;\r\n        b=AFmMDWlNpX/C5m6hVugNCBO3DWk8qRte9tTAzVebyD8uHz6b3NloIIK8aNufJ4FPkQ\r\n         BTTPY9wZRkT8sQNPTAkCmgTdoJSRE0T7doCTINKbhThYCbRQmFnmV0kdMgmKjF+Bq36v\r\n         fhYg+wpDa30uzhKEd8lfUoaMcaY9Qw5mcN2sS1Bbuit5yq1bPmCpnxtypM+zwNwgSQ9q\r\n         xuSykH64TGe8bePSozUNdbRdcpIXR+U7dq1TjWdm/i7p0Z0oxIjTzJNeFnK6C3PK/bWh\r\n         t2y5TdrUQG0A+tOoCx/2EXZzZhQ9jIW+92MfQp5fpGjKn7t/f03KiO9ixxj5TJZagLPT\r\n         GsTw==\r\nX-Gm-Message-State: ALyK8tKsZMzOLaf+EktQcHe5sLcccXd+PDq2BWw4P7Jvyg6HGaqAq9AwqYoGtkGyUvaTL7mJU6YHuA8S54AsaQ==\r\nX-Received: by 10.200.55.215 with SMTP id e23mr69735991qtc.20.1468993296773;\r\n Tue, 19 Jul 2016 22:41:36 -0700 (PDT)\r\nMIME-Version: 1.0\r\nFrom: Neil Poulin <neil.j.poulin@gmail.com>\r\nDate: Wed, 20 Jul 2016 05:41:27 +0000\r\nMessage-ID: <CANrYnY3DHroVUAvtrJABAsjiedhrSiYWO_C3R5TNMz56c_VTjA@mail.gmail.com>\r\nSubject: this is the subject\r\nTo: \"testing@reply.oneroost.com\" <testing@reply.oneroost.com>\r\nContent-Type: multipart/alternative; boundary=001a11471b9ca1bb5705380aa71c\r\n\r\n--001a11471b9ca1bb5705380aa71c\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\nthis is the body\r\n\r\n--001a11471b9ca1bb5705380aa71c\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n<div dir=\"ltr\">this is the body</div>\r\n\r\n--001a11471b9ca1bb5705380aa71c--\r\n"}'
}
