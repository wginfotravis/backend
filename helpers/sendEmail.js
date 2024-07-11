import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: process.env.HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: true,
    //   auth: {
    //     user: process.env.GMAIL,
    //     pass: process.env.GMAIL_PASS,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    //   // sendmail: true,
    // });

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });
    let mailOptions;
    // Check if 'to' is an array
    if (Array.isArray(to)) {
      // Define the email options with 'to' as a string (comma-separated if multiple elements)
      mailOptions = {
        from: "POS",
        to: to.length === 1 ? to[0] : to.join(","),
        subject,
        html,
      };
    } else {
      // 'to' is not an array, so use it as is
      mailOptions = {
        from: "POS",
        to,
        subject,
        html,
      };
    }

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export default sendEmail;
