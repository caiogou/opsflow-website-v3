'use client'
import { useCurrency, fmtMoney } from '@/lib/currency'

/** Renders a CHF-based amount in the visitor's currency (EUR by default). */
export function Money({ chf, compact, prefix = '', suffix = '' }: { chf: number; compact?: boolean; prefix?: string; suffix?: string }) {
  const ccy = useCurrency()
  return <>{prefix}{fmtMoney(chf, ccy, { compact })}{suffix}</>
}
/** A CHF range like 22–80K. */
export function MoneyRange({ from, to, compact = true, suffix = '' }: { from: number; to: number; compact?: boolean; suffix?: string }) {
  const ccy = useCurrency()
  const a = fmtMoney(from, ccy, { compact }); const b = fmtMoney(to, ccy, { compact })
  const sym = a.match(/^[^\d]+/)?.[0] || ''
  return <>{a}–{b.slice(sym.length)}{suffix}</>
}
