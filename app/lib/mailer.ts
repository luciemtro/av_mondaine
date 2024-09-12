import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", //
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Avenue Mondaine" <no-reply@avenuemondaine.com>`, // Mettre l'adresse expéditeur ici
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
