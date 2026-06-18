import nodemailer from "nodemailer";

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST, user = process.env.SMTP_USER, pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // 587 = STARTTLS
    auth: { user, pass },
  });
  return transporter;
}

export async function sendEmail(to, subject, html) {
  const t = getTransporter();
  if (!t) {
    console.log(`\n📧 [DEV EMAIL] To: ${to} | ${subject}\n${html.replace(/<[^>]+>/g, " ").trim()}\n`);
    return { dev: true };
  }
  await t.sendMail({ from: process.env.EMAIL_FROM || `Modora Élan <${process.env.SMTP_USER}>`, to, subject, html });
  return { sent: true };
}