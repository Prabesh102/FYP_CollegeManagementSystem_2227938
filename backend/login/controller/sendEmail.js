const nodemailer = require("nodemailer");
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "np03cs4s220296@heraldcollege.edu.np",
        pass: "Prabeshisdon123@",
      },
    });

    const mailOptions = {
      from: "np03cs4s220296@heraldcollege.edu.np",
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendEmail };
