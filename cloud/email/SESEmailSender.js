var AWS = require('aws-sdk');

var ses = new AWS.SES({region: "us-east-1"});

exports.sendEmail = function( mail )
{
    var response = {message: "not set"};
    console.log("sending mail with SES {}", mail);
    try {
        ses.sendEmail( getTemplate(mail.to, mail.text), function(err, data){
            if (err) { // an error occurred
                return handleSendError( err, response )
            } else {  // successful response
                return handleSendSuccess( data, response );
            }
        } );
    } catch (e) {
        console.log("failed to send", e);
        response.message = "failed to send";
        return response;
    }
    console.log("exiting from the sendEmail function");
}

function handleSendError( error, response )
{
    console.log("email failed to send....");
    console.error( error );
    response.error = error;
    response.message = "Failed to send";
    return response;
}

function handleSendSuccess( data, response )
{
    console.log("email sent successfull");
    response.message = "sent successfully!"
    response.data = data;
    return response;
}

function getTemplate(to, text){
    return {
        Destination: { /* required */
            // BccAddresses: [
            //     'STRING_VALUE'
            //     /* more items */
            // ],
            // CcAddresses: [
            //     'STRING_VALUE'
            //     /* more items */
            // ],
            ToAddresses: [
                to
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Data: text /* required */
                },
                Text: {
                    Data: text /* required */
                }
            },
            Subject: { /* required */
                Data: 'test subject: ' + text /* required */
            }
        },
        Source: 'notifications@oneroost.com', /* required */
        ReplyToAddresses: [
            'notifications@oneroost.com'
            /* more items */
        ]
        // ReturnPath: 'STRING_VALUE',
        // ReturnPathArn: 'STRING_VALUE',
        // SourceArn: 'STRING_VALUE'
    };
}
