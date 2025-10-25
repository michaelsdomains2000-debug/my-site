export async function onRequestPost(context) {
  const { EMAIL_TO, EMAIL_FROM, ACCOUNT_ID, CLOUDFLARE_API_TOKEN } = context.env;

  const data = await context.request.formData();
  const name    = data.get('name')?.trim();
  const email   = data.get('email')?.trim();
  const message = data.get('message')?.trim();

  if (!name || !email || !message)
    return new Response(JSON.stringify({ok:false, error:"All fields required."}),
                        {status:400, headers:{'content-type':'application/json'}});

  const subject = `Message from ${name} via your website`;
  const textBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  const send = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/sendmail`,
    {
      method:"POST",
      headers:{
        "Authorization":`Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        personalizations:[{to:[{email:EMAIL_TO}]}],
        from:{email:EMAIL_FROM},
        subject,
        content:[{type:"text/plain", value:textBody}]
      })
    }
  );

  if (!send.ok)
    return new Response(JSON.stringify({ok:false, error:"Mail server error."}),
                        {status:500, headers:{'content-type':'application/json'}});

  return new Response(JSON.stringify({ok:true}),
                      {headers:{'content-type':'application/json'}});
}
