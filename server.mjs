import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash, randomBytes, createHmac } from 'node:crypto';
import { createGzip } from 'node:zlib';

const PUBLIC = resolve(fileURLToPath(new URL('./public/', import.meta.url)));
const PRODUCTS = new Set(['Not sure yet', 'Databrew', 'Dealbrew', 'Hirebrew', 'Ledgerbrew', 'Propbrew']);
const SOLUTIONS = new Map([
  ['financial-services', 'Financial services'], ['government-public-sector', 'Government & public sector'],
  ['professional-services', 'Professional services'], ['property-real-estate', 'Property & real estate'],
  ['energy-infrastructure', 'Energy & infrastructure'], ['technology-platforms', 'Technology & platforms'],
  ['knowledge-ai', 'Knowledge & AI'], ['commercial-legal', 'Commercial & legal'], ['hr-people', 'HR & people'],
  ['finance', 'Finance'], ['property-facilities', 'Property & facilities'], ['growing-businesses', 'Growing businesses'],
  ['multi-entity-organisations', 'Multi-entity organisations'], ['enterprises-institutions', 'Enterprises & institutions']
]);
const PURPOSES = {
  Databrew: 'Request a briefing', Dealbrew: 'Discuss a sandbox walkthrough',
  Hirebrew: 'Discuss a product walkthrough', Ledgerbrew: 'Discuss a design-partner pilot', Propbrew: 'Discuss a Lagos pilot'
};
const EMAIL = /^[^\s@<>(),;:\\"\[\]]+@[^\s@<>(),;:\\"\[\]]+\.[^\s@<>(),;:\\"\[\]]+$/;
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8' };
const UNAVAILABLE = 'We couldn’t send your enquiry right now. Please try again shortly. Your details are still in the form.';

export function validateEnquiry(input) {
  if (!input || Array.isArray(input) || typeof input !== 'object') return { fields: { name: 'Please complete the enquiry form.' } };
  const fields = {};
  const data = {};
  for (const [key, max, label] of [['name', 100, 'your name'], ['email', 150, 'a valid work email'], ['company', 150, 'your organisation'], ['context', 2000, 'what you would like to improve']]) {
    const raw = input[key];
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!value || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value) || (key !== 'context' && /[\r\n]/.test(value))) fields[key] = `Please enter ${label} (up to ${max} characters).`;
    data[key] = value;
  }
  if (data.email && !EMAIL.test(data.email)) fields.email = 'Please enter a valid work email address.';
  if (!PRODUCTS.has(input.product)) fields.product = 'Please choose a product or ask us to help you find one.';
  data.product = input.product;
  if (input.solution && !SOLUTIONS.has(input.solution)) fields.solution = 'Please reopen the solution page and try again.';
  data.solution = input.solution || '';
  if (input.website) fields.website = 'We couldn’t accept this submission. Please try again.';
  return { data, fields };
}

function json(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > 16_384) {
        chunks.length = 0;
        reject(Object.assign(new Error('Request too large'), { status: 413 }));
      } else chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(Object.assign(new Error('Invalid JSON'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

export function emailMessage(data, key, config) {
  const reference = `BR-${key.toUpperCase()}`;
  return {
    from: `Brewling enquiries <${config.from}>`, to: [config.to], reply_to: data.email,
    subject: `Brewling enquiry: ${data.product} — ${data.company}`,
    text: [
      'New Brewling website enquiry', '', `Reference: ${reference}`, `Name: ${data.name}`, `Email: ${data.email}`,
      `Organisation: ${data.company}`, `Product: ${data.product}`, `Purpose: ${PURPOSES[data.product] || 'Find the right product'}`,
      `Solution: ${SOLUTIONS.get(data.solution) || 'General enquiry'}`, '', 'Message:', data.context,
      '', 'Submitted through the Brewling website. Reply to this email to contact the visitor.'
    ].join('\n')
  };
}

export function createApp({ env = process.env, fetchImpl = fetch, now = Date.now, logger = console } = {}) {
  const config = { apiKey: env.RESEND_API_KEY, from: env.ENQUIRY_FROM_EMAIL, to: env.ENQUIRY_TO_EMAIL };
  const configured = Boolean(config.apiKey && EMAIL.test(config.from || '') && EMAIL.test(config.to || ''));
  const origin = env.SITE_ORIGIN || (env.RAILWAY_PUBLIC_DOMAIN ? `https://${env.RAILWAY_PUBLIC_DOMAIN}` : (env.NODE_ENV === 'production' ? '' : `http://127.0.0.1:${env.PORT || 8766}`));
  const limits = new Map();
  const requests = new Map();
  const salt = randomBytes(32);
  let globalWindow = { count: 0, expires: 0 };

  function rateLimit(req) {
    const time = now();
    for (const [key, value] of limits) if (value.expires <= time) limits.delete(key);
    // Railway's reverse proxy supplies X-Forwarded-For. The global cap also limits abuse if a client spoofs it.
    const address = env.RAILWAY_ENVIRONMENT_ID ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : req.socket.remoteAddress;
    const key = createHmac('sha256', salt).update(String(address).slice(0,512)).digest('hex');
    const bucket = limits.get(key) || { count: 0, expires: time + 15 * 60_000 };
    if (globalWindow.expires <= time) globalWindow = { count: 0, expires: time + 60 * 60_000 };
    if (bucket.count >= 10 || globalWindow.count >= 60 || limits.size >= 10_000) return false;
    bucket.count++; globalWindow.count++; limits.set(key, bucket);
    return true;
  }

  async function send(data, key) {
    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `brewling-enquiry/${key}` },
        body: JSON.stringify(emailMessage(data, key, config)), signal: AbortSignal.timeout(12_000)
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || typeof result?.id !== 'string' || !result.id.trim()) {
        // Only operational status is logged; visitor details and provider responses stay out of logs.
        logger.error('enquiry_delivery_failed', { status: response.status });
        return { status: 503, body: { ok: false, error: UNAVAILABLE } };
      }
      return { status: 200, body: { ok: true, reference: `BR-${key.toUpperCase()}` } };
    } catch {
      logger.error('enquiry_delivery_unavailable');
      return { status: 503, body: { ok: false, error: UNAVAILABLE } };
    }
  }

  async function enquiry(req, res) {
    if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Please submit the enquiry form.' }, { Allow: 'POST' });
    if (!origin || req.headers.origin !== origin || req.headers['sec-fetch-site'] === 'cross-site') return json(res, 403, { ok: false, error: 'Please send your enquiry from the Brewling website.' });
    if ((req.headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/json') return json(res, 415, { ok: false, error: 'Please submit the enquiry form.' });
    const key = req.headers['idempotency-key'];
    if (typeof key !== 'string' || !UUID.test(key)) return json(res, 400, { ok: false, error: 'Please refresh the page before sending your enquiry.' });
    const input = await readBody(req);
    const { data, fields } = validateEnquiry(input);
    if (Object.keys(fields).length) return json(res, 400, { ok: false, error: 'Please check the form and try again.', fields });
    if (!configured) return json(res, 503, { ok: false, error: UNAVAILABLE });
    const fingerprint = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const time = now();
    for (const [id, request] of requests) if (request.expires <= time) requests.delete(id);
    const existing = requests.get(key);
    if (existing && existing.fingerprint !== fingerprint) return json(res, 409, { ok: false, error: 'This enquiry has changed. Please refresh the page and submit it again.' });
    if (existing) {
      const result = await existing.promise;
      return json(res, result.status, result.body);
    }
    if (!rateLimit(req)) return json(res, 429, { ok: false, error: 'Too many attempts. Please try again in an hour. Your details are still in the form.' }, { 'Retry-After': '3600' });
    const promise = send(data, key);
    requests.set(key, { fingerprint, promise, expires: time + 24 * 60 * 60_000 });
    const result = await promise;
    if (result.status !== 200) requests.delete(key);
    json(res, result.status, result.body);
  }

  return createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/enquiries') return await enquiry(req, res);
      if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, { ok: false, error: 'Method not allowed.' }, { Allow: 'GET, HEAD' });
      if (url.pathname === '/health') return json(res, 200, { ok: true });
      const pathname = decodeURIComponent(url.pathname);
      const path = resolve(PUBLIC, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!path.startsWith(PUBLIC + sep) || pathname.split('/').some(part => part.startsWith('.'))) return json(res, 404, { ok: false, error: 'Not found.' });
      const info = await stat(path).catch(() => null);
      if (!info?.isFile() || !MIME[extname(path)]) return json(res, 404, { ok: false, error: 'Not found.' });
      const compress = info.size > 1024 && /(?:^|,)\s*gzip\s*(?:,|$)/.test(req.headers['accept-encoding'] || '') && ['.html', '.css', '.js', '.svg'].includes(extname(path));
      res.writeHead(200, { 'Content-Type': MIME[extname(path)], ...(compress ? { 'Content-Encoding': 'gzip' } : { 'Content-Length': info.size }), 'Vary': 'Accept-Encoding', 'Cache-Control': 'public, max-age=0, must-revalidate' });
      if (req.method === 'HEAD') return res.end();
      const stream = createReadStream(path);
      stream.on('error', () => res.destroy());
      if (compress) {
        const gzip = createGzip();
        gzip.on('error', () => res.destroy());
        stream.pipe(gzip).pipe(res);
      } else stream.pipe(res);
    } catch (error) {
      if (!res.headersSent && !res.destroyed) json(res, error.status || 400, { ok: false, error: error.status === 413 ? 'Your enquiry is too long. Please shorten it and try again.' : 'Please check the form and try again.' });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const server = createApp();
  server.requestTimeout = 20_000;
  server.headersTimeout = 15_000;
  server.listen(Number(process.env.PORT) || 8766, '0.0.0.0', () => console.log('Brewling website is listening.'));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}
