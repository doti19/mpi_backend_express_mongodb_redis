const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const {email, server} = require('./config');
const {logger} = require('./logger')

// 1. create a transporter
const transporter = nodemailer.createTransport({
    service: email.service,
    host: email.host,
    port: email.port,
    auth: {
        user: email.username,
        pass: email.password,
    },
});

if(server.env !=="test"){
    transporter.verify().then(()=>{
        console.log('Connected to Email Server');
    }).catch((err)=>{
        console.log('Unable to connect to Email Server', err);
    });
}


const sendEmail = (options) =>{
    try{
        // 1. compile the template
        const source = fs.readFileSync(`public/template/${options.template}`, 'utf8');
        const compiledTemplate = handlebars.compile(source);

        // 2. define the email option
        const mailOptions = {
            from:email.from,
            to: options.email,
            subject: options.subject,
            
            text: options.message? options.message: "",
            html: compiledTemplate(options.payload),
        };
        // 3. actuall send the email
         transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                logger.error(`Unable to send Email: ${err.message}`);
            }else{
                logger.info('Email sent: ' + info.response);
            }
        });
    }catch(error){
        console.log(error);
        return new Error(error);
    }
}

module.exports = sendEmail;