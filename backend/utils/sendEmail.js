const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try{
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });

        console.log("Email send to", to);
    }

    catch(error){
        console.error("Error sending email to:", error);
    }
};

module.exports = sendEmail;