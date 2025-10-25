export async function onRequestPost(context) {
  const { EMAIL_TO, EMAIL_FROM } = context.env;

  // read & validate form
  const data = await context.request.formData();
  const name    = data.get('name')?.trim();
  const email   = data.get('email')?.trim();
  const message = data.get('message')?.trim();

  if (!name || !email || !message)
    return new Response(JSON.stringify({ ok:false, error:"All fields required." }),
                        { status:400, headers:{"content-type":"application/json"} });

  // build simple text email
  const subject = `Message from ${name}`;
  const textBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  // MailChannels JSON body
  const payload = {
    personalizations: [{ to: [{ email: EMAIL_TO }] }],
    from: { email: EMAIL_FROM },
    subject,
    content: [{ type: "text/plain", value: textBody }]
  };

  // send via MailChannels (only works from Cloudflare IPs)
  const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok)
    return new Response(JSON.stringify({ ok:false, error:"Mail error." }),
                        { status:500, headers:{"content-type":"application/json"} });

  return new Response(JSON.stringify({ ok:true }),
                      { headers:{"content-type":"application/json"} });
}
