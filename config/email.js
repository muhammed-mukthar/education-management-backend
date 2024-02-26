const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

// Function to send email
const sendEmail = (to, subject, placeholders) => {
  console.log(
    process.env.SENDER_EMAIL,
    "process.env.SENDER_EMAIL",
    process.env.SENDER_PASSWORD
  );

  const html = generateHTML(placeholders);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred while sending email:", error.message);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

// Function to generate HTML from placeholders
const generateHTML = (placeholders) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${placeholders.title}</title>
      <style>
        /* Your CSS styles here */
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${placeholders.title}</h1>
        <p>${placeholders.body}</p>
        <div style="text-align: center;">
          <a href="${placeholders.ctaLink}" class="cta-btn">${placeholders.ctaText}</a>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = sendEmail;
