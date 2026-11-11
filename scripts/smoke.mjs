#!/usr/bin/env node
/**
 * Smoke test script for Tokyo Grid v2
 * Runs against BASE_URL (default http://localhost:3000)
 * Usage: npm run smoke
 *        BASE_URL=https://tokyogridstore.com npm run smoke  (production, read-only GET)
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TIMEOUT = 15000;

const publicRoutes = [
  { path: '/', checks: ['html-lang', 'canonical', 'title'] },
  { path: '/catalog', checks: ['html-lang', 'canonical', 'title'] },
  { path: '/request', checks: ['html-lang', 'canonical', 'title'] },
  { path: '/how-it-works', checks: ['html-lang', 'canonical', 'title'] },
  { path: '/contact', checks: ['html-lang', 'canonical', 'title'] },
  { path: '/vinted', checks: ['html-lang', 'canonical', 'title'] },
];

const privateRoutes = [
  { path: '/login', checks: ['noindex', 'title'] },
  { path: '/register', checks: ['noindex', 'title'] },
  { path: '/verify', checks: ['noindex', 'title'] },
  { path: '/admin/login', checks: ['noindex', 'title'] },
];

const protectedRoutes = [
  { path: '/checkout', expectedRedirect: '/login' },
  { path: '/account/orders', expectedRedirect: '/login' },
];

const staticRoutes = [
  { path: '/robots.txt', expected: 200, checks: [] },
  { path: '/sitemap.xml', expected: 200, checks: [] },
];

const USER_AGENTS = {
  browser: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  googlebot: 'Googlebot/2.1 (+http://www.google.com/bot.html)',
};

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

function checkHtmlLang(html) {
  const matches = html.match(/<html[^>]*lang=["']([^"']+)["']/gi);
  if (!matches || matches.length === 0) {
    return { ok: false, error: 'Missing html lang attribute' };
  }
  if (matches.length > 1) {
    return { ok: false, error: `Multiple html lang attributes (${matches.length})` };
  }
  const lang = matches[0].match(/lang=["']([^"']+)["']/i)[1];
  if (!lang.startsWith('es')) {
    return { ok: false, error: `html lang is "${lang}", expected Spanish (es)` };
  }
  return { ok: true };
}

function checkCanonical(html, expectedPath) {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!match) {
    return { ok: false, error: 'Missing canonical link' };
  }
  const canonicalUrl = match[1].replace(/\/+$/, '');
  const expectedUrl = new URL(expectedPath, BASE_URL).href.replace(/\/+$/, '');
  if (canonicalUrl !== expectedUrl) {
    return { ok: false, error: `Canonical mismatch: got "${match[1]}", expected "${new URL(expectedPath, BASE_URL).href}"` };
  }
  return { ok: true };
}

function checkTitle(html) {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  if (!match || !match[1].trim()) {
    return { ok: false, error: 'Empty or missing title' };
  }
  return { ok: true };
}

function checkNoindex(html, headers) {
  const metaRobots = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
  if (metaRobots && metaRobots[1].includes('noindex')) {
    return { ok: true };
  }
  const xRobotsTag = headers.get('x-robots-tag');
  if (xRobotsTag && xRobotsTag.includes('noindex')) {
    return { ok: true };
  }
  return { ok: false, error: 'Missing noindex (meta robots or X-Robots-Tag)' };
}

function checkH1(html) {
  const match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  return { ok: !!match, text: match ? match[1].trim() : null };
}

async function checkPage(url, checks, ua = USER_AGENTS.browser) {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: { 'Accept': 'text/html,application/xhtml+xml', 'User-Agent': ua },
      redirect: 'manual',
    });

    const html = checks.length > 0 ? await response.text() : '';
    const errors = [];

    for (const check of checks) {
      let result;
      switch (check) {
        case 'html-lang':
          result = checkHtmlLang(html);
          break;
        case 'canonical':
          result = checkCanonical(html, url);
          break;
        case 'title':
          result = checkTitle(html);
          break;
        case 'noindex':
          result = checkNoindex(html, response.headers);
          break;
        default:
          result = { ok: false, error: `Unknown check: ${check}` };
      }
      if (!result.ok) {
        errors.push(result.error);
      }
    }

    return { ok: errors.length === 0, url, status: response.status, errors, headers: Object.fromEntries(response.headers), html };
  } catch (error) {
    return { ok: false, url, error: error.message };
  }
}

async function checkProtectedRoute(url, expectedRedirect) {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: { 'Accept': 'text/html,application/xhtml+xml' },
      redirect: 'manual',
    });

    const location = response.headers.get('location') || '';
    const isRedirect = [301, 302, 303, 307, 308].includes(response.status);
    const redirectsToLogin = location.startsWith(expectedRedirect) || location.startsWith(new URL(expectedRedirect, BASE_URL).href);

    return {
      ok: isRedirect && redirectsToLogin,
      url,
      status: response.status,
      location,
      expectedRedirect,
      errors: isRedirect && !redirectsToLogin ? [`Redirects to "${location}", expected "${expectedRedirect}"`] : (isRedirect ? [] : [`Expected 302/307 redirect to ${expectedRedirect}, got ${response.status}`]),
    };
  } catch (error) {
    return { ok: false, url, error: error.message };
  }
}

async function getProductSlugs() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/sitemap.xml`);
    const xml = await response.text();
    const slugs = [...xml.matchAll(/\/catalog\/([^<"\/]+)/g)].map(m => m[1]);
    return [...new Set(slugs)];
  } catch (error) {
    console.log(`⚠️  Could not fetch sitemap.xml: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log(`\n🔍 Smoke test v2 starting against ${BASE_URL}\n`);

  const results = [];
  let passed = 0;
  let failed = 0;

  // Public routes
  console.log('📄 Public routes:');
  for (const route of publicRoutes) {
    process.stdout.write(`  Testing ${route.path}... `);
    const result = await checkPage(route.path, route.checks);
    results.push({ ...result, type: 'public' });
    if (result.ok) {
      console.log('✅ PASS');
      passed++;
    } else {
      console.log(`❌ FAIL (${result.errors.join(', ')})`);
      failed++;
    }
  }

  // Private routes
  console.log('\n🔒 Private routes (noindex required):');
  for (const route of privateRoutes) {
    process.stdout.write(`  Testing ${route.path}... `);
    const result = await checkPage(route.path, route.checks);
    results.push({ ...result, type: 'private' });
    if (result.ok) {
      console.log('✅ PASS');
      passed++;
    } else {
      console.log(`❌ FAIL (${result.errors.join(', ')})`);
      failed++;
    }
  }

  // Protected routes (should redirect to login)
  console.log('\n🛡️  Protected routes (should redirect to login):');
  for (const route of protectedRoutes) {
    process.stdout.write(`  Testing ${route.path}... `);
    const result = await checkProtectedRoute(route.path, route.expectedRedirect);
    results.push({ ...result, type: 'protected' });
    if (result.ok) {
      console.log(`✅ PASS (${result.status} → ${result.location})`);
      passed++;
    } else {
      console.log(`❌ FAIL (status: ${result.status}, location: "${result.location}", errors: ${result.errors?.join(', ')})`);
      failed++;
    }
  }

  // Static routes
  console.log('\n📎 Static routes:');
  for (const route of staticRoutes) {
    process.stdout.write(`  Testing ${route.path}... `);
    try {
      const response = await fetchWithTimeout(`${BASE_URL}${route.path}`, { redirect: 'manual' });
      const statusOk = response.status === route.expected;
      if (statusOk) {
        console.log('✅ PASS');
        passed++;
        results.push({ ok: true, url: route.path, status: response.status, type: 'static' });
      } else {
        console.log(`❌ FAIL (expected ${route.expected}, got ${response.status})`);
        failed++;
        results.push({ ok: false, url: route.path, status: response.status, errors: [`Expected ${route.expected}, got ${response.status}`], type: 'static' });
      }
    } catch (error) {
      console.log(`❌ FAIL (${error.message})`);
      failed++;
      results.push({ ok: false, url: route.path, error: error.message, type: 'static' });
    }
  }

  // Product detail pages from sitemap
  console.log('\n🛍️  Product detail pages (from sitemap.xml):');
  const slugs = await getProductSlugs();
  console.log(`  Found ${slugs.length} product slugs`);

  const productResults = [];
  for (const slug of slugs) {
    const row = { slug };
    for (const [uaName, uaString] of Object.entries(USER_AGENTS)) {
      process.stdout.write(`  Testing /catalog/${slug} (${uaName})... `);
      const result = await checkPage(`/catalog/${slug}`, ['html-lang', 'canonical', 'title'], uaString);
      row[`status_${uaName}`] = result.status;
      row[`h1_${uaName}`] = checkH1(result.html || '').text;
      row[`ok_${uaName}`] = result.ok;
      row[`errors_${uaName}`] = result.errors;

      if (result.status >= 400) {
        const headers = JSON.stringify(result.headers, null, 2);
        const bodyPreview = (result.html || '').slice(0, 300);
        console.log(`\n    ❌ ${result.status} (${uaName})`);
        console.log(`    Headers: ${headers}`);
        console.log(`    Body (first 300 chars): ${bodyPreview}`);
      } else {
        console.log(`${result.status} ${result.ok ? '✅' : '⚠️'}`);
      }
    }
    productResults.push(row);
    results.push({ ...row, type: 'product' });
  }

  // Summary table for products
  if (productResults.length > 0) {
    console.log('\n📊 Product results summary:');
    console.log('  Slug | Browser | Googlebot | H1 (browser)');
    console.log('  ' + '-'.repeat(80));
    for (const r of productResults) {
      const browserStatus = r.status_browser;
      const googlebotStatus = r.status_googlebot;
      const h1 = r.h1_browser || '(none)';
      console.log(`  ${r.slug} | ${browserStatus} | ${googlebotStatus} | ${h1}`);
    }

    const failedProducts = productResults.filter(r => r.status_browser >= 400 || r.status_googlebot >= 400);
    if (failedProducts.length > 0) {
      console.log(`\n  ⚠️  ${failedProducts.length} product(s) with 4xx/5xx:`);
      for (const r of failedProducts) {
        console.log(`    - ${r.slug}: browser=${r.status_browser}, googlebot=${r.status_googlebot}`);
      }
    }
  }

  // Final summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(60));

  if (failed > 0) {
    console.log('\nFailures:');
    results.filter(r => !r.ok).forEach(r => {
      const err = r.errors?.join(', ') || r.error || `status ${r.status}, location ${r.location}`;
      console.log(`  ${r.path || r.url || r.slug}: ${err}`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All checks passed!');
    process.exit(0);
  }
}

main().catch(console.error);