const nodemailer = require('nodemailer');
require('dotenv').config();

class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendMail({ to, subject, text, html }) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
            html,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = new Mailer();
