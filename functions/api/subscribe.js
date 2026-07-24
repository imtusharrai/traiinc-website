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
            <svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18" style="display:block;"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.13 6.744 3.048 9.38L1.054 31.2l6.044-1.94a15.9 15.9 0 008.906 2.704C24.826 31.964 32 24.788 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.958 2.042-3.212 2.312-.86.182-1.98.328-5.754-1.236-4.83-2.004-7.938-6.902-8.18-7.222-.232-.32-1.948-2.596-1.948-4.952s1.232-3.508 1.67-3.988c.438-.48.956-.6 1.276-.6.32 0 .636.004.914.016.294.014.688-.112 1.076.82.396.952 1.348 3.288 1.466 3.528.118.24.198.518.04.836-.16.32-.24.518-.478.8-.24.28-.504.626-.72.84-.24.24-.488.498-.21.976.28.48 1.244 2.054 2.672 3.328 1.836 1.636 3.384 2.144 3.864 2.384.48.24.76.2 1.04-.12.278-.32 1.196-1.392 1.514-1.872.318-.48.636-.396 1.076-.24.438.16 2.784 1.312 3.262 1.552.48.24.798.356.916.556.118.198.118 1.156-.278 2.272z"/></svg>
        </span>
        <span style="display:inline-block; vertical-align:middle;">Message on WhatsApp</span>
      </a>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding: 18px 40px; background-color:#fafafa; border-top:1px solid #f0f0f0;">
      <p style="margin:0 0 16px 0;">
        <a href="https://www.facebook.com/traiinc" style="display:inline-block; margin-right:16px; color:#aaaaaa;"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="display:block;"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg></a>
        <a href="https://www.instagram.com/traiinc" style="display:inline-block; margin-right:16px; color:#aaaaaa;"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="display:block;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
        <a href="https://x.com/inctrai" style="display:inline-block; margin-right:16px; color:#aaaaaa;"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="display:block;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
        <a href="https://www.youtube.com/@traiinc" style="display:inline-block; color:#aaaaaa;"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="display:block;"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
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
                from: "Trai Inc <hello@traiinc.com>",
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
