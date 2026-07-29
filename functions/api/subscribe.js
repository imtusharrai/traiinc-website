const ACCENT = '#D91414';
const LOGO_URL = 'https://traiinc.com/assets/logos/logo_gradient.png';

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

        const unsubscribe_link = `https://traiinc.com/api/unsubscribe?email=${encodeURIComponent(email)}`;

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Trai Inc — Resource Delivery Email</title>
</head>
<body style="margin:0; padding:0; background-color:#eeeeef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
${preheader('Here are the resources matched to your business stage.')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eeeeef; padding: 40px 0;">
<tr>
<td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; max-width:600px; width:100%; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">

  <!-- Header -->
  <tr>
    <td style="padding: 36px 40px 0 40px;">
      <img src="${LOGO_URL}" alt="Trai Inc" style="height:32px;width:auto;display:block;" />
    </td>
  </tr>

  <!-- Intro -->
  <tr>
    <td style="padding: 20px 40px 4px 40px;">
      <h1 style="margin:0 0 10px 0; font-size:24px; line-height:1.3; color:#0a0a0a; letter-spacing:-0.4px;">Your resources are ready</h1>
      <p style="margin:0; font-size:15px; line-height:1.65; color:#555555;">
        Hi there,<br><br>
        Thanks for your interest in Trai Inc — we help businesses across India build custom software, mobile apps, and automation that actually fits how they work. Below are the resources matched to where your business is right now.
      </p>
    </td>
  </tr>

  <!-- Primary card: their matched segment -->
  <tr>
    <td style="padding: 28px 40px 0 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fdf2f6, #fff6f0); border-radius:12px; border:1px solid #f5dbe4;">
        <tr>
          <td style="padding:26px 28px;">
            <p style="margin:0 0 6px 0; font-size:11px; font-weight:700; color:#e91e63; letter-spacing:0.6px; text-transform:uppercase;">STARTUPS</p>
            <h2 style="margin:0 0 8px 0; font-size:19px; color:#0a0a0a; line-height:1.35;">Building an MVP in 30 Days: A Startup's Guide</h2>
            <p style="margin:0 0 18px 0; font-size:14px; color:#555555; line-height:1.55;">Most startups don't fail because of bad ideas. They fail because they spend 6 months building a product nobody asked for. Here is our 30-day playbook.</p>
            <a href="https://traiinc.com/blog-building-mvp-30-days.html" style="display:inline-block; background-color:#e91e63; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:12px 22px; border-radius:8px;">Read the Guide →</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Divider -->
  <tr>
    <td style="padding: 32px 40px 12px 40px;">
      <p style="margin:0; font-size:12px; font-weight:700; color:#999999; letter-spacing:0.4px; text-transform:uppercase;">More resources</p>
    </td>
  </tr>

  <!-- Compact list: other segments -->
  <tr>
    <td style="padding: 0 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0; border-bottom:1px solid #f0f0f0;">
            <a href="https://traiinc.com/blog-ai-agents-replacing-manual-workflows.html" style="text-decoration:none; color:#0a0a0a; font-size:14px; font-weight:600;">AI Agents Are Replacing Manual Workflows</a>
            <span style="display:block; font-size:12px; color:#999999; margin-top:2px;">SMALL & MEDIUM BUSINESS</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;">
            <a href="https://traiinc.com/blog-5-free-digital-tools-msme.html" style="text-decoration:none; color:#0a0a0a; font-size:14px; font-weight:600;">5 Free Digital Tools Every MSME Should Be Using Right Now</a>
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
      <a href="https://wa.me/917905495478" style="display:inline-block; background-color:#25D366; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:12px 22px; border-radius:8px;">
        <span style="display:inline-block; vertical-align:middle; margin-right:8px;">
            <img src="https://traiinc.com/assets/icons/whatsapp_white.png" alt="WhatsApp" style="display:block; width:18px; height:18px; border:0;" />
        </span>
        <span style="display:inline-block; vertical-align:middle;">Message on WhatsApp</span>
      </a>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding: 18px 40px; background-color:#fafafa; border-top:1px solid #f0f0f0;">
      <p style="margin:0 0 16px 0;">
        <a href="https://www.facebook.com/traiinc" style="display:inline-block; margin-right:16px; color:#aaaaaa;"><img src="https://traiinc.com/assets/icons/facebook_grey.png" alt="Facebook" style="display:block; width:20px; height:20px; border:0;" /></a>
        <a href="https://www.instagram.com/traiinc" style="display:inline-block; margin-right:16px; color:#aaaaaa;"><img src="https://traiinc.com/assets/icons/instagram_grey.png" alt="Instagram" style="display:block; width:20px; height:20px; border:0;" /></a>
        <a href="https://x.com/inctrai" style="display:inline-block; margin-right:16px; color:#aaaaaa;"><img src="https://traiinc.com/assets/icons/x_grey.png" alt="X" style="display:block; width:20px; height:20px; border:0;" /></a>
        <a href="https://www.youtube.com/@traiinc" style="display:inline-block; color:#aaaaaa;"><img src="https://traiinc.com/assets/icons/youtube_grey.png" alt="YouTube" style="display:block; width:20px; height:20px; border:0;" /></a>
      </p>
      <p style="margin:0 0 6px 0; font-size:12px; color:#aaaaaa;">
        <a href="https://traiinc.com" style="color:#aaaaaa; text-decoration:none;">traiinc.com</a> ·
        <a href="${unsubscribe_link}" style="color:#aaaaaa; text-decoration:none;">Unsubscribe</a>
      </p>
      <p style="margin:0; font-size:11px; color:#c4c4c4; line-height:1.5;">
        Trai Inc &middot; Lucknow, India
      </p>
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
                from: "Trai Inc <support@traiinc.com>",
                to: email,
                subject: "Your Resource is Ready | Trai Inc",
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
