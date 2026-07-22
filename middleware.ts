import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'opsflow_locale'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== '/') return NextResponse.next()

  const cookie = req.cookies.get(COOKIE)?.value
  let target = cookie
  if (!target) {
    const al = (req.headers.get('accept-language') || '').split(',')[0].split('-')[0].toLowerCase()
    target = al === 'de' ? 'de' : al === 'en' ? 'en' : 'fr'
  }

  if (target === 'de') {
    const url = req.nextUrl.clone()
    url.pathname = '/de'
    const res = NextResponse.redirect(url)
    res.cookies.set(COOKIE, 'de', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return res
  }
  if (target === 'en') {
    const url = req.nextUrl.clone()
    url.pathname = '/en'
    const res = NextResponse.redirect(url)
    res.cookies.set(COOKIE, 'en', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return res
  }
  const res = NextResponse.next()
  if (!cookie) res.cookies.set(COOKIE, 'fr', { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return res
}

export const config = { matcher: ['/'] }
