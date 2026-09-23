'use client'
/* Shared I/O for the OpsFlow diagnostic engines.
   Files are parsed IN THE BROWSER (SheetJS). Raw data never leaves the visitor's machine;
   only the lead form (email/company) and summary KPIs are sent to /api/lead. */
import * as XLSX from 'xlsx'

export type Row = Record<string, any>
export type Table = { file: string; sheet: string; headers: string[]; rows: Row[] }

export const normKey = (k: string) =>
  String(k ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

export async function readFiles(files: File[]): Promise<Table[]> {
  const out: Table[] = []
  for (const f of files) {
    const buf = await f.arrayBuffer()
    const wb = XLSX.read(buf, { type: 'array', cellDates: true })
    for (const sheet of wb.SheetNames) {
      const raw = XLSX.utils.sheet_to_json<Row>(wb.Sheets[sheet], { defval: null, raw: true })
      if (!raw.length) continue
      const rows = raw.map((r) => { const o: Row = {}; for (const k of Object.keys(r)) o[normKey(k)] = r[k]; return o })
      out.push({ file: f.name, sheet, headers: Object.keys(rows[0]), rows })
    }
  }
  return out
}

/** Find the first table that has at least `required` of the alias groups. */
export function findTable(tables: Table[], groups: string[][], required = groups.length): Table | undefined {
  let best: Table | undefined; let bestHits = -1
  for (const t of tables) {
    const hits = groups.filter((g) => g.some((a) => t.headers.includes(normKey(a)))).length
    if (hits > bestHits) { best = t; bestHits = hits }
  }
  return bestHits >= required ? best : undefined
}

/** Read a value from a row by trying several header aliases. */
export function pick(row: Row, aliases: string[]): any {
  for (const a of aliases) { const v = row[normKey(a)]; if (v !== null && v !== undefined && v !== '') return v }
  return null
}
export function num(v: any): number | null {
  if (v === null || v === undefined || v === '') return null
  if (typeof v === 'number') return isFinite(v) ? v : null
  let s = String(v).trim().replace(/[^\d,.\-]/g, '')
  if (s.includes(',') && s.includes('.')) s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '')
  else if (s.includes(',')) s = s.replace(',', '.')
  const n = parseFloat(s); return isFinite(n) ? n : null
}
/** Normalise a date-ish value to 'YYYY-MM'. */
export function monthKey(v: any): string | null {
  if (v === null || v === undefined || v === '') return null
  if (v instanceof Date && !isNaN(+v)) return `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, '0')}`
  if (typeof v === 'number' && v > 20000 && v < 80000) { const d = XLSX.SSF.parse_date_code(v); return `${d.y}-${String(d.m).padStart(2, '0')}` }
  const s = String(v).trim()
  let m = s.match(/^(\d{4})[-/.](\d{1,2})/); if (m) return `${m[1]}-${m[2].padStart(2, '0')}`
  m = s.match(/^(\d{1,2})[-/.](\d{4})$/); if (m) return `${m[2]}-${m[1].padStart(2, '0')}`
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/); if (m) return `${m[3]}-${m[2].padStart(2, '0')}`
  const d = new Date(s); if (!isNaN(+d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  return null
}
export const monthLabel = (k: string) => { const [y, m] = k.split('-'); return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1]} ${y.slice(2)}` }

export const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0)
export const std = (a: number[]) => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)) }
export const cov = (a: number[]) => { const m = mean(a); return m > 0 ? std(a) / m : 0 }
export const round = (n: number, d = 0) => { const p = 10 ** d; return Math.round(n * p) / p }

/** ABC by cumulative share of value (80/15/5). Returns map key -> 'A'|'B'|'C'. */
export function abcClass(items: { key: string; value: number }[], a = 0.8, b = 0.95): Record<string, 'A' | 'B' | 'C'> {
  const sorted = [...items].sort((x, y) => y.value - x.value)
  const total = sorted.reduce((s, x) => s + Math.max(0, x.value), 0) || 1
  let cum = 0; const out: Record<string, 'A' | 'B' | 'C'> = {}
  for (const it of sorted) { cum += Math.max(0, it.value); const share = cum / total; out[it.key] = share <= a ? 'A' : share <= b ? 'B' : 'C' }
  return out
}
export const xyzClass = (c: number): 'X' | 'Y' | 'Z' => (c <= 0.5 ? 'X' : c <= 1 ? 'Y' : 'Z')

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: any) => { const s = String(v ?? ''); return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
  const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export async function captureLead(payload: Record<string, any>): Promise<{ ok: boolean; erro?: string }> {
  try {
    const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, pagina: typeof location !== 'undefined' ? location.pathname : '', idioma: typeof navigator !== 'undefined' ? navigator.language : '' }) })
    const j = await r.json().catch(() => ({ ok: false, erro: 'network' }))
    return j
  } catch { return { ok: false, erro: 'network' } }
}
export const isEmail = (s: string) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(s.trim())

export class EngineError extends Error {}
