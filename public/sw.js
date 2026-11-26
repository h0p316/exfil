// FLAGGED FOR DELETION — sarcastic service worker.
// Yes, the JWT secret is right here. No, we are not sorry.
const JWT_SECRET = 'sw_supreme_s3cr3t_0xdeadbeef';
const ADMIN_FLAG = 'FLAG{s3rv1c3_w0rk3r_supr3m4cy}';
const ROBOTS_FLAG = 'FLAG{n1c3_try_g00gl3_b0t}';

async function sign(payloadB64) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const b64url = (o) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s) => JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/')));

const page = (body) =>
  new Response(
    `<!doctype html><html><body style="background:#0b0f14;color:#8f8;font-family:monospace;padding:2rem">${body}</body></html>`,
    { headers: { 'content-type': 'text/html' } },
  );

self.addEventListener('install', (e) => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (url.pathname === '/robots.txt') {
    e.respondWith(
      new Response(`User-agent: *\nDisallow: /admin\nDisallow: / ${ROBOTS_FLAG}\n`, {
        headers: { 'content-type': 'text/plain' },
      }),
    );
    return;
  }

  if (url.pathname === '/admin') {
    e.respondWith(
      (async () => {
        const token = url.searchParams.get('token');
        if (!token) {
          // issue a pathetic guest token: header.payload.signature
          const header = b64url({ alg: 'HS256', typ: 'JWT' });
          const payload = b64url({ role: 'guest', user: 'n00b' });
          const sig = await sign(`${header}.${payload}`);
          return page(
            `<h1>/admin — login</h1><p>Here is your session token, guest:</p>` +
              `<code>${header}.${payload}.${sig}</code>` +
              `<p>Come back with <code>?token=&lt;jwt&gt;</code> and <code>role=admin</code>. ` +
              `The signing secret is definitely not in /sw.js.</p>`,
          );
        }
        const [h, p, s] = token.split('.');
        const expected = await sign(`${h}.${p}`);
        if (s === expected && unb64(p).role === 'admin') {
          return page(`<h1>welcome, admin</h1><p>${ADMIN_FLAG}</p>`);
        }
        return page(`<h1>403</h1><p>nice try. the worker is judging you.</p>`);
      })(),
    );
    return;
  }
});
