export async function sendEmail(to, subject, html) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`\n📧 [DEV EMAIL] To: ${to} | ${subject}\n${html.replace(/<[^>]+>/g, " ").trim()}\n`);
    return { dev: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM || "Modora Élan <onboarding@resend.dev>", to, subject, html }),
  });
  if (!res.ok) throw new Error("Email send failed: " + (await res.text()));
  return res.json();
}