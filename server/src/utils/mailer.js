const nodemailer = require("nodemailer");

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS || "" },
  });
}

async function sendResetEmail(to, resetLink) {
  const transport = getTransport();
  if (!transport) {
    throw new Error("SMTP não configurado");
  }
  await transport.sendMail({
    from: process.env.SMTP_FROM || "Trampei <no-reply@trampei.local>",
    to,
    subject: "Trampei — redefinição de senha",
    text: `Redefina sua senha acessando: ${resetLink}`,
    html: `<p>Redefina sua senha clicando <a href="${resetLink}">aqui</a>.</p>`,
  });
}

module.exports = { sendResetEmail };
