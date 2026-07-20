const BUDGET_LABELS = {
    'under-50k': 'Under ₹50K',
    '50k-1l': '₹50K–1L',
    '1l-3l': '₹1–3L',
    '3l-5l': '₹3–5L',
    '5l-10l': '₹5–10L',
    '10l-plus': '₹10L+'
};

const SERVICE_LABELS = {
    'custom-software': 'Custom Software Development',
    'web-development': 'Web Development',
    'mobile-apps': 'Mobile App Development',
    'flutter-app-development': 'Flutter App Development',
    'ecommerce-development': 'E-Commerce Development',
    'custom-crm-development': 'Custom CRM Development',
    'wordpress-cms-development': 'WordPress & CMS',
    'ai-automation': 'AI & Automation',
    'data-analytics': 'Data & Analytics',
    'content-creation': 'AI Content Creation',
    'workflow-automation': 'Workflow Automation',
    'cloud-devops': 'Cloud & DevOps',
    'cybersecurity': 'Cybersecurity',
    'enterprise-platforms': 'Enterprise Platforms',
    'digital-marketing': 'Digital Marketing',
    'ui-ux-design': 'UI/UX Design',
    'lead-gen-scraping': 'Lead Gen & Scraping',
    'motion-video': 'Motion & Video'
};

const ACCENT = '#D91414';
const LOGO_URL = 'https://traiinc.com/assets/logos/logo.png';

function preheader(text) {
    return `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${text}${'&#847; '.repeat(30)}</div>`;
}

function emailHeader(title, preheaderText) {
    return `
    ${preheaderText ? preheader(preheaderText) : ''}
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eee;">
        <div style="background:#0a0a0a;padding:24px 32px;text-align:center;">
            <img src="${LOGO_URL}" alt="Trai Inc" style="height:36px;display:inline-block;" />
        </div>
        <div style="padding:32px;">
            <h2 style="margin:0 0 20px;font-size:20px;color:#111;">${title}</h2>
    `;
}

function emailFooter() {
    return `
        </div>
        <div style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #eee;text-align:center;font-size:13px;color:#888;">
            <p style="margin:0 0 8px;">Trai Inc &middot; Tower B-2, DLF MyPad, Gomti Nagar, Lucknow 226010</p>
            <p style="margin:0;">
                <a href="https://traiinc.com" style="color:${ACCENT};text-decoration:none;">Website</a> &middot;
                <a href="https://www.linkedin.com/company/trai-inc" style="color:${ACCENT};text-decoration:none;">LinkedIn</a> &middot;
                <a href="https://www.instagram.com/trai.inc" style="color:${ACCENT};text-decoration:none;">Instagram</a> &middot;
                <a href="https://wa.me/917905495478" style="color:${ACCENT};text-decoration:none;">WhatsApp</a>
            </p>
        </div>
    </div>`;
}

function tableRow(label, value, isLast) {
    const border = isLast ? '' : 'border-bottom:1px solid #f0f0f0;';
    return `<tr>
        <td style="padding:10px 12px;font-weight:600;color:#555;${border}vertical-align:top;width:140px;font-size:14px;">${label}</td>
        <td style="padding:10px 12px;color:#111;${border}font-size:14px;">${value}</td>
    </tr>`;
}

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

        const budgetLabel = BUDGET_LABELS[budget] || budget;
        const serviceLabels = services.map(s => SERVICE_LABELS[s] || s.replace(/-/g, ' ')).join(', ');
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
        const isEstimator = !!serviceType;

        const rows = [];
        rows.push(tableRow('Name', escapeHtml(name)));
        if (email) rows.push(tableRow('Email', `<a href="mailto:${escapeHtml(email)}" style="color:${ACCENT};">${escapeHtml(email)}</a>`));
        if (phone) rows.push(tableRow('Phone', escapeHtml(phone)));
        if (company) rows.push(tableRow('Company', escapeHtml(company)));
        if (budget) rows.push(tableRow('Budget', escapeHtml(budgetLabel)));
        if (serviceType) rows.push(tableRow('Service', escapeHtml(serviceType)));
        if (needsLogin) rows.push(tableRow('Needs Login', escapeHtml(needsLogin)));
        if (serviceLabels) rows.push(tableRow('Interested In', escapeHtml(serviceLabels)));
        if (message) rows.push(tableRow('Message', `<div style="white-space:pre-wrap;">${escapeHtml(message)}</div>`, true));
        rows.push(tableRow('Submitted', timestamp, true));

        const internalHtml = `
            ${emailHeader(
                isEstimator ? '📊 MSME Cost Estimate Request' : '📩 New Enquiry',
                `${name}${company ? ` from ${company}` : ''} — ${serviceLabels || 'General enquiry'}${budgetLabel ? ` · Budget: ${budgetLabel}` : ''}`
            )}
            <table style="border-collapse:collapse;width:100%;background:#fafafa;border-radius:8px;overflow:hidden;">
                ${rows.join('')}
            </table>
            <div style="margin-top:20px;">
                ${email ? `<a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:10px 24px;background:${ACCENT};color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Reply to ${escapeHtml(name)}</a>` : ''}
                ${phone ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display:inline-block;padding:10px 24px;background:#25D366;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;margin-left:8px;">WhatsApp</a>` : ''}
            </div>
            ${emailFooter()}
        `;

        const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Trai Inc <hello@traiinc.com>",
                to: "hello@traiinc.com",
                reply_to: email || undefined,
                subject: isEstimator
                    ? `MSME Estimate Request from ${name}`
                    : `New enquiry from ${name}${company ? ` (${company})` : ''}`,
                html: internalHtml
            })
        });

        const emailData = await emailRes.json();
        if (!emailRes.ok) {
            return new Response(JSON.stringify({ error: emailData.message || "Failed to send" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (email) {
            const replyHtml = `
                ${emailHeader(
                    'Thanks for reaching out!',
                    `Hi ${name}, we've received your enquiry${serviceLabels ? ` for ${serviceLabels}` : ''}. We'll respond within 24 hours.`
                )}
                <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
                <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">We've received your enquiry and our team will get back to you within <strong>24 hours</strong> with a detailed scope and estimate.</p>
                ${serviceLabels ? `<p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">You expressed interest in: <strong>${escapeHtml(serviceLabels)}</strong></p>` : ''}
                ${budgetLabel && budget ? `<p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 16px;">Budget range: <strong>${escapeHtml(budgetLabel)}</strong></p>` : ''}
                <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">Want to skip the back-and-forth? Book a free 30-minute scoping call:</p>
                <div style="margin:0 0 16px;">
                    <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" style="display:inline-block;padding:12px 28px;background:${ACCENT};color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;">Book a Free Call</a>
                    <a href="https://wa.me/917905495478" style="display:inline-block;padding:12px 28px;background:#25D366;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;margin-left:10px;">Chat on WhatsApp</a>
                </div>
                <p style="font-size:15px;color:#333;line-height:1.6;margin:20px 0 0;">Best,<br><strong>The Trai Inc Team</strong></p>
                ${emailFooter()}
            `;

            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: "Trai Inc <hello@traiinc.com>",
                    to: email,
                    subject: serviceLabels
                        ? `Your enquiry for ${serviceLabels.split(',')[0].trim()} — Trai Inc`
                        : "We received your message — Trai Inc",
                    html: replyHtml
                })
            });
        }

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
