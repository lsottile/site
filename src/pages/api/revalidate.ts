export const prerender = false;

import type { APIRoute } from 'astro';

const ALLOWED_PATHS = /^(\/$|\/now|\/articles(\/[^/]+)?)$/;

export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.REVALIDATE_TOKEN;
  const siteUrl = import.meta.env.SITE_URL ?? 'https://lucianosottile.xyz';

  // Accept Bearer header OR ?token= query param for curl ergonomics
  const authHeader = request.headers.get('authorization') ?? '';
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');

  const provided = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : queryToken ?? '';

  if (!token || provided !== token) {
    return new Response('Unauthorized', { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const rawPaths = Array.isArray((body as { paths?: unknown }).paths)
    ? ((body as { paths: unknown[] }).paths as unknown[])
    : ['/', '/now'];

  const paths = rawPaths
    .filter((p): p is string => typeof p === 'string' && ALLOWED_PATHS.test(p));

  if (paths.length === 0) {
    return Response.json({ ok: false, error: 'No valid paths provided.' }, { status: 400 });
  }

  const results: string[] = [];

  for (const p of paths) {
    try {
      await fetch(`${siteUrl}${p}`, {
        headers: { 'x-prerender-revalidate': token },
      });
      results.push(p);
    } catch (err) {
      console.error(`[revalidate] Failed to revalidate ${p}:`, err);
    }
  }

  return Response.json({ ok: true, revalidated: results });
};
