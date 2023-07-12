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
            subject: "Активація акаунта",
            text: `${link}`
        }
        try {
            return await transporter.sendMail(mailOptions)
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new mailService()
