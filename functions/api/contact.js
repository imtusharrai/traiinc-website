export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const formData = await request.formData();

        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const phone = formData.get('phone') || '';
        const company = formData.get('company') || '';
        const budget = formData.get('budget') || '';
        const message = formData.get('message') || '';
        const serviceType = formData.get('service_type') || '';
        const needsLogin = formData.get('needs_login') || '';
        const services = formData.getAll('services').filter(Boolean);

        if (!name || (!email && !phone)) {
            return new Response(JSON.stringify({ error: "Name and either email or phone are required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!env.RESEND_API_KEY) {
            return new Response(JSON.stringify({ error: "Server configuration error" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Trai Inc Website <hello@traiinc.com>",
                to: "hello@traiinc.com",
                reply_to: email || undefined,
                subject: serviceType
                    ? `MSME Estimate Request from ${name}`
                    : `New enquiry from ${name}${company ? ` (${company})` : ''}`,
                html: `
                    <h2>${serviceType ? 'MSME Cost Estimate Request' : 'New Contact Form Submission'}</h2>
                    <table style="border-collapse:collapse;width:100%;max-width:600px;">
                        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(name)}</td></tr>
                        ${email ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>` : ''}
                        ${phone ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(phone)}</td></tr>` : ''}
                        ${company ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Company</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(company)}</td></tr>` : ''}
                        ${budget ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Budget</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(budget)}</td></tr>` : ''}
                        ${serviceType ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(serviceType)}</td></tr>` : ''}
                        ${needsLogin ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Needs Login</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(needsLogin)}</td></tr>` : ''}
                        ${services.length ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top;">Interested In</td><td style="padding:8px;border-bottom:1px solid #eee;">${services.map(s => escapeHtml(s.replace(/-/g, ' '))).join(', ')}</td></tr>` : ''}
                        ${message ? `<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;white-space:pre-wrap;">${escapeHtml(message)}</td></tr>` : ''}
                    </table>
                `
            })
        });

        const emailData = await emailRes.json();
        if (!emailRes.ok) {
            return new Response(JSON.stringify({ error: emailData.message || "Failed to send" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Auto-reply only when we have an email address
        if (email) await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Trai Inc <hello@traiinc.com>",
                to: email,
                subject: "We received your message — Trai Inc",
                html: `
                    <p>Hi ${escapeHtml(name)},</p>
                    <p>Thanks for reaching out! We've received your enquiry and will get back to you within 24 hours.</p>
                    <p>If it's urgent, feel free to WhatsApp us at <a href="https://wa.me/917905495478">+91 7905 495 478</a>.</p>
                    <p>Best,<br>The Trai Inc Team</p>
                `
            })
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
