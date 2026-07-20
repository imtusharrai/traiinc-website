export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const formData = await request.formData();
        const email = formData.get('email');

        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
        }

        if (!env.RESEND_API_KEY) {
            return new Response(JSON.stringify({ error: "Server configuration error: Missing API Key" }), { status: 500 });
        }

        // 1. Send the PDF delivery email via Resend
        const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Trai Inc <hello@traiinc.com>", // Make sure to verify this domain in Resend
                to: email,
                subject: "Your Tech Audit Checklist inside 📦",
                html: `
                    <p>Hi there,</p>
                    <p>Here is the PDF you requested. Start with Point #3 (Database Indexing)—it's where 80% of startups lose their server money.</p>
                    <p><a href="https://www.traiinc.com/assets/lead-magnets/Lead_Magnet_Audit.pdf" style="display:inline-block;padding:10px 20px;background:#D91414;color:white;text-decoration:none;border-radius:5px;font-weight:bold;">Download the 10-Point Checklist</a></p>
                    <p>Reply to this email if you have questions about your specific stack.</p>
                    <p>Best,<br>The Trai Inc Team</p>
                `
            })
        });

        const emailData = await emailRes.json();
        if (!emailRes.ok) {
            return new Response(JSON.stringify({ error: emailData.message || "Failed to send email" }), { status: 500 });
        }

        // 2. Add contact to Resend Audience (so the Day 3 and Day 7 drips can trigger)
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
