const {sesClient} = require("../config/s3Client");

// Create sendEmail params
async function sendEmail(recipients,weddingName){
// Set the parameters
    const params = {
        Destination: {
        CcAddresses: [
            /* more CC email addresses */
        ],
        ToAddresses: recipients,
        },
        Source: "joseph.insalaco1@gmail.com", //SENDER_ADDRESS
        Message: { /* required */
            Body: { /* required */
              Html: {
               Charset: "UTF-8",
               Data: `You have been invited to ${weddingName} please visit http://localhost:3000/weddings/attending to RSVP`
              }
             },
             Subject: {
              Charset: 'UTF-8',
              Data: `You\'ve been invited to ${weddingName}!`
             }
            },
        ReplyToAddresses: [],
    };

    try {
        sesClient.sendEmail(params).promise();
        console.log("success")
    } catch(e){
        console.log("Error,",e);
    }
};

module.exports = { sendEmail }
