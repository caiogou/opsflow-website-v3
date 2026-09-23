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

  const cookie = req.cookies.get(COOKIE)?.value
  let target = cookie
  if (!target) {
    const al = (req.headers.get('accept-language') || '').split(',')[0].split('-')[0].toLowerCase()
    // 23/set/2026: English is the lead language (international positioning). FR only for French browsers.
    target = al === 'de' ? 'de' : al === 'fr' ? 'fr' : 'en'
  }

  if (target === 'de' || target === 'en') {
    const url = req.nextUrl.clone()
    url.pathname = `/${target}`
    const res = NextResponse.redirect(url)
    res.cookies.set(COOKIE, target, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return withCcy(req, res)
  }
  const res = NextResponse.next()
  if (!cookie) res.cookies.set(COOKIE, 'fr', { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return withCcy(req, res)
}

export const config = { matcher: ['/((?!_next/|api/|icon|favicon|robots|sitemap|.*\\.(?:svg|png|jpg|jpeg|webp|txt|xml|ico)$).*)'] }
