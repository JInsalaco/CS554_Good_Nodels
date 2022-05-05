// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create sendEmail params
async function sendEmail(recipients,template){
// Set the parameters
    const params = {
        Destination: {
            recipients,
        CcAddresses: [
            /* more CC email addresses */
        ],
        ToAddresses: recipients,
        },
        Source: "SENDER_ADDRESS", //SENDER_ADDRESS
        Template: template, // TEMPLATE_NAME
        TemplateData: '{ "REPLACEMENT_TAG_NAME":"REPLACEMENT_VALUE" }' /* required */,
        ReplyToAddresses: [],
    };

    try {
    const data = await sesClient.send(new SendTemplatedEmailCommand(params));
    console.log("Success.", data);
    return "Successfully sent email!";
    } catch (err) {
    console.log("Error", err.stack);
    }
};

modules.export = { sendEmail }
