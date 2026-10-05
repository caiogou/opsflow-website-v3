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

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== '/') return withCcy(req, NextResponse.next())

  // 05/oct/2026 (Caio alignment): English is the DEFAULT language for everyone. "/" goes to /en unless the visitor
  // explicitly chose French (?lang=fr from the language switcher, remembered in the cookie). German keeps /de.
  const asked = req.nextUrl.searchParams.get('lang')
  const cookie = req.cookies.get(COOKIE)?.value
  const target = asked === 'fr' ? 'fr' : asked === 'de' ? 'de' : asked === 'en' ? 'en' : cookie === 'fr' ? 'fr' : cookie === 'de' ? 'de' : 'en'

  if (target === 'de' || target === 'en') {
    const url = req.nextUrl.clone()
    url.pathname = `/${target}`
    url.searchParams.delete('lang')
    const res = NextResponse.redirect(url, 308)
    res.cookies.set(COOKIE, target, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return withCcy(req, res)
  }
  if (asked === 'fr') {
    // Serve the French home at "/" without the query string in the address bar.
    const url = req.nextUrl.clone()
    url.searchParams.delete('lang')
    const res = NextResponse.redirect(url, 307)
    res.cookies.set(COOKIE, 'fr', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return withCcy(req, res)
  }
  const res = NextResponse.next()
  return withCcy(req, res)
}

export const config = { matcher: ['/((?!_next/|api/|icon|favicon|robots|sitemap|.*\\.(?:svg|png|jpg|jpeg|webp|txt|xml|ico)$).*)'] }
