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
  if (req.nextUrl.pathname !== '/') return withCcy(req, nextWithLang(req))

  const cookie = req.cookies.get(COOKIE)?.value
  let target = cookie
  if (!target) {
    // 05/oct/2026 (Cassio + Caio): English is the main language for everyone. FR/DE stay as secondary versions (language switch).
    target = 'en'
  }

  if (target === 'de' || target === 'en') {
    const url = req.nextUrl.clone()
    url.pathname = `/${target}`
    const res = NextResponse.redirect(url)
    res.cookies.set(COOKIE, target, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return withCcy(req, res)
  }
  const res = nextWithLang(req)
  if (!cookie) res.cookies.set(COOKIE, 'fr', { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return withCcy(req, res)
}

export const config = { matcher: ['/((?!_next/|api/|icon|favicon|robots|sitemap|.*\\.(?:svg|png|jpg|jpeg|webp|txt|xml|ico)$).*)'] }
