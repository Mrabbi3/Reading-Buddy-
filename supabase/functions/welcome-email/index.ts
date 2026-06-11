import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  try {
    // Webhook payload from Supabase auth.users INSERT
    const payload = await req.json();
    
    // Only proceed if it's an INSERT into auth.users
    if (payload.type !== 'INSERT' || payload.table !== 'users') {
      return new Response('Not a user insert', { status: 400 });
    }

    const email = payload.record.email;
    if (!email) {
      return new Response('No email provided', { status: 400 });
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing');
      return new Response('Server configuration error', { status: 500 });
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #f6f0e6; color: #2b1d05; font-family: system-ui, -apple-system, sans-serif; padding: 40px 20px; line-height: 1.6; }
    .container { max-width: 480px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #ede7dc; text-align: center; }
    .logo { margin-bottom: 24px; color: #e0a23b; font-size: 32px; }
    h1 { font-family: Georgia, serif; font-size: 28px; font-weight: 300; margin-top: 0; color: #2b1d05; }
    p { font-size: 16px; color: #5c5243; margin-bottom: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">✦</div>
    <h1>Welcome to Reading Buddy</h1>
    <p>We're thrilled to have you here. Your quiet reading room is ready, and your AI companion is waiting to help you uncover the layers of every book you read.</p>
    <p>Jump into the app or web version and start your first book.</p>
    <a href="https://app.readingbuddy.com" style="display:inline-block; background:#e0a23b; color:#2b1d05; padding:14px 28px; border-radius:99px; text-decoration:none; font-weight:600;">Open your Library</a>
  </div>
</body>
</html>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Reading Buddy <welcome@readingbuddy.com>', // The user will likely need to verify a domain in Resend and update this
        to: [email],
        subject: 'Welcome to Reading Buddy',
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      console.error('Resend error:', data);
      return new Response(JSON.stringify({ error: data }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
