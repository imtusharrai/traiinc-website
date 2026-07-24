const ACCENT = '#D91414';
const LOGO_URL = 'https://traiinc.com/assets/logos/logo_white.png';

function preheader(text) {
    return `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${text}${'&#847; '.repeat(30)}</div>`;
}

export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const formData = await request.formData();
        const email = formData.get('email');

        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
        }

        if (!env.RESEND_API_KEY) {
            return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
        }

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Trai Inc — Thanks for Subscribing!</title>
</head>
<body style="margin:0; padding:0; background-color:#eeeeef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
${preheader('Thanks for subscribing to Trai Inc Weekly Insights.')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eeeeef; padding: 40px 0;">
<tr>
<td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; max-width:600px; width:100%; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">

  <!-- Header -->
  <tr>
    <td style="padding: 36px 40px 0 40px;">
      <span style="display:inline-block; font-weight:800; font-size:20px; letter-spacing:-0.3px;">
        <span style="color:#D91414;">T</span><span style="color:#111111;">rai </span><span style="color:#D91414;">I</span><span style="color:#111111;">nc</span>
      </span>
    </td>
  </tr>

  <!-- Intro -->
  <tr>
    <td style="padding: 20px 40px 4px 40px;">
      <h1 style="margin:0 0 10px 0; font-size:24px; line-height:1.3; color:#0a0a0a; letter-spacing:-0.4px;">Thanks for subscribing!</h1>
      <p style="margin:0; font-size:15px; line-height:1.65; color:#555555;">
        Hi there,<br><br>
        Thanks for subscribing to Trai Inc. We'll send you our weekly insights on custom software, AI automations, and how businesses across India are scaling with tech.<br><br>
        While you wait for the next update, check out some of our recent deep dives below.
      </p>
    </td>
  </tr>

  <!-- Divider -->
  <tr>
    <td style="padding: 32px 40px 12px 40px;">
      <p style="margin:0; font-size:12px; font-weight:700; color:#999999; letter-spacing:0.4px; text-transform:uppercase;">Recent Insights</p>
    </td>
  </tr>

  <!-- Compact list: real blog posts -->
  <tr>
    <td style="padding: 0 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0; border-bottom:1px solid #f0f0f0;">
            <a href="https://traiinc.com/blog-building-mvp-30-days.html" style="text-decoration:none; color:#0a0a0a; font-size:14px; font-weight:600;">Building an MVP in 30 Days: A Startup's Guide</a>
            <span style="display:block; font-size:12px; color:#999999; margin-top:2px;">STARTUPS</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0; border-bottom:1px solid #f0f0f0;">
            <a href="https://traiinc.com/blog-ai-agents-replacing-manual-workflows.html" style="text-decoration:none; color:#0a0a0a; font-size:14px; font-weight:600;">How AI Agents Are Replacing Manual Business Workflows</a>
            <span style="display:block; font-size:12px; color:#999999; margin-top:2px;">AI & AUTOMATION</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;">
            <a href="https://traiinc.com/blog-5-free-digital-tools-msme.html" style="text-decoration:none; color:#0a0a0a; font-size:14px; font-weight:600;">5 Free Digital Tools Every Micro & Local Business Should Be Using</a>
            <span style="display:block; font-size:12px; color:#999999; margin-top:2px;">MICRO & LOCAL BUSINESS</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Closing -->
  <tr>
    <td style="padding: 32px 40px 0 40px;">
      <p style="margin:0; font-size:14px; line-height:1.65; color:#555555;">
        Questions about your specific setup? Just reply to this email, or message us directly — no pitch, just a conversation.
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding: 14px 40px 36px 40px;">
      <a href="https://wa.me/917905495478" style="display:inline-block; background-color:#0a0a0a; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:12px 22px; border-radius:8px;">Message on WhatsApp →</a>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding: 18px 40px; background-color:#fafafa; border-top:1px solid #f0f0f0; text-align:center;">
        <p style="margin:0 0 12px; font-size: 12px;">
            <a href="https://traiinc.com" style="color:#aaaaaa; text-decoration:none;">Website</a> &middot;
            <a href="https://www.linkedin.com/company/trai-inc" style="color:#aaaaaa; text-decoration:none;">LinkedIn</a> &middot;
            <a href="https://www.instagram.com/trai.inc" style="color:#aaaaaa; text-decoration:none;">Instagram</a> &middot;
            <a href="https://wa.me/917905495478" style="color:#aaaaaa; text-decoration:none;">WhatsApp</a>
        </p>
        <p style="margin:0; font-size:11px; color:#aaa;">Trai Inc &middot; B-2, 11th Floor, DLF MyPad, Gomti Nagar, Lucknow 226010</p>
    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
        `;

        const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Trai Inc <hello@traiinc.com>",
                to: email,
                subject: "Welcome to Trai Inc Weekly Insights",
                html: html
            })
        });

        if (!emailRes.ok) {
            const error = await emailRes.text();
            console.error("Resend API Error:", error);
            return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
