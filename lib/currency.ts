'use client'
/* Visitor currency (23/set/2026). Primary EUR; CHF for Switzerland/Liechtenstein, GBP for the UK, USD for the Americas.
   The country comes from the `opsflow_ccy` cookie set by middleware (Vercel geo header).
   RATES are approximate conversions FROM CHF, used only to display indicative prices / sample figures — review periodically. */
import { useEffect, useState } from 'react'

export type Ccy = 'EUR' | 'CHF' | 'GBP' | 'USD'
export const RATES_FROM_CHF: Record<Ccy, number> = { CHF: 1, EUR: 1.07, GBP: 0.92, USD: 1.25 }
export const SYMBOL: Record<Ccy, string> = { EUR: '€', CHF: 'CHF ', GBP: '£', USD: '$' }

export function readCcy(): Ccy {
  if (typeof document === 'undefined') return 'EUR'
  const m = document.cookie.match(/(?:^|; )opsflow_ccy=([A-Z]{3})/)
  const v = m?.[1] as Ccy | undefined
  return v && v in RATES_FROM_CHF ? v : 'EUR'
}

export function useCurrency(): Ccy {
  const [c, setC] = useState<Ccy>('EUR')
  useEffect(() => { setC(readCcy()) }, [])
  return c
}

/** Convert a CHF amount and round to a "price-like" figure. */
export function convertChf(chf: number, ccy: Ccy): number {
  const v = chf * RATES_FROM_CHF[ccy]
  if (ccy === 'CHF') return chf
  const step = v >= 10000 ? 1000 : v >= 1000 ? 500 : v >= 100 ? 50 : 1
  return Math.round(v / step) * step
}

export function fmtMoney(chf: number, ccy: Ccy, opts: { compact?: boolean } = {}): string {
  const v = convertChf(chf, ccy)
  const s = opts.compact
    ? (v >= 1e6 ? `${(v / 1e6).toFixed(v >= 1e7 ? 0 : 2).replace(/\.?0+$/, '')}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : String(v))
    : v.toLocaleString('en-US').replace(/,/g, ccy === 'CHF' ? '’' : ',')
  return `${SYMBOL[ccy]}${s}`
}

/** Sample (fictional) datasets are expressed in CHF. For display we only swap the currency label:
 *  the company is fictional, so the figures stay as illustrative magnitudes. */
export function localizeDemo<T>(obj: T, ccy: Ccy): T {
  if (ccy === 'CHF') return obj
  const sym = SYMBOL[ccy].trim()
  const walk = (x: any): any => {
    if (typeof x === 'string') return x.replace(/CHF\s?/g, sym === 'CHF' ? 'CHF ' : sym)
    if (Array.isArray(x)) return x.map(walk)
    if (x && typeof x === 'object') { const o: any = {}; for (const k of Object.keys(x)) o[k] = k === 'currency' && x[k] === 'CHF' ? sym : walk(x[k]); return o }
    return x
  }
  return walk(obj)
}
