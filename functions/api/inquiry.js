const noCacheHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};
const send = (status, body) => new Response(JSON.stringify(body), { status, headers: noCacheHeaders });
const clean = (value, max = 200) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function onRequestPost({ request, env }) {
  const type = request.headers.get('content-type') || '';
  if (!type.includes('application/json')) return send(415, { error: 'Please submit the website form.' });
  let payload;
  try {
    if (Number(request.headers.get('content-length') || 0) > 12000) return send(413, { error: 'Your message is too long.' });
    payload = await request.json();
  } catch (_) {
    return send(400, { error: 'Please check the form and try again.' });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return send(400, { error: 'Invalid form submission.' });
  if (clean(payload.website, 200)) return send(200, { ok: true });
  const name = clean(payload.name, 100);
  const company = clean(payload.company, 120);
  const email = clean(payload.email, 254);
  const workflow = clean(payload.workflow, 150);
  const message = clean(payload.message, 1500);
  if (name.length < 2 || !company || !workflow || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return send(400, { error: 'Please enter your name, company, valid work email, and workflow.' });
  }
  const allowedWorkflows = [
    'Invoice processing & ERP entry',
    'Purchase orders / GRN / dispatch',
    'Document processing',
    'Custom back-office automation',
    "Not sure yet — let's discuss"
  ];
  if (!allowedWorkflows.includes(workflow)) return send(400, { error: 'Please choose a valid workflow.' });
  if (!env.RESEND_API_KEY || !env.LEADS_TO_EMAIL || !env.LEADS_FROM_EMAIL) {
    return send(503, { error: 'Online enquiries are not yet enabled. Please contact the Zerah Labs team through your existing channel.' });
  }
  const plain = [
    'New Zerah Labs website enquiry',
    '',
    'Name: ' + name,
    'Company: ' + company,
    'Email: ' + email,
    'Workflow: ' + workflow,
    '',
    'Details:',
    message || '(not provided)'
  ].join('\n');
  try {
    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.LEADS_FROM_EMAIL,
        to: [env.LEADS_TO_EMAIL],
        reply_to: email,
        subject: 'Zerah Labs enquiry — ' + company.replace(/[\r\n]/g, ' '),
        text: plain
      })
    });
    if (!upstream.ok) return send(502, { error: 'We could not deliver your enquiry right now. Please try again later.' });
    return send(200, { ok: true });
  } catch (_) {
    return send(502, { error: 'We could not deliver your enquiry right now. Please try again later.' });
  }
}
export function onRequestGet() {
  return send(405, { error: 'Method not allowed.' });
}
