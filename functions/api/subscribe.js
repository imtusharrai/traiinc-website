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
            ${preheader('Your 10-Point Tech Audit Checklist is ready. Start with Point #3 — it saves 80% of startups their server costs.')}
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eee;">
                <div style="background:#D91414;background-image:linear-gradient(135deg,#c400b0 0%,#D91414 50%,#e6a100 100%);padding:24px 32px;text-align:center;">
                    <img src="${LOGO_URL}" alt="Trai Inc" style="height:40px;width:40px;display:inline-block;" />
                </div>
                <div style="padding:32px;">
                    <h2 style="margin:0 0 20px;font-size:20px;color:#111;">Your checklist is ready!</h2>
                    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">Hi there,</p>
                    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">Here's the PDF you requested. Start with <strong>Point #3 (Database Indexing)</strong> — it's where 80% of startups lose their server money.</p>
                    <a href="https://www.traiinc.com/assets/lead-magnets/Lead_Magnet_Audit.pdf" style="display:inline-block;padding:12px 28px;background:${ACCENT};color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;">Download the 10-Point Checklist</a>
                    <p style="font-size:15px;color:#333;line-height:1.6;margin:20px 0 0;">Reply to this email if you have questions about your specific stack.</p>
                    <p style="font-size:15px;color:#333;line-height:1.6;margin:20px 0 0;">Best,<br><strong>The Trai Inc Team</strong></p>
                </div>
                <div style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #eee;text-align:center;font-size:13px;color:#888;">
                    <p style="margin:0 0 8px;">Trai Inc &middot; B-2, 11th Floor, DLF MyPad, Gomti Nagar, Lucknow 226010</p>
                    <p style="margin:0;">
                        <a href="https://traiinc.com" style="color:${ACCENT};text-decoration:none;">Website</a> &middot;
                        <a href="https://www.linkedin.com/company/trai-inc" style="color:${ACCENT};text-decoration:none;">LinkedIn</a> &middot;
                        <a href="https://www.instagram.com/trai.inc" style="color:${ACCENT};text-decoration:none;">Instagram</a> &middot;
                        <a href="https://wa.me/917905495478" style="color:${ACCENT};text-decoration:none;">WhatsApp</a>
                    </p>
                </div>
            </div>
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
                subject: "Your Tech Audit Checklist inside",
                html: html
            })
        });

        const emailData = await emailRes.json();
        if (!emailRes.ok) {
            return new Response(JSON.stringify({ error: emailData.message || "Failed to send email" }), { status: 500 });
        }

        if (env.RESEND_AUDIENCE_ID) {
            await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    unsubscribed: false
                })
            });
        }

        return new Response(JSON.stringify({ success: true, message: "Check your inbox!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
