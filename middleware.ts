import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'opsflow_locale'
const CCY = 'opsflow_ccy'

// Visitor currency: primary EUR (23/set/2026). Country from Vercel geo header.
function currencyFor(country: string): 'EUR' | 'CHF' | 'GBP' | 'USD' {
  const c = country.toUpperCase()
  if (c === 'CH' || c === 'LI') return 'CHF'
  if (c === 'GB' || c === 'UK') return 'GBP'
  if (['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE'].includes(c)) return 'USD'
  return 'EUR'
}

function withCcy(req: NextRequest, res: NextResponse) {
  if (!req.cookies.get(CCY)) {
    const country = req.headers.get('x-vercel-ip-country') || (req as any).geo?.country || ''
    res.cookies.set(CCY, currencyFor(country), { path: '/', maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' })
  }
  return res
}

function langOf(p: string) { return p.startsWith('/de') ? 'de' : p.startsWith('/en') || p.startsWith('/platform') || p.startsWith('/diagnostic') ? 'en' : 'fr' }

function nextWithLang(req: NextRequest) {
  const h = new Headers(req.headers)
  h.set('x-lang', langOf(req.nextUrl.pathname))
  return NextResponse.next({ request: { headers: h } })
}

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname
  // 14/oct/2026 (Cassio): the root ALWAYS opens the English site, whatever language the visitor used before.
  // The old cookie (opsflow_locale=fr) used to keep returning visitors on the French home at "/".
  if (p === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/en'
    const res = NextResponse.redirect(url, 308)
    res.cookies.set(COOKIE, 'en', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return withCcy(req, res)
  }
  // The French home now lives at /fr (same page as before, served internally from "/").
  if (p === '/fr' || p === '/fr/') {
    const h = new Headers(req.headers)
    h.set('x-lang', 'fr')
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return withCcy(req, NextResponse.rewrite(url, { request: { headers: h } }))
  }
  return withCcy(req, nextWithLang(req))
}

export const config = { matcher: ['/((?!_next/|api/|icon|favicon|robots|sitemap|.*\\.(?:svg|png|jpg|jpeg|webp|txt|xml|ico)$).*)'] }
