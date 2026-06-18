export async function sendEmail(to, subject, html) {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.log(`\n📧 [DEV EMAIL] To: ${to} | ${subject}\n${html.replace(/<[^>]+>/g, " ").trim()}\n`);
    return { dev: true };
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Modora Élan", email: process.env.EMAIL_FROM_ADDR || "aliubaidsaifi@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) throw new Error("Email failed: " + (await res.text()));
  return res.json();
}