const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function enviarCorreo({ para, asunto, cuerpo }) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: para,
    subject: asunto,
    html: cuerpo,
  });
}

module.exports = { enviarCorreo };
