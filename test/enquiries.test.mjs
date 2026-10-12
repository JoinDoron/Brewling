import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { request as httpRequest } from 'node:http';
import { createApp } from '../server.mjs';

// These tests never contact an email service. Only the loopback test server uses
// a real socket; every outbound provider call is replaced by the fake below.
const ORIGIN = 'https://brewling.example';
const TEST_KEY = 're_test_only_not_a_real_credential';
const PROVIDER_ID = 'a982aa91-10f3-4dfa-98ca-4f571108ef16';
const ENV = {
  NODE_ENV: 'production', SITE_ORIGIN: ORIGIN, RESEND_API_KEY: TEST_KEY,
  ENQUIRY_FROM_EMAIL: 'enquiries@brewling.example', ENQUIRY_TO_EMAIL: 'owner@brewling.example'
};
const valid = (overrides = {}) => ({
  name: 'Ada Example', email: 'ada@example.test', company: 'Example Operations',
  product: 'Ledgerbrew', solution: 'finance', website: '',
  context: 'We want to improve invoice approvals and month-end reconciliation.', ...overrides
});
const providerResponse = (body = { id: PROVIDER_ID }, status = 200) => ({
  ok: status >= 200 && status < 300, status, json: async () => body
});

async function fixture(t, { env = {}, provider, now } = {}) {
  const calls = [], logs = [];
  let providerEntered;
  const providerStarted = new Promise(resolve => { providerEntered = resolve; });
  const server = createApp({
    env: { ...ENV, ...env }, now,
    logger: { error: (...args) => logs.push(args) },
    fetchImpl: async (url, options) => {
      const call = { url, options, message: JSON.parse(options.body) };
      calls.push(call);
      providerEntered();
      return provider ? provider(call, calls.length) : providerResponse();
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const unpack = async response => {
    const text = await response.text();
    let body;
    try { body = JSON.parse(text); } catch { /* Static files are not JSON. */ }
    return { status: response.status, headers: response.headers, text, body };
  };
  const post = async (input = valid(), { key = randomUUID(), headers = {}, raw, method = 'POST' } = {}) => {
    const allHeaders = { Origin: ORIGIN, 'Content-Type': 'application/json', 'Idempotency-Key': key, ...headers };
    for (const key of Object.keys(allHeaders)) if (allHeaders[key] === undefined) delete allHeaders[key];
    return unpack(await fetch(base + '/api/enquiries', {
      method, headers: allHeaders, body: ['GET', 'HEAD'].includes(method) ? undefined : raw ?? JSON.stringify(input)
    }));
  };
  return { server, base, calls, logs, post, providerStarted, get: async (path, options) => unpack(await fetch(base + path, options)) };
}

test('success follows provider acceptance and delivers the expected plain-text enquiry', async t => {
  const f = await fixture(t);
  const key = randomUUID();
  const result = await f.post(valid({ name: '  Ada Example  ', context: 'Line one\n<script>illustrative text</script>' }), { key });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { ok: true, reference: `BR-${key.toUpperCase()}` });
  assert.equal(result.headers.get('cache-control'), 'no-store');
  assert.equal(f.calls.length, 1);
  const { url, options, message } = f.calls[0];
  assert.equal(url, 'https://api.resend.com/emails');
  assert.equal(options.method, 'POST');
  assert.equal(options.headers.Authorization, `Bearer ${TEST_KEY}`);
  assert.equal(options.headers['Idempotency-Key'], `brewling-enquiry/${key}`);
  assert.ok(options.signal instanceof AbortSignal);
  assert.equal(message.from, 'Brewling enquiries <enquiries@brewling.example>');
  assert.deepEqual(message.to, ['owner@brewling.example']);
  assert.equal(message.reply_to, 'ada@example.test');
  assert.equal(message.subject, 'Brewling enquiry: Ledgerbrew — Example Operations');
  assert.match(message.text, /Name: Ada Example\n/);
  assert.match(message.text, /Purpose: Discuss a design-partner pilot\nSolution: Finance/);
  assert.match(message.text, /Line one\n<script>illustrative text<\/script>/);
  assert.equal(message.html, undefined, 'visitor content belongs in the plain-text body');
  assert.deepEqual(f.logs, []);
  assert.ok(!result.text.includes(TEST_KEY));
  assert.ok(!result.text.includes('ada@example.test'));
});

test('missing, malformed or blank provider acceptance IDs never produce visitor success', async t => {
  for (const [label, body] of [
    ['missing id', {}], ['null id', { id: null }], ['numeric id', { id: 123 }],
    ['empty id', { id: '' }], ['whitespace id', { id: '   ' }]
  ]) {
    await t.test(label, async t => {
      const f = await fixture(t, { provider: () => providerResponse(body) });
      const result = await f.post();
      assert.equal(result.status, 503);
      assert.equal(result.body.ok, false);
      assert.equal(result.body.reference, undefined);
    });
  }
});

test('provider HTTP failure, invalid JSON, transport error and abort are safely reported', async t => {
  const failures = [
    ['HTTP error despite an id', () => providerResponse({ id: PROVIDER_ID, detail: TEST_KEY }, 429)],
    ['invalid JSON', () => ({ ok: true, status: 200, json: async () => { throw Error('invalid provider body'); } })],
    ['network error', () => { throw Error(`private upstream details ${TEST_KEY}`); }],
    ['abort', () => { throw new DOMException('provider timed out', 'AbortError'); }]
  ];
  for (const [label, provider] of failures) {
    await t.test(label, async t => {
      const f = await fixture(t, { provider });
      const result = await f.post(valid({ context: 'CONFIDENTIAL_TEST_ONLY_CONTEXT' }));
      assert.equal(result.status, 503);
      assert.equal(result.body.ok, false);
      assert.equal(result.body.reference, undefined);
      const observable = result.text + JSON.stringify(f.logs);
      for (const secret of [TEST_KEY, 'ada@example.test', 'CONFIDENTIAL_TEST_ONLY_CONTEXT', 'private upstream details']) {
        assert.ok(!observable.includes(secret), `${label} exposed ${secret}`);
      }
    });
  }
});

test('a failed delivery can retry the same idempotency key', async t => {
  const f = await fixture(t, { provider: (_call, attempt) => attempt === 1 ? providerResponse({}, 503) : providerResponse() });
  const key = randomUUID();
  assert.equal((await f.post(valid(), { key })).status, 503);
  const retry = await f.post(valid(), { key });
  assert.equal(retry.status, 200);
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[0].options.headers['Idempotency-Key'], f.calls[1].options.headers['Idempotency-Key']);
  assert.equal((await f.post(valid(), { key })).body.reference, retry.body.reference);
  assert.equal(f.calls.length, 2, 'successful retries are subsequently cached');
});

test('simultaneous identical submissions share one send and one receipt', async t => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const f = await fixture(t, { provider: async () => { await gate; return providerResponse(); } });
  t.after(() => release());
  const key = randomUUID();
  const first = f.post(valid(), { key });
  await f.providerStarted;
  const secondSeen = once(f.server, 'request');
  let secondFinished = false;
  const second = f.post(valid(), { key }).then(result => { secondFinished = true; return result; });
  await secondSeen;
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(secondFinished, false, 'do not acknowledge a pending delivery');
  assert.equal(f.calls.length, 1);
  release();
  const responses = await Promise.all([first, second]);
  assert.deepEqual(responses.map(r => r.status), [200, 200]);
  assert.deepEqual(responses[0].body, responses[1].body);
  assert.equal(f.calls.length, 1);
});

test('reusing a successful idempotency key for changed content is rejected', async t => {
  const f = await fixture(t);
  const key = randomUUID();
  assert.equal((await f.post(valid(), { key })).status, 200);
  const conflict = await f.post(valid({ context: 'A different enquiry' }), { key });
  assert.equal(conflict.status, 409);
  assert.equal(conflict.body.ok, false);
  assert.equal(f.calls.length, 1);
});

test('field validation and header-injection attempts never reach the provider', async t => {
  const f = await fixture(t);
  const cases = [
    [null, 'name'], [[], 'name'], [valid({ name: '' }), 'name'], [valid({ name: 12 }), 'name'],
    [valid({ name: 'A'.repeat(101) }), 'name'], [valid({ company: 'A'.repeat(151) }), 'company'],
    [valid({ email: 'not-an-email' }), 'email'], [valid({ context: 'A'.repeat(2001) }), 'context'],
    [valid({ context: 'contains\u0000null' }), 'context'],
    [valid({ name: 'Ada\r\nBcc: intruder@example.test' }), 'name'],
    [valid({ company: 'Example\nBcc: intruder@example.test' }), 'company'],
    [valid({ email: 'ada@example.test\r\nBcc: intruder@example.test' }), 'email'],
    [valid({ product: 'Ledgerbrew\r\nBcc: intruder@example.test' }), 'product'],
    [valid({ product: 'Unknown product' }), 'product'], [valid({ solution: 'arbitrary-solution' }), 'solution']
  ];
  for (const [input, field] of cases) {
    const result = await f.post(input);
    assert.equal(result.status, 400, JSON.stringify(input));
    assert.ok(result.body.fields[field], `expected ${field} validation`);
  }
  assert.equal(f.calls.length, 0);
});

test('all published product choices and canonical solution names are accepted', async t => {
  const f = await fixture(t);
  for (const product of ['Not sure yet', 'Databrew', 'Dealbrew', 'Hirebrew', 'Ledgerbrew', 'Propbrew']) {
    const result = await f.post(valid({ product, solution: 'government-public-sector' }));
    assert.equal(result.status, 200, product);
    assert.match(f.calls.at(-1).message.text, /Solution: Government & public sector/);
  }
  const general = await f.post(valid({ solution: '' }));
  assert.equal(general.status, 200);
  assert.match(f.calls.at(-1).message.text, /Solution: General enquiry/);
});

test('the honeypot rejects automated submissions without delivery', async t => {
  const f = await fixture(t);
  const result = await f.post(valid({ website: 'https://spam.example.test' }));
  assert.equal(result.status, 400);
  assert.ok(result.body.fields.website);
  assert.equal(f.calls.length, 0);
});

test('API method, origin, fetch-site, content-type and idempotency requirements are enforced', async t => {
  const f = await fixture(t);
  const cases = [
    ['wrong method', { method: 'GET' }, 405],
    ['missing origin', { headers: { Origin: undefined } }, 403],
    ['foreign origin', { headers: { Origin: 'https://attacker.example' } }, 403],
    ['origin prefix spoof', { headers: { Origin: ORIGIN + '.attacker.example' } }, 403],
    ['cross-site browser request', { headers: { 'Sec-Fetch-Site': 'cross-site' } }, 403],
    ['missing content type', { headers: { 'Content-Type': undefined } }, 415],
    ['non-JSON content type', { headers: { 'Content-Type': 'text/plain' } }, 415],
    ['missing key', { headers: { 'Idempotency-Key': undefined } }, 400],
    ['invalid key', { key: 'not-a-uuid' }, 400]
  ];
  for (const [label, options, expected] of cases) {
    const result = await f.post(valid(), options);
    assert.equal(result.status, expected, label);
    assert.equal(result.body.ok, false);
    assert.equal(result.headers.get('access-control-allow-origin'), null);
  }
  assert.equal(f.calls.length, 0);
});

test('JSON-like media types are not treated as application/json', async t => {
  const f = await fixture(t);
  const result = await f.post(valid(), { headers: { 'Content-Type': 'application/jsonp' } });
  assert.equal(result.status, 415);
  assert.equal(f.calls.length, 0);
});

test('JSON with a charset parameter works; malformed JSON fails safely', async t => {
  const f = await fixture(t);
  assert.equal((await f.post(valid(), { headers: { 'Content-Type': 'application/json; charset=utf-8' } })).status, 200);
  const result = await f.post(undefined, { raw: '{broken JSON' });
  assert.equal(result.status, 400);
  assert.equal(result.body.ok, false);
  assert.equal(f.calls.length, 1);
});

test('oversized request bodies receive 413 without contacting the provider', async t => {
  const f = await fixture(t);
  const result = await f.post(valid({ padding: 'x'.repeat(17_000) }));
  assert.equal(result.status, 413);
  assert.equal(result.body.ok, false);
  assert.equal(f.calls.length, 0);
});

test('missing or invalid delivery configuration is unavailable and never calls a provider', async t => {
  for (const env of [{ RESEND_API_KEY: '' }, { ENQUIRY_TO_EMAIL: '' }, { ENQUIRY_FROM_EMAIL: 'bad address' }]) {
    await t.test(JSON.stringify(env), async t => {
      const f = await fixture(t, { env });
      const result = await f.post();
      assert.equal(result.status, 503);
      assert.equal(result.body.ok, false);
      assert.equal(f.calls.length, 0);
      assert.ok(!result.text.includes(TEST_KEY));
    });
  }
});

test('a production deployment without a site origin refuses submissions', async t => {
  const f = await fixture(t, { env: { SITE_ORIGIN: '' } });
  assert.equal((await f.post()).status, 403);
  assert.equal(f.calls.length, 0);
});

test('per-address rate limiting returns 429, preserves retries and resets with time', async t => {
  let clock = 1_700_000_000_000;
  const f = await fixture(t, { now: () => clock });
  const firstKey = randomUUID();
  assert.equal((await f.post(valid(), { key: firstKey })).status, 200);
  for (let i = 1; i < 10; i++) assert.equal((await f.post()).status, 200);
  const limited = await f.post();
  assert.equal(limited.status, 429);
  assert.equal(limited.body.ok, false);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);
  assert.equal(f.calls.length, 10);
  assert.equal((await f.post(valid(), { key: firstKey })).status, 200, 'a previously accepted receipt remains retrievable');
  assert.equal(f.calls.length, 10);
  clock += 15 * 60_000 + 1;
  assert.equal((await f.post()).status, 200);
  assert.equal(f.calls.length, 11);
});

test('the global cap bounds changing forwarded addresses and recovers after its window', async t => {
  let clock = 1_700_000_000_000;
  const f = await fixture(t, { now: () => clock, env: { RAILWAY_ENVIRONMENT_ID: 'test-environment' } });
  for (let i = 0; i < 60; i++) {
    assert.equal((await f.post(valid(), { headers: { 'X-Forwarded-For': `192.0.2.${i + 1}` } })).status, 200);
  }
  assert.equal((await f.post(valid(), { headers: { 'X-Forwarded-For': '198.51.100.1' } })).status, 429);
  assert.equal(f.calls.length, 60);
  clock += 60 * 60_000 + 1;
  assert.equal((await f.post(valid(), { headers: { 'X-Forwarded-For': '198.51.100.1' } })).status, 200);
});

test('root, assets and health work without exposing private files or credentials', async t => {
  const f = await fixture(t);
  const root = await f.get('/');
  assert.equal(root.status, 200);
  assert.match(root.headers.get('content-type'), /text\/html/);
  assert.match(root.text, /Brewling/);
  assert.equal(root.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(root.headers.get('x-frame-options'), 'DENY');
  for (const [path, type] of [['/site.css', 'text/css'], ['/site.js', 'text/javascript'], ['/assets/brewling-mark-primary.svg', 'image/svg+xml'], ['/assets/fonts/Inter.woff2', 'font/woff2']]) {
    const response = await f.get(path, { method: 'HEAD', headers: { 'Accept-Encoding': 'identity' } });
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type').startsWith(type), path);
    assert.equal(response.text, '', 'HEAD must not return file content');
    assert.ok(Number(response.headers.get('content-length')) > 0);
  }
  assert.deepEqual((await f.get('/health')).body, { ok: true });
  for (const pathname of ['/server.mjs', '/package.json', '/package-lock.json', '/README.md', '/.env', '/%2eenv', '/assets/', '/not-present.txt', '/%2e%2e%2fserver.mjs', '/assets/%2e%2e%2f%2e%2e%2fserver.mjs']) {
    // node:http preserves the encoded path instead of client-side URL normalisation.
    const response = await new Promise((resolve, reject) => {
      const req = httpRequest(f.base, { path: pathname }, res => {
        let body = '';
        res.setEncoding('utf8'); res.on('data', chunk => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', reject); req.end();
    });
    assert.equal(response.status, 404, pathname);
    assert.ok(!response.body.includes(TEST_KEY), pathname);
    assert.ok(!response.body.includes('createApp'), pathname);
  }
  const script = await f.get('/site.js');
  assert.ok(!script.text.includes(TEST_KEY));
  assert.ok(!root.text.includes(TEST_KEY));
  assert.equal(f.calls.length, 0);
});
