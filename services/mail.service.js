const nodemailer = require('nodemailer')

class mailService{

    async sendActivationMail(to, link) {//file,
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD
            }
        })

        const mailOptions = {
            from: 'wbailey0101@gmail.com',
            to: to,
            subject: "Registration on Exellence.space",
            text: `Welcome to Exellence.space 
 Please, follow the link below to activate Your account:  ${link}. 
 Note: if the link doesn't work, just copy and paste the URL in Your browser window.
 Your credentials are:  Login: ${to} . 
Lets go to platform 
 
We are glad to see you in our community. Feel free to contact us in any cases. Let's make more study together. 

This is a system-generated email and reply is not required.




 
Copyright Â© 2023   Exellence.space  All rights reserved. 
Contact number:  TG
Support: TH
Our mailing address is: 
 Exellence.space 
67G Chornovola avenue 
Lviv 79058 
Ukraine 
Want to change how you receive these emails? 
You can update your preferences or unsubscribe from this list.`
        }
        try {
            return await transporter.sendMail(mailOptions)
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new mailService()
