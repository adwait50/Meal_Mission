const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "Meal Mission <onboarding@resend.dev>",
      to,
      subject,
      text,
    });
    console.log("Email sent to", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;