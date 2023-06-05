import nodemailer from "nodemailer";

const host = String(process.env.SMTP_HOST);
const port = Number(process.env.SMTP_PORT);

const user = String(process.env.SMTP_USER);
const pass = String(process.env.SMTP_PASS);

const EmailConnection = async (
  email: string,
  subject: string,
  emailBody: string
) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "jonathan.beahan95@ethereal.email",
      pass: "Ymn5aktPFEC3JE89wW",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "jonathan.beahan95@ethereal.email", // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: emailBody, // html body
  });

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default EmailConnection;
