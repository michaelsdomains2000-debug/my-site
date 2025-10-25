export async function onRequestPost(context) {
  const { EMAIL_TO, EMAIL_FROM } = context.env;

  const data = await context.request.formData();
  const name    = data.get('name')?.trim();
  const email   = data.get('email')?.trim();
  const message = data.get('message')?.trim();

  if (!name || !email || !message)
    return new Response(JSON.stringify({ok:false, error:"All fields required."}),
                        {status:400, headers:{'content-type':'application/json'}});

  const payload = {
    personalizations: [{ to: [{ email: EMAIL_TO }] }],
    from: { email: EMAIL_FROM },
    subject: `Message from ${name}`,
    content: [{ type: "text/plain", value: `Name: ${name}\nEmail: ${email}\n\n${message}` }]
  };

  const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok)
    return new Response(JSON.stringify({ok:false, error:"Mail error."}),
                        {status:500, headers:{'content-type':'application/json'}});

  return new Response(JSON.stringify({ok:true}),
                      {headers:{'content-type':'application/json'}});
}
