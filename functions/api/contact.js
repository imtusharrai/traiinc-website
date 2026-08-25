const BUDGET_LABELS = {
    'under-50k': 'Under ₹50K',
    '50k-1l': '₹50K–1L',
    '1l-3l': '₹1–3L',
    '3l-5l': '₹3–5L',
    '5l-10l': '₹5–10L',
    '10l-plus': '₹10L+'
};

const SERVICE_LABELS = {
    'custom-website-design': 'Custom Website Design',
    'ecommerce-development': 'E-Commerce Application',
    'wordpress-cms-development': 'CMS Development',
    'web-applications': 'Web Applications',
    'saas-platforms': 'SaaS Platforms',
    'enterprise-software': 'Enterprise Software',
    'system-integration': 'System Integration',
    'api-development': 'API Development',
    'ios-android-native': 'iOS & Android Native',
    'flutter-app-development': 'Cross-Platform (Flutter)',
    'desktop-applications': 'Desktop Applications',
    'app-store-publishing': 'App Store Publishing',
    'task-automation-agents': 'Task & Process Automation',
    'customer-service-agents': 'Customer Service Agents',
    'enterprise-agents': 'Enterprise AI Agents',
    'multi-agent-systems': 'Multi-Agent Systems',
    'ai-voice-agents': 'AI Voice Agents',
    'lead-gen-scraping': 'Lead Gen & Scraping Bots',
    'data-analytics': 'Data Analytics & Visualization',
    'data-engineering': 'Data Engineering & ETL',
    'cloud-migration': 'Cloud Migration',
    'cicd-pipelines': 'CI/CD Pipelines',
    'serverless-architecture': 'Serverless Architecture',
    'container-orchestration': 'Container Orchestration',
    'infrastructure-as-code': 'Infrastructure as Code',
    'monitoring-observability': 'Monitoring & Observability',
    'organic-seo-content': 'Organic Visibility & Content',
    'paid-advertising': 'Paid Advertising',
    'nurturing-retention': 'Nurturing & Retention',
    'marketing-analytics': 'Strategy, Tech & Analytics',
    'custom-crm-development': 'CRM Development',
    'erp-systems': 'ERP Systems',
    'hr-workforce-management': 'HR & Workforce Management',
    'cybersecurity-compliance': 'Cybersecurity & Compliance',
    'ai-text-generation': 'AI Text Generation',
    'ai-audio-generation': 'AI Audio Generation',
    'ai-video-generation': 'AI Video Generation',
    'ai-graphics-visuals': 'AI Graphics & Visuals',
    'ui-ux-design': 'UI/UX Design',
    'brand-identity': 'Brand Identity & Logo',
    'motion-graphics': 'Motion Graphics & Animation',
    'social-media-design': 'Social Media Design'
};

const ACCENT = '#D91414';
const LOGO_URL = 'https://traiinc.com/assets/logos/logo_gradient.png';

function preheader(text) {
    return `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${text}${'&#847; '.repeat(30)}</div>`;
}

function emailWrapper(preheaderText, bodyContent) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Trai Inc</title>
</head>
<body style="margin:0; padding:0; background-color:#eeeeef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
${preheaderText ? preheader(preheaderText) : ''}
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

  <!-- Body -->
  <tr>
    <td style="padding: 20px 40px 0 40px;">
      ${bodyContent}
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
        <a href="https://traiinc.com" style="color:#aaaaaa; text-decoration:none;">traiinc.com</a>
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
        const websiteUrl = formData.get('website_url') || '';

        // Honeypot check: if filled, silently exit to trick bots
        if (websiteUrl) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!name || (!email && !phone)) {
            return new Response(JSON.stringify({ error: "Name and either email or phone are required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const tokens = formData.getAll('cf-turnstile-response');
        const turnstileToken = tokens.find(t => t && t.trim() !== '') || '';
        if (!turnstileToken) {
            return new Response(JSON.stringify({ error: "Security verification required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!env.TURNSTILE_SECRET) {
            return new Response(JSON.stringify({ error: "Server configuration error: Turnstile key missing" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Canonical siteverify — POST application/x-www-form-urlencoded
        const ip = request.headers.get('CF-Connecting-IP');
        const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: env.TURNSTILE_SECRET,
                response: turnstileToken,
                ...(ip ? { remoteip: ip } : {})
            })
        });
        const tsData = await tsRes.json();
        if (!tsData.success) {
            return new Response(JSON.stringify({ 
                error: "Security verification failed. Please try again.",
                details: tsData['error-codes']
            }), {
                status: 403,
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

        const internalBody = `
            <h1 style="margin:0 0 20px 0; font-size:24px; line-height:1.3; color:#0a0a0a; letter-spacing:-0.4px;">${isEstimator ? '📊 MSME Cost Estimate Request' : '📩 New Enquiry'}</h1>
            <table style="border-collapse:collapse;width:100%;background:#fafafa;border-radius:8px;overflow:hidden;">
                ${rows.join('')}
            </table>
            <div style="margin-top:20px; padding-bottom:28px;">
                ${email ? `<a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:12px 24px;background:${ACCENT};color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Reply to ${escapeHtml(name)}</a>` : ''}
                ${phone ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display:inline-block;padding:12px 24px;background:#25D366;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;margin-left:8px;">WhatsApp</a>` : ''}
            </div>
        `;
        const internalHtml = emailWrapper(
            `${name}${company ? ` from ${company}` : ''} — ${serviceLabels || 'General enquiry'}${budgetLabel ? ` · Budget: ${budgetLabel}` : ''}`,
            internalBody
        );

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
