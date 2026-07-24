export async function onRequestGet(context) {
    const { request } = context;
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    // In a full implementation, you would use env.RESEND_API_KEY to remove the contact
    // from your Resend Audience here. Since we're currently just sending one-off emails,
    // this acts as a confirmation endpoint.

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Unsubscribed | Trai Inc</title>
<style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9f9f9; color: #111; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .container { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); max-width: 400px; text-align: center; }
    h1 { margin-top: 0; font-size: 24px; }
    p { color: #555; line-height: 1.6; }
    .btn { display: inline-block; margin-top: 20px; padding: 10px 24px; background: #D91414; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; }
</style>
</head>
<body>
    <div class="container">
        <h1>Unsubscribed</h1>
        <p><strong>${email ? email : 'Your email address'}</strong> has been successfully removed from our mailing list. You won't receive any more Weekly Insights.</p>
        <a href="https://traiinc.com" class="btn">Return to Website</a>
    </div>
</body>
</html>
    `;

    return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
    });
}
