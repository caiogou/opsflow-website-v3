'use client'
/* Supply Chain KPI Diagnostic engine.
   Input  : order lines (required) + monthly plan vs actual (optional), parsed in the browser.
   Output : dataset with the same shape as the demo dataset used by app/platform/kpis/page.tsx.
   Rule   : nothing is invented. KPIs that cannot be computed from the files are `null` ("n/a"). */
import { type Table, type Row, normKey, num, monthLabel, round, mean } from './io'

/* ─────────────────────────── Types (shared with the page) ─────────────────────────── */

export type KpiMetrics = {
  otif: number | null; otifTarget: number
  otd: number | null; otdTarget: number
  fillRate: number | null; fillRateTarget: number
  scCost: number | null; scCostBench: number
  freightCost: number | null
  inventoryTurns: number | null; inventoryTurnsTarget: number
  dos: number | null; dosTarget: number
  forecastAccuracy: number | null; forecastAccuracyTarget: number
  planAdherence: number | null; planAdherenceTarget: number
}
export type RadarPoint = { kpi: string; actual: number; benchmark: number; fullMark: number }
export type TrendPoint = { month: string; otif: number | null; otd?: number | null; turns: number | null; forecastAcc: number | null; planAdhere: number | null }
export type RootCause = { cause: string; impact: number }
export type GapRow = { kpi: string; current: string; target: string; benchmark: string; gap: string; trend: string; priority: string }
export type RhythmRow = { meeting: string; current: string; recommended: string; gap: string; impact: string }
export type Recommendation = { id: number; priority: string; title: string; impact: string; description: string; timeline: string; practice: string; effort: string }
export type DataHealth = { overall: number; dimensions: { name: string; score: number; detail: string }[] }
export type RoadmapPhase = { phase: string; title: string; color: string; items: string[] }
export type KpiMeta = {
  isDemo: boolean
  subtitle: string
  trendNote: string
  rootCauseNote: string
  impactDrivers: string
  impactDrivers2: string
  valueLabel: string
  showInvestment: boolean
  notes: string[]
}
export type KpiDataset = {
  COMPANY: { name: string; currency: string }
  KPI_METRICS: KpiMetrics
  RADAR_DATA: RadarPoint[]
  MONTHLY_TREND: TrendPoint[]
  ROOT_CAUSES: RootCause[]
  GAP_ANALYSIS: GapRow[]
  OPERATIONAL_RHYTHM: RhythmRow[]
  RECOMMENDATIONS: Recommendation[]
  DATA_HEALTH: DataHealth
  ROADMAP: RoadmapPhase[]
  META: KpiMeta
}

/* ─────────────────────────── Reference values (industry reference, not client targets) ─────────────────────────── */

export const REF = {
  otif: 95, otd: 93, fillRate: 97, inFull: 96, promise: 95,
  scCost: 6.5, turns: 8.5, dos: 25, fa: 82, pa: 90,
}
const BENCH_TXT: Record<string, string> = {
  otif: '93-96%', otd: '91-95%', fillRate: '96-99%', scCost: '6-7%',
  turns: '7-9x', dos: '20-28d', fa: '80-85%', pa: '88-92%',
}

/* ─────────────────────────── Column aliases (en / fr / de / pt) ─────────────────────────── */

const A = {
  orderId: ['order_id', 'order', 'order_no', 'order_number', 'so_number', 'sales_order', 'commande', 'no_commande', 'n_commande', 'numero_commande', 'auftrag', 'auftragsnummer', 'auftrags_nr', 'bestellung', 'bestellnummer', 'pedido', 'numero_pedido', 'n_pedido', 'ordem'],
  line: ['line', 'line_no', 'line_number', 'item_no', 'position', 'pos', 'ligne', 'no_ligne', 'zeile', 'positionsnummer', 'linha', 'item_pedido'],
  customer: ['customer', 'customer_name', 'customer_id', 'client', 'client_name', 'sold_to', 'nom_client', 'kunde', 'kundenname', 'kunden_nr', 'cliente', 'nome_cliente'],
  sku: ['sku', 'item_code', 'material', 'material_number', 'product', 'product_code', 'article', 'code_article', 'reference', 'artikel', 'artikelnummer', 'produto', 'codigo_produto', 'part_number'],
  orderDate: ['order_date', 'created_date', 'creation_date', 'date_commande', 'auftragsdatum', 'bestelldatum', 'data_pedido', 'data_do_pedido'],
  requested: ['requested_date', 'request_date', 'requested_delivery_date', 'customer_requested_date', 'crd', 'due_date', 'date_souhaitee', 'date_livraison_souhaitee', 'date_demandee', 'wunschtermin', 'wunschdatum', 'wunschliefertermin', 'data_solicitada', 'data_desejada', 'data_entrega_solicitada'],
  promised: ['promised_date', 'promise_date', 'confirmed_date', 'commit_date', 'committed_date', 'date_confirmee', 'date_promise', 'bestatigter_termin', 'bestaetigter_termin', 'bestatigtes_datum', 'data_prometida', 'data_confirmada'],
  actual: ['delivery_date', 'ship_date', 'shipped_date', 'actual_delivery_date', 'actual_ship_date', 'goods_issue_date', 'date_livraison', 'date_livraison_reelle', 'date_expedition', 'lieferdatum', 'versanddatum', 'warenausgang', 'warenausgangsdatum', 'data_entrega', 'data_expedicao', 'data_envio', 'data_faturamento'],
  qtyOrd: ['qty_ordered', 'ordered_qty', 'order_qty', 'quantity_ordered', 'qte_commandee', 'quantite_commandee', 'bestellmenge', 'auftragsmenge', 'qtd_pedida', 'quantidade_pedida', 'qty', 'quantity', 'quantite', 'menge', 'quantidade'],
  qtyDel: ['qty_delivered', 'delivered_qty', 'shipped_qty', 'qty_shipped', 'quantity_delivered', 'quantity_shipped', 'qte_livree', 'quantite_livree', 'liefermenge', 'gelieferte_menge', 'qtd_entregue', 'quantidade_entregue', 'qtd_expedida'],
  value: ['value', 'line_value', 'net_value', 'amount', 'order_value', 'sales_value', 'valeur', 'montant', 'wert', 'betrag', 'nettowert', 'valor', 'valor_linha'],
  currency: ['currency', 'devise', 'monnaie', 'wahrung', 'waehrung', 'moeda'],
}
const P = {
  month: ['month', 'period', 'mois', 'periode', 'monat', 'mes', 'periodo', 'date'],
  key: ['sku', 'family', 'product_family', 'item', 'material', 'product', 'famille', 'article', 'produktfamilie', 'artikel', 'familia', 'produto'],
  planned: ['planned_qty', 'plan_qty', 'planned_production', 'production_plan', 'plan', 'qte_planifiee', 'quantite_planifiee', 'planmenge', 'plan_menge', 'qtd_planejada', 'planejado'],
  actualQty: ['actual_qty', 'produced_qty', 'actual_production', 'production_actual', 'qte_realisee', 'quantite_realisee', 'qte_produite', 'istmenge', 'ist_menge', 'produzierte_menge', 'qtd_real', 'qtd_realizada', 'realizado'],
  forecast: ['forecast_qty', 'forecast', 'fcst', 'prevision', 'qte_prevue', 'prognose', 'absatzprognose', 'previsao', 'qtd_prevista'],
  demand: ['actual_demand', 'demand', 'actual_sales', 'sales_qty', 'demande_reelle', 'demande', 'ventes', 'nachfrage', 'absatz', 'ist_absatz', 'demanda_real', 'demanda', 'vendas'],
  inv: ['inventory_value', 'stock_value', 'inv_value', 'valeur_stock', 'valeur_du_stock', 'lagerwert', 'bestandswert', 'valor_estoque', 'valor_do_estoque'],
  cogs: ['cogs', 'cost_of_goods_sold', 'cost_of_sales', 'cout_des_ventes', 'cout_des_marchandises_vendues', 'wareneinsatz', 'herstellkosten_des_umsatzes', 'cmv', 'cpv', 'custo_mercadoria_vendida'],
  scCost: ['sc_cost', 'supply_chain_cost', 'logistics_cost', 'cout_logistique', 'cout_supply_chain', 'logistikkosten', 'supply_chain_kosten', 'custo_logistico', 'custo_supply_chain'],
  revenue: ['revenue', 'net_sales', 'sales', 'turnover', 'chiffre_affaires', 'chiffre_d_affaires', 'ca', 'umsatz', 'nettoumsatz', 'receita', 'faturamento', 'receita_liquida'],
}

/* ─────────────────────────── Templates ─────────────────────────── */

export const KPI_TEMPLATES = [
  {
    name: 'Order lines (required)',
    desc: 'One row per order line, ~12 months: requested / promised / delivery dates, ordered vs delivered qty',
    filename: 'opsflow_kpis_order_lines.csv',
    headers: ['order_id', 'line', 'customer', 'sku', 'order_date', 'requested_date', 'promised_date', 'delivery_date', 'qty_ordered', 'qty_delivered', 'value'],
    sample: [
      ['SO-24001', 10, 'Migros Logistics', 'PAL-EUR-1200', '2025-01-06', '2025-01-15', '2025-01-15', '2025-01-14', 120, 120, 2880],
      ['SO-24001', 20, 'Migros Logistics', 'PAL-IND-1000', '2025-01-06', '2025-01-15', '2025-01-17', '2025-01-17', 80, 80, 2240],
      ['SO-24002', 10, 'Coop Distribution', 'PAL-EUR-1200', '2025-01-07', '2025-01-13', '2025-01-13', '2025-01-16', 200, 200, 4800],
      ['SO-24003', 10, 'Nestle Orbe', 'BOX-600-400', '2025-01-08', '2025-01-20', '2025-01-20', '2025-01-20', 500, 430, 1500],
      ['SO-24004', 10, 'Emmi AG', 'PAL-CP3', '2025-01-09', '2025-01-22', '2025-01-24', '2025-01-23', 60, 60, 1740],
      ['SO-24005', 10, 'Coop Distribution', 'BOX-600-400', '2025-01-10', '2025-01-24', '2025-01-24', '', 300, 0, 900],
    ] as (string | number)[][],
  },
  {
    name: 'Monthly plan vs actual (optional)',
    desc: 'Per month and SKU/family: plan vs actual, forecast vs demand, inventory value, COGS, SC cost, revenue',
    filename: 'opsflow_kpis_monthly_plan_actual.csv',
    headers: ['month', 'sku', 'planned_qty', 'actual_qty', 'forecast_qty', 'actual_demand', 'inventory_value', 'cogs', 'sc_cost', 'revenue'],
    sample: [
      ['2025-01', 'PAL-EUR-1200', 4200, 3950, 4000, 4310, 182000, 96000, 11200, 138000],
      ['2025-01', 'BOX-600-400', 9000, 8400, 8800, 7900, 64000, 31000, 4100, 47000],
      ['2025-02', 'PAL-EUR-1200', 4100, 4180, 4200, 3980, 175000, 91000, 10600, 131000],
      ['2025-02', 'BOX-600-400', 8800, 8900, 8500, 9150, 61000, 33000, 4300, 50000],
      ['2025-03', 'PAL-EUR-1200', 4400, 3900, 4300, 4620, 190000, 102000, 11900, 147000],
      ['2025-03', 'BOX-600-400', 9200, 9050, 9000, 8700, 66000, 32000, 4200, 48000],
    ] as (string | number)[][],
  },
]

/* ─────────────────────────── Helpers ─────────────────────────── */

const firstHeader = (t: Table, aliases: string[]) => aliases.map(normKey).find((a) => t.headers.includes(a)) || null
/** Read by exact resolved column (so that a generic alias never steals another column). */
const col = (row: Row, h: string | null) => (h ? (row[h] === '' ? null : row[h]) : null)

const DAY = 86400000
const utcDay = (y: number, m: number, d: number) => {
  if (!(y > 1900 && y < 2200 && m >= 1 && m <= 12 && d >= 1 && d <= 31)) return null
  return Math.round(Date.UTC(y, m - 1, d) / DAY)
}
/** Detects whether ambiguous a/b/yyyy dates are day-first (default, European) or month-first. */
function detectDayFirst(values: any[]): boolean {
  let dmy = 0, mdy = 0
  for (const v of values) {
    if (typeof v !== 'string') continue
    const m = v.trim().match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/)
    if (!m) continue
    if (+m[1] > 12) dmy++
    else if (+m[2] > 12) mdy++
  }
  return !(mdy > dmy)
}
/** Returns a day number (days since 1970-01-01, UTC) or null. */
function toDay(v: any, dayFirst: boolean): number | null {
  if (v === null || v === undefined || v === '') return null
  if (v instanceof Date) return isNaN(+v) ? null : utcDay(v.getFullYear(), v.getMonth() + 1, v.getDate())
  if (typeof v === 'number') {
    if (v > 20000 && v < 80000) return Math.round(v) - 25569 // Excel serial -> epoch days
    if (v > 19000101 && v < 21001231) return utcDay(Math.floor(v / 10000), Math.floor(v / 100) % 100, v % 100)
    return null
  }
  const s = String(v).trim()
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (m) return utcDay(+m[1], +m[2], +m[3])
  m = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/)
  if (m) {
    let y = +m[3]; if (y < 100) y += 2000
    const a = +m[1], b = +m[2]
    const [d, mo] = a > 12 ? [a, b] : b > 12 ? [b, a] : dayFirst ? [a, b] : [b, a]
    return utcDay(y, mo, d)
  }
  m = s.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (m) return utcDay(+m[1], +m[2], +m[3])
  const d = new Date(s)
  return isNaN(+d) ? null : utcDay(d.getFullYear(), d.getMonth() + 1, d.getDate())
}
const dayToMonth = (d: number) => { const x = new Date(d * DAY); return `${x.getUTCFullYear()}-${String(x.getUTCMonth() + 1).padStart(2, '0')}` }
const dayToIso = (d: number) => new Date(d * DAY).toISOString().slice(0, 10)
const weekday = (d: number) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(d * DAY).getUTCDay()]
/** Month key for plan files: 'YYYY-MM', 'MM/YYYY', dates, Excel serials. */
function planMonth(v: any, dayFirst: boolean): string | null {
  if (v === null || v === undefined || v === '') return null
  if (typeof v === 'string') {
    const s = v.trim()
    let m = s.match(/^(\d{4})[-/.](\d{1,2})$/); if (m) return `${m[1]}-${m[2].padStart(2, '0')}`
    m = s.match(/^(\d{1,2})[-/.](\d{4})$/); if (m) return `${m[2]}-${m[1].padStart(2, '0')}`
  }
  const d = toDay(v, dayFirst)
  return d === null ? null : dayToMonth(d)
}
const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))
const fin = (n: number | null | undefined): n is number => typeof n === 'number' && isFinite(n)
const r1 = (n: number) => round(n, 1)
const fmtMoney = (n: number) => {
  const a = Math.abs(n)
  if (a >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (a >= 1_000) return `${Math.round(n / 1_000)}K`
  return `${Math.round(n)}`
}
/** 'up' / 'down' / 'flat' = direction of the metric itself (first vs last months). */
const trendOf = (series: (number | null | undefined)[]): string => {
  const v = series.filter(fin) as number[]
  if (v.length < 4) return 'flat'
  const k = Math.max(1, Math.min(3, Math.floor(v.length / 3)))
  const delta = mean(v.slice(-k)) - mean(v.slice(0, k))
  const rel = Math.abs(delta) / (Math.abs(mean(v)) || 1)
  if (rel < 0.02) return 'flat'
  return delta > 0 ? 'up' : 'down'
}
const priorityFor = (shortfall: number, crit: number, high: number) =>
  shortfall >= crit ? 'CRITICAL' : shortfall >= high ? 'HIGH' : shortfall > 0 ? 'MEDIUM' : 'LOW'
const sheetName = (t: Table) => `${t.file}${t.sheet && !/\.csv$/i.test(t.file) ? ' / ' + t.sheet : ''}`

/* ─────────────────────────── Table detection ─────────────────────────── */

type OrderCols = Record<keyof typeof A, string | null>
const resolveOrderCols = (t: Table): OrderCols => {
  const c = Object.fromEntries(Object.entries(A).map(([k, al]) => [k, firstHeader(t, al)])) as OrderCols
  if (c.qtyOrd && c.qtyOrd === c.qtyDel) c.qtyOrd = null
  return c
}
function detectOrders(tables: Table[]): { t: Table; c: OrderCols } {
  let best: Table = tables[0]; let bestScore = -1
  for (const t of tables) {
    const c = resolveOrderCols(t)
    const s = [c.requested || c.promised, c.actual, c.qtyOrd, c.qtyDel].filter(Boolean).length * 10
      + [c.orderId, c.customer, c.sku, c.orderDate].filter(Boolean).length
    if (s > bestScore) { best = t; bestScore = s }
  }
  const c = resolveOrderCols(best)
  const missing: string[] = []
  if (!c.requested && !c.promised) missing.push('requested_date (or promised_date)')
  if (!c.actual) missing.push('delivery_date (or ship_date)')
  if (!c.qtyOrd) missing.push('qty_ordered')
  if (!c.qtyDel) missing.push('qty_delivered')
  if (missing.length) {
    throw new Error(
      `We could not find an order-lines table. Missing column(s): ${missing.join(', ')}. ` +
      `Closest sheet "${sheetName(best)}" has: ${best.headers.slice(0, 15).join(', ')}${best.headers.length > 15 ? '…' : ''}. ` +
      `Expected: order_id, line, customer, sku, order_date, requested_date, promised_date (optional), delivery_date or ship_date, qty_ordered, qty_delivered, value (optional). Download the "Order lines" template.`)
  }
  return { t: best, c }
}
type PlanCols = Record<keyof typeof P, string | null>
function detectPlan(tables: Table[], exclude: Table): { t: Table; c: PlanCols } | null {
  let best: { t: Table; c: PlanCols } | null = null; let bestScore = 0
  for (const t of tables) {
    if (t === exclude) continue
    const c = Object.fromEntries(Object.entries(P).map(([k, al]) => [k, firstHeader(t, al)])) as PlanCols
    if (!c.month) continue
    const pairs = [c.planned && c.actualQty, c.forecast && c.demand, c.inv && c.cogs, c.scCost && c.revenue].filter(Boolean).length
    if (pairs > bestScore) { best = { t, c }; bestScore = pairs }
  }
  return best
}

/* ─────────────────────────── Main ─────────────────────────── */

type Line = {
  due: number; req: number | null; prom: number | null; act: number | null; ord: number | null
  qo: number; qd: number; value: number | null; customer: string; sku: string; month: string
}
type Eval = Line & { ot: boolean; inf: boolean; open: boolean }

export function analyzeKpis(tables: Table[]): KpiDataset {
  if (!tables.length) throw new Error('No readable table found. Check that the first row contains column headers.')
  const { t: ot, c } = detectOrders(tables)

  const dateCols = [c.requested, c.promised, c.actual, c.orderDate].filter(Boolean) as string[]
  const sampleDates: any[] = []
  for (const r of ot.rows.slice(0, 5000)) for (const h of dateCols) sampleDates.push(r[h])
  const dayFirst = detectDayFirst(sampleDates)

  /* ── parse lines */
  const lines: Line[] = []
  let invalid = 0, dupes = 0, weird = 0
  const seen = new Set<string>()
  const currencies: Record<string, number> = {}
  for (const r of ot.rows) {
    const req = toDay(col(r, c.requested), dayFirst)
    const prom = toDay(col(r, c.promised), dayFirst)
    const due = req ?? prom
    const qo = num(col(r, c.qtyOrd))
    let qd = num(col(r, c.qtyDel))
    const act = toDay(col(r, c.actual), dayFirst)
    if (due === null || qo === null || qo <= 0) { invalid++; continue }
    if (act === null && qd === null) qd = 0
    if (qd === null) { invalid++; continue }
    if (qd < 0 || qd > qo * 3) weird++
    if (c.orderId) {
      const key = `${col(r, c.orderId)}|${c.line ? col(r, c.line) : ''}|${c.sku ? col(r, c.sku) : ''}`
      if (seen.has(key)) dupes++; else seen.add(key)
    }
    const cur = c.currency ? String(col(r, c.currency) ?? '').trim().toUpperCase() : ''
    if (cur && cur.length <= 4) currencies[cur] = (currencies[cur] || 0) + 1
    lines.push({
      due, req, prom, act, ord: toDay(col(r, c.orderDate), dayFirst), qo, qd: Math.max(0, qd),
      value: c.value ? num(col(r, c.value)) : null,
      customer: c.customer ? String(col(r, c.customer) ?? '').trim() || '—' : '—',
      sku: c.sku ? String(col(r, c.sku) ?? '').trim() || '—' : '—',
      month: dayToMonth(due),
    })
  }
  if (lines.length < 20) {
    throw new Error(`Only ${lines.length} usable order lines found in "${sheetName(ot)}" (at least 20 are needed, each with a requested/promised date and an ordered quantity > 0). ${invalid} rows were skipped because of missing or unreadable dates / quantities.`)
  }

  /* reference "today" = last delivery date in the file (fallback: last due date) */
  let refDay = -Infinity
  for (const l of lines) if (l.act !== null && l.act > refDay) refDay = l.act
  if (!isFinite(refDay)) for (const l of lines) if (l.due > refDay) refDay = l.due
  const lastMonth = dayToMonth(refDay)
  const months = Array.from(new Set(lines.map((l) => l.month))).sort().filter((m) => m <= lastMonth).slice(-12)
  const inWin = new Set(months)

  const evald: Eval[] = []
  let openNotDue = 0
  for (const l of lines) {
    if (!inWin.has(l.month)) continue
    if (l.act === null) {
      if (l.due >= refDay) { openNotDue++; continue } // not yet due -> excluded
      evald.push({ ...l, ot: false, inf: l.qd >= l.qo - 1e-9, open: true })
      continue
    }
    evald.push({ ...l, ot: l.act <= l.due, inf: l.qd >= l.qo - 1e-9, open: false })
  }
  if (evald.length < 20) throw new Error('Too few order lines are due within the period covered by the file — check the date columns (requested / delivery date).')

  const N = evald.length
  const rate = (arr: Eval[], f: (e: Eval) => boolean) => (arr.length ? (arr.filter(f).length / arr.length) * 100 : 0)
  const otif = rate(evald, (e) => e.ot && e.inf)
  const otd = rate(evald, (e) => e.ot)
  const inFullRate = rate(evald, (e) => e.inf)
  const sumQo = evald.reduce((s, e) => s + e.qo, 0)
  const fillRate = sumQo > 0 ? (evald.reduce((s, e) => s + Math.min(e.qd, e.qo), 0) / sumQo) * 100 : null
  const hasReqAndProm = !!(c.requested && c.promised)
  const withBoth = evald.filter((e) => e.req !== null && e.prom !== null)
  const promiseOk = hasReqAndProm && withBoth.length >= 10 ? (withBoth.filter((e) => (e.prom as number) <= (e.req as number)).length / withBoth.length) * 100 : null
  const otdVsPromise = hasReqAndProm && withBoth.length >= 10
    ? (withBoth.filter((e) => e.act !== null && e.act <= (e.prom as number)).length / withBoth.length) * 100 : null

  /* ── value (only if a value column exists and is mostly filled) */
  const valued = evald.filter((e) => fin(e.value) && (e.value as number) > 0)
  const hasValue = !!c.value && valued.length >= N * 0.5
  const shortValue = hasValue ? valued.reduce((s, e) => s + ((e.value as number) / e.qo) * Math.max(0, e.qo - e.qd), 0) : 0
  const monthsSpan = Math.max(1, months.length)
  const annualise = 12 / monthsSpan

  const byMonth: Record<string, Eval[]> = {}
  for (const e of evald) (byMonth[e.month] ||= []).push(e)

  /* ── plan file (optional) */
  const plan = detectPlan(tables, ot)
  type PM = { absFD: number; biasFD: number; dem: number; absPA: number; planned: number; inv: number; cogs: number; sc: number; rev: number; nFA: number; nPA: number; nInv: number; nSc: number }
  const pm: Record<string, PM> = {}
  const notes: string[] = []
  if (plan) {
    const pc = plan.c
    const pDayFirst = detectDayFirst(plan.t.rows.slice(0, 5000).map((r) => r[pc.month!]))
    for (const r of plan.t.rows) {
      const m = planMonth(col(r, pc.month), pDayFirst); if (!m) continue
      const x = (pm[m] ||= { absFD: 0, biasFD: 0, dem: 0, absPA: 0, planned: 0, inv: 0, cogs: 0, sc: 0, rev: 0, nFA: 0, nPA: 0, nInv: 0, nSc: 0 })
      const f = num(col(r, pc.forecast)), d = num(col(r, pc.demand))
      if (fin(f) && fin(d) && d >= 0 && f >= 0) { x.absFD += Math.abs(f - d); x.biasFD += f - d; x.dem += d; x.nFA++ }
      const pl = num(col(r, pc.planned)), ac = num(col(r, pc.actualQty))
      if (fin(pl) && fin(ac) && pl >= 0 && ac >= 0) { x.absPA += Math.abs(pl - ac); x.planned += pl; x.nPA++ }
      const iv = num(col(r, pc.inv)), cg = num(col(r, pc.cogs))
      if (fin(iv) && fin(cg) && iv >= 0 && cg >= 0) { x.inv += iv; x.cogs += cg; x.nInv++ }
      const sc = num(col(r, pc.scCost)), rv = num(col(r, pc.revenue))
      if (fin(sc) && fin(rv) && sc >= 0 && rv >= 0) { x.sc += sc; x.rev += rv; x.nSc++ }
    }
  } else {
    notes.push('No monthly plan-vs-actual file found: forecast accuracy, plan adherence, inventory turns, DOS and SC cost % are shown as n/a.')
  }
  const planMonths = Object.keys(pm).sort().slice(-12)
  const pSum = (k: keyof PM, cond: (x: PM) => boolean) => planMonths.map((m) => pm[m]).filter(cond).reduce((s, x) => s + x[k], 0)
  const faDem = pSum('dem', (x) => x.nFA > 0)
  const forecastAccuracy = faDem > 0 ? clamp((1 - pSum('absFD', (x) => x.nFA > 0) / faDem) * 100) : null
  const faBias = faDem > 0 ? (pSum('biasFD', (x) => x.nFA > 0) / faDem) * 100 : null
  const paPlan = pSum('planned', (x) => x.nPA > 0)
  const planAdherence = paPlan > 0 ? clamp((1 - pSum('absPA', (x) => x.nPA > 0) / paPlan) * 100) : null
  const invMonths = planMonths.filter((m) => pm[m].nInv > 0 && pm[m].inv > 0)
  const avgInv = invMonths.length ? mean(invMonths.map((m) => pm[m].inv)) : 0
  const annualCogs = invMonths.length ? invMonths.reduce((s, m) => s + pm[m].cogs, 0) * (12 / invMonths.length) : 0
  const inventoryTurns = avgInv > 0 && annualCogs > 0 ? annualCogs / avgInv : null
  const dos = fin(inventoryTurns) && inventoryTurns > 0 ? 365 / inventoryTurns : null
  const scMonths = planMonths.filter((m) => pm[m].nSc > 0 && pm[m].rev > 0)
  const scRev = scMonths.reduce((s, m) => s + pm[m].rev, 0)
  const scCost = scRev > 0 ? (scMonths.reduce((s, m) => s + pm[m].sc, 0) / scRev) * 100 : null
  const annualRevenue = scMonths.length ? scRev * (12 / scMonths.length) : 0
  if (plan) {
    if (forecastAccuracy === null) notes.push('Plan file has no usable forecast_qty + actual_demand: forecast accuracy n/a.')
    if (planAdherence === null) notes.push('Plan file has no usable planned_qty + actual_qty: plan adherence n/a.')
    if (inventoryTurns === null) notes.push('Plan file has no usable inventory_value + cogs: inventory turns / DOS n/a.')
    if (scCost === null) notes.push('Plan file has no usable sc_cost + revenue: SC cost % n/a.')
    if (inventoryTurns !== null) notes.push('Inventory turns = annualised COGS / average monthly inventory value (sum of rows per month).')
  }

  /* ── trend (union of order months and plan months, last 12) */
  const trendMonths = Array.from(new Set([...months, ...planMonths])).sort().slice(-12)
  const MONTHLY_TREND: TrendPoint[] = trendMonths.map((m) => {
    const es = byMonth[m] || []
    const x = pm[m]
    return {
      month: monthLabel(m),
      otif: es.length ? r1(rate(es, (e) => e.ot && e.inf)) : null,
      otd: es.length ? r1(rate(es, (e) => e.ot)) : null,
      turns: x && x.nInv > 0 && x.inv > 0 && x.cogs > 0 ? r1((x.cogs * 12) / x.inv) : null,
      forecastAcc: x && x.nFA > 0 && x.dem > 0 ? r1(clamp((1 - x.absFD / x.dem) * 100)) : null,
      planAdhere: x && x.nPA > 0 && x.planned > 0 ? r1(clamp((1 - x.absPA / x.planned) * 100)) : null,
    }
  })

  /* ── failure modes (mutually exclusive) + concentration drivers */
  const failed = evald.filter((e) => !(e.ot && e.inf))
  const F = failed.length
  const share = (n: number) => (F ? r1((n / F) * 100) : 0)
  const openOver = failed.filter((e) => e.open).length
  const lateShort = failed.filter((e) => !e.open && !e.ot && !e.inf).length
  const promisedLate = failed.filter((e) => !e.open && !e.ot && e.inf && e.req !== null && e.prom !== null && e.prom > e.req && (e.act as number) <= e.prom).length
  const lateExec = failed.filter((e) => !e.open && !e.ot && e.inf).length - promisedLate
  const shortOnly = failed.filter((e) => !e.open && e.ot && !e.inf).length
  const modes: RootCause[] = [
    { cause: hasReqAndProm ? 'Shipped after promise' : 'Shipped late (in full)', impact: share(lateExec) },
    { cause: 'Promised later than request', impact: share(promisedLate) },
    { cause: 'Short-shipped (on time)', impact: share(shortOnly) },
    { cause: 'Late and short', impact: share(lateShort) },
    { cause: 'Open & overdue', impact: share(openOver) },
  ].filter((x) => x.impact > 0)

  const groupFail = (key: (e: Eval) => string) => {
    const tot: Record<string, number> = {}, bad: Record<string, number> = {}
    for (const e of evald) { const k = key(e); tot[k] = (tot[k] || 0) + 1; if (!(e.ot && e.inf)) bad[k] = (bad[k] || 0) + 1 }
    return Object.keys(tot).map((k) => ({ k, tot: tot[k], bad: bad[k] || 0, rate: (bad[k] || 0) / tot[k] })).sort((a, b) => b.bad - a.bad)
  }
  const byCust = c.customer ? groupFail((e) => e.customer) : []
  const bySku = c.sku ? groupFail((e) => e.sku) : []
  const failRate = F / N
  const conc: RootCause[] = []
  const trunc = (s: string, n = 18) => (s.length > n ? s.slice(0, n - 1) + '…' : s)
  if (byCust.length > 1) byCust.slice(0, 2).forEach((g) => { if (g.bad > 0) conc.push({ cause: `Customer ${trunc(g.k)}`, impact: share(g.bad) }) })
  if (bySku.length > 1 && bySku[0].bad > 0) conc.push({ cause: `SKU ${trunc(bySku[0].k)}`, impact: share(bySku[0].bad) })
  let worstDay: { k: string; bad: number; rate: number } | null = null
  if (c.orderDate && evald.some((e) => e.ord !== null)) {
    const wd = groupFail((e) => (e.ord !== null ? weekday(e.ord) : '?')).filter((g) => g.k !== '?' && g.tot >= 20)
    const w = wd.sort((a, b) => b.rate - a.rate)[0]
    if (w && w.rate > failRate * 1.2 && w.bad > 0) { worstDay = w; conc.push({ cause: `Orders placed ${w.k}`, impact: share(w.bad) }) }
  }
  const ROOT_CAUSES = [...modes, ...conc].sort((a, b) => b.impact - a.impact).slice(0, 8)

  /* lateness / lead-time stats */
  const lateDelivered = evald.filter((e) => !e.open && !e.ot)
  const avgDaysLate = lateDelivered.length ? mean(lateDelivered.map((e) => (e.act as number) - e.due)) : 0
  const slipLines = withBoth.filter((e) => (e.prom as number) > (e.req as number))
  const avgSlip = slipLines.length ? mean(slipLines.map((e) => (e.prom as number) - (e.req as number))) : 0
  const leadTimes = evald.filter((e) => e.ord !== null && e.act !== null).map((e) => (e.act as number) - (e.ord as number)).filter((d) => d >= 0 && d < 400)
  const avgLead = leadTimes.length ? mean(leadTimes) : null
  const shortLines = evald.filter((e) => !e.inf).length
  const shortShare = (shortLines / N) * 100
  const badDateOrder = evald.filter((e) => e.act !== null && e.ord !== null && (e.act as number) < (e.ord as number)).length

  /* ── KPI metrics */
  const o1 = (n: number | null) => (fin(n) ? r1(n) : null)
  const KPI_METRICS: KpiMetrics = {
    otif: r1(otif), otifTarget: REF.otif,
    otd: r1(otd), otdTarget: REF.otd,
    fillRate: o1(fillRate), fillRateTarget: REF.fillRate,
    scCost: o1(scCost), scCostBench: REF.scCost,
    freightCost: null,
    inventoryTurns: o1(inventoryTurns), inventoryTurnsTarget: REF.turns,
    dos: fin(dos) ? Math.round(dos) : null, dosTarget: REF.dos,
    forecastAccuracy: o1(forecastAccuracy), forecastAccuracyTarget: REF.fa,
    planAdherence: o1(planAdherence), planAdherenceTarget: REF.pa,
  }

  /* ── radar: available KPIs only, 0-100 scale */
  const RADAR_DATA: RadarPoint[] = []
  const rp = (kpi: string, v: number | null, b: number) => { if (fin(v)) RADAR_DATA.push({ kpi, actual: r1(clamp(v)), benchmark: b, fullMark: 100 }) }
  rp('OTIF', otif, REF.otif)
  rp('OTD', otd, REF.otd)
  rp('Fill Rate', fillRate, REF.fillRate)
  rp('In-Full Lines', inFullRate, REF.inFull)
  rp('Promise = Request', promiseOk, REF.promise)
  rp('Forecast Acc.', forecastAccuracy, REF.fa)
  rp('Plan Adhere.', planAdherence, REF.pa)
  rp('Inv. Turns (x10)', fin(inventoryTurns) ? inventoryTurns * 10 : null, REF.turns * 10)
  rp('SC Cost Effic.', fin(scCost) ? 100 - scCost * 5 : null, 100 - REF.scCost * 5)

  /* ── gap analysis vs reference */
  const tOtif = trendOf(MONTHLY_TREND.map((x) => x.otif))
  const tOtd = trendOf(MONTHLY_TREND.map((x) => x.otd))
  const GAP_ANALYSIS: GapRow[] = []
  const na = (kpi: string, target: string, bench: string) => GAP_ANALYSIS.push({ kpi, current: 'n/a', target, benchmark: bench, gap: 'Not provided', trend: 'flat', priority: 'N/A' })
  const sg = (g: number, unit: string, d = 1) => `${g >= 0 ? '+' : ''}${round(g, d)}${unit}`
  const pctRow = (kpi: string, v: number | null, ref: number, bench: string, trend: string, crit = 5, high = 2) => {
    if (!fin(v)) return na(kpi, `${ref}% ref.`, bench)
    const g = v - ref
    GAP_ANALYSIS.push({ kpi, current: `${r1(v)}%`, target: `${ref}% ref.`, benchmark: bench, gap: sg(g, '%'), trend, priority: priorityFor(-g, crit, high) })
  }
  pctRow('On-Time In-Full (OTIF)', otif, REF.otif, BENCH_TXT.otif, tOtif)
  pctRow('On-Time Delivery (OTD)', otd, REF.otd, BENCH_TXT.otd, tOtd)
  pctRow('Fill Rate (units)', fillRate, REF.fillRate, BENCH_TXT.fillRate, 'flat', 4, 1.5)
  if (!fin(scCost)) na('Supply Chain Cost %', `${REF.scCost}% ref.`, BENCH_TXT.scCost)
  else GAP_ANALYSIS.push({ kpi: 'Supply Chain Cost %', current: `${r1(scCost)}%`, target: `${REF.scCost}% ref.`, benchmark: BENCH_TXT.scCost, gap: sg(scCost - REF.scCost, '%'), trend: 'flat', priority: priorityFor(scCost - REF.scCost, 1.5, 0.5) })
  if (!fin(inventoryTurns) || !fin(dos)) {
    na('Inventory Turns', `${REF.turns}x ref.`, BENCH_TXT.turns)
    na('Days of Supply', `${REF.dos}d ref.`, BENCH_TXT.dos)
  } else {
    GAP_ANALYSIS.push({ kpi: 'Inventory Turns', current: `${r1(inventoryTurns)}x`, target: `${REF.turns}x ref.`, benchmark: BENCH_TXT.turns, gap: sg(inventoryTurns - REF.turns, 'x'), trend: trendOf(MONTHLY_TREND.map((x) => x.turns)), priority: priorityFor(REF.turns - inventoryTurns, 3, 1.5) })
    GAP_ANALYSIS.push({ kpi: 'Days of Supply', current: `${Math.round(dos)}d`, target: `${REF.dos}d ref.`, benchmark: BENCH_TXT.dos, gap: sg(Math.round(dos - REF.dos), 'd', 0), trend: 'flat', priority: priorityFor(dos - REF.dos, 12, 5) })
  }
  pctRow('Forecast Accuracy (1-WMAPE)', forecastAccuracy, REF.fa, BENCH_TXT.fa, trendOf(MONTHLY_TREND.map((x) => x.forecastAcc)), 10, 4)
  pctRow('Plan Adherence', planAdherence, REF.pa, BENCH_TXT.pa, trendOf(MONTHLY_TREND.map((x) => x.planAdhere)), 10, 4)
  const PRANK: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, 'N/A': 4 }

  /* ── currency: only if the file says so */
  const currency = Object.entries(currencies).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
  const cur = (n: number) => `${currency ? currency + ' ' : ''}${fmtMoney(n)}`

  /* ── recommendations: rules on computed metrics */
  type R = Omit<Recommendation, 'id'> & { rank: number; val: number }
  const recs: R[] = []
  const topCust = byCust[0]
  const topCustShare = topCust && F ? topCust.bad / F : 0
  const topSkus = bySku.filter((g) => g.bad > 0).slice(0, 3).map((g) => g.k)
  const nf = (n: number) => Math.round(n).toLocaleString('en')
  if (otif < REF.otif) {
    const pr = priorityFor(REF.otif - otif, 5, 2)
    recs.push({
      rank: PRANK[pr], val: 0, priority: pr,
      title: 'Install a weekly OTIF exception review on failed lines',
      impact: '',
      description: `OTIF is ${r1(otif)}% on ${nf(N)} due lines (reference ${REF.otif}%): ${nf(F)} lines failed — ${r1(((lateDelivered.length + openOver) / N) * 100)}% late or still open and ${r1(shortShare)}% short.${lateDelivered.length ? ` Late deliveries arrive on average ${r1(avgDaysLate)} days after the due date.` : ''} A weekly review of every failed line (owner, cause code, countermeasure) is the fastest lever to close the ${r1(REF.otif - otif)}-point gap.`,
      timeline: '2 weeks', practice: 'Service & Execution Performance', effort: 'Low',
    })
  }
  if (promiseOk !== null && promiseOk < REF.promise && slipLines.length) {
    const pr = priorityFor(REF.promise - promiseOk, 15, 5)
    recs.push({
      rank: PRANK[pr], val: 0, priority: pr,
      title: 'Fix order promising and lead-time master data',
      impact: '',
      description: `${r1(100 - promiseOk)}% of lines were promised later than the customer requested (average slippage ${r1(avgSlip)} days).${promisedLate ? ` ${share(promisedLate)}% of OTIF failures were delivered on the promised date but after the requested date.` : ''} Compare quoted lead times with actual ${avgLead !== null ? `order-to-delivery (${r1(avgLead)} days on average)` : 'order-to-delivery times'} and align ATP / capacity checks with customer requested dates.`,
      timeline: '3-4 weeks', practice: 'Demand & Order Management', effort: 'Medium',
    })
  }
  if (shortShare > 3 || (fin(fillRate) && fillRate < REF.fillRate)) {
    const prF = priorityFor(REF.fillRate - (fin(fillRate) ? fillRate : 100), 4, 1.5)
    const prL = priorityFor(REF.inFull - inFullRate, 6, 2)
    const pr = PRANK[prF] <= PRANK[prL] ? prF : prL
    const ann = shortValue * annualise
    recs.push({
      rank: PRANK[pr], val: ann, priority: pr,
      title: 'Protect availability of short-shipped SKUs (allocation & safety stock)',
      impact: hasValue && ann > 0 ? fmtMoney(ann) : '',
      description: `${r1(shortShare)}% of lines were not delivered in full; unit fill rate is ${fin(fillRate) ? r1(fillRate) + '%' : 'n/a'}.${topSkus.length ? ` Failures concentrate on ${topSkus.join(', ')}.` : ''} Segment safety stock by demand variability for these SKUs and introduce allocation rules for constrained items.${hasValue && shortValue > 0 ? ` Value not shipped on short lines: ${cur(shortValue)} over ${monthsSpan} month(s); the impact figure is this value annualised (revenue at risk, not margin).` : ''}`,
      timeline: '3-4 weeks', practice: 'Inventory & Demand Optimization', effort: 'Medium',
    })
  }
  if (topCust && byCust.length > 2 && topCustShare > 0.2 && topCust.rate > failRate * 1.1) {
    recs.push({
      rank: PRANK.HIGH, val: 0, priority: 'HIGH',
      title: `Build a service recovery plan for ${topCust.k}`,
      impact: '',
      description: `${topCust.k} accounts for ${r1(topCustShare * 100)}% of all OTIF failures, with a failure rate of ${r1(topCust.rate * 100)}% vs ${r1(failRate * 100)}% overall. Agree a joint order cut-off / forecast-sharing routine and track this customer's OTIF weekly.`,
      timeline: '4 weeks', practice: 'Customer Service & Collaboration', effort: 'Low',
    })
  }
  if (worstDay) {
    recs.push({
      rank: PRANK.MEDIUM, val: 0, priority: 'MEDIUM',
      title: `Level the workload for orders placed on ${worstDay.k}`,
      impact: '',
      description: `Orders placed on ${worstDay.k} fail OTIF ${r1(worstDay.rate * 100)}% of the time vs ${r1(failRate * 100)}% overall. Check order cut-off times, picking capacity and carrier slots for that day.`,
      timeline: '2 weeks', practice: 'Warehouse & Transport Execution', effort: 'Low',
    })
  }
  if (fin(forecastAccuracy) && forecastAccuracy < REF.fa) {
    const pr = priorityFor(REF.fa - forecastAccuracy, 10, 4)
    recs.push({
      rank: PRANK[pr], val: 0, priority: pr,
      title: 'Track forecast error and bias by SKU every month',
      impact: '',
      description: `Forecast accuracy (1 − WMAPE) is ${r1(forecastAccuracy)}% vs ${REF.fa}% reference${fin(faBias) ? `, with a ${faBias >= 0 ? 'positive (over-forecast)' : 'negative (under-forecast)'} bias of ${r1(Math.abs(faBias))}%` : ''}. Publish a monthly error & bias report by SKU/family and review the worst offenders in the demand planning meeting.`,
      timeline: '3 weeks', practice: 'Demand Planning Optimization', effort: 'Low',
    })
  }
  if (fin(planAdherence) && planAdherence < REF.pa) {
    const pr = priorityFor(REF.pa - planAdherence, 10, 4)
    recs.push({
      rank: PRANK[pr], val: 0, priority: pr,
      title: 'Introduce a frozen horizon and a weekly tactical S&OP',
      impact: '',
      description: `Plan adherence is ${r1(planAdherence)}% vs ${REF.pa}% reference: actual output deviates from plan by ${r1(100 - planAdherence)}% of planned volume. A frozen/slushy horizon and a 30-minute weekly supply-demand reconciliation stabilise execution.`,
      timeline: '4 weeks', practice: 'Planning Process Design', effort: 'Medium',
    })
  }
  if (fin(dos) && dos > REF.dos && annualCogs > 0) {
    const excess = Math.max(0, avgInv - (annualCogs / 365) * REF.dos)
    const pr = priorityFor(dos - REF.dos, 12, 5)
    recs.push({
      rank: PRANK[pr], val: excess, priority: pr,
      title: 'Reduce days of supply with segmented stock targets',
      impact: excess > 0 ? fmtMoney(excess) : '',
      description: `Inventory covers ${Math.round(dos)} days (${r1(inventoryTurns as number)} turns) vs ${REF.dos} days reference. Bringing coverage to the reference level would release about ${cur(excess)} of working capital (one-off, from average inventory value and COGS in your file).`,
      timeline: '6-8 weeks', practice: 'Inventory Optimization', effort: 'Medium',
    })
  }
  if (fin(scCost) && scCost > REF.scCost && annualRevenue > 0) {
    const excess = ((scCost - REF.scCost) / 100) * annualRevenue
    const pr = priorityFor(scCost - REF.scCost, 1.5, 0.5)
    recs.push({
      rank: PRANK[pr], val: excess, priority: pr,
      title: 'Run a supply chain cost-to-serve review',
      impact: excess > 0 ? fmtMoney(excess) : '',
      description: `Supply chain cost is ${r1(scCost)}% of revenue vs ${REF.scCost}% reference. Closing the gap on your annualised revenue is worth about ${cur(excess)} per year; start with freight, warehousing and expediting costs by customer.`,
      timeline: '6 weeks', practice: 'Cost & Network Optimization', effort: 'Medium',
    })
  }
  if (!plan || forecastAccuracy === null || inventoryTurns === null) {
    recs.push({
      rank: PRANK.LOW + 0.5, val: 0, priority: 'LOW',
      title: 'Complete the KPI set with monthly plan, forecast and inventory data',
      impact: '',
      description: `Some KPIs could not be measured from the files provided (${[forecastAccuracy === null && 'forecast accuracy', planAdherence === null && 'plan adherence', inventoryTurns === null && 'turns / DOS', scCost === null && 'SC cost %'].filter(Boolean).join(', ')}). Adding the monthly plan-vs-actual template unlocks these benchmarks.`,
      timeline: '1 week', practice: 'Performance Management', effort: 'Low',
    })
  }
  if (!recs.length) {
    recs.push({
      rank: PRANK.LOW, val: 0, priority: 'LOW',
      title: 'Sustain performance with a monthly KPI review',
      impact: '', description: 'All measured KPIs meet the reference levels. Keep a monthly KPI review with owners and cause codes to hold the gains.',
      timeline: 'ongoing', practice: 'Performance Management', effort: 'Low',
    })
  }
  const RECOMMENDATIONS: Recommendation[] = recs
    .sort((a, b) => a.rank - b.rank || b.val - a.val)
    .slice(0, 6)
    .map((r, i) => ({ id: i + 1, priority: r.priority === 'N/A' ? 'LOW' : r.priority, title: r.title, impact: r.impact, description: r.description, timeline: r.timeline, practice: r.practice, effort: r.effort }))

  /* ── operational rhythm (generic cadences, justified by what the data shows) */
  const OPERATIONAL_RHYTHM: RhythmRow[] = [
    {
      meeting: 'Service Exception Review', current: 'Not in data', recommended: otif < 90 ? 'Daily (15 min)' : 'Weekly',
      gap: `${nf(F / monthsSpan)} failed lines per month on average (OTIF ${r1(otif)}%)`,
      impact: otif < REF.otif ? 'Late/short lines repeat without cause coding' : 'Hold performance at reference level',
    },
    {
      meeting: 'Demand Planning', current: 'Not in data', recommended: fin(forecastAccuracy) && forecastAccuracy < 75 ? 'Weekly' : 'Monthly + weekly exceptions',
      gap: fin(forecastAccuracy) ? `Forecast accuracy ${r1(forecastAccuracy)}% vs ${REF.fa}% reference` : 'Forecast accuracy not measurable from the files provided',
      impact: 'Forecast latency drives shortages and excess',
    },
    {
      meeting: 'Inventory Review', current: 'Not in data', recommended: fin(dos) && dos > REF.dos + 10 ? 'Bi-weekly' : 'Monthly',
      gap: fin(dos) ? `${Math.round(dos)} days of supply vs ${REF.dos}d reference` : `${r1(shortShare)}% of lines short-shipped (inventory value not provided)`,
      impact: 'Excess / obsolete risk and availability gaps',
    },
    {
      meeting: 'S&OP', current: 'Not in data', recommended: fin(planAdherence) && planAdherence < REF.pa ? 'Monthly + weekly tactical' : 'Monthly',
      gap: fin(planAdherence) ? `Plan adherence ${r1(planAdherence)}% vs ${REF.pa}% reference` : promiseOk !== null ? `${r1(100 - promiseOk)}% of lines promised later than requested` : 'Plan adherence not measurable from the files provided',
      impact: 'Decisions lag reality',
    },
  ]

  /* ── data health, computed on the files */
  const totalRows = ot.rows.length
  const completeness = clamp(((totalRows - invalid) / Math.max(1, totalRows)) * 100)
  const accuracy = clamp(100 - ((weird + dupes) / Math.max(1, totalRows)) * 500)
  const timeliness = clamp((months.length / 12) * 100)
  const consistency = clamp(100 - (dupes / Math.max(1, totalRows)) * 1000 - (badDateOrder / N) * 500)
  const optFound = [c.promised && 'promised date', c.customer && 'customer', c.sku && 'SKU', c.orderDate && 'order date', c.value && 'value', plan && 'plan file']
  const granularity = clamp(40 + optFound.filter(Boolean).length * 10)
  const DATA_HEALTH: DataHealth = {
    overall: Math.round(mean([completeness, accuracy, timeliness, consistency, granularity])),
    dimensions: [
      { name: 'Completeness', score: Math.round(completeness), detail: `${nf(totalRows - invalid)} of ${nf(totalRows)} rows usable${invalid ? `; ${nf(invalid)} skipped (missing/unreadable date or quantity)` : ''}` },
      { name: 'Accuracy', score: Math.round(accuracy), detail: `${nf(weird)} lines with implausible delivered qty, ${nf(dupes)} duplicate order/line keys` },
      { name: 'Timeliness', score: Math.round(timeliness), detail: `${months.length} month(s) of history (${monthLabel(months[0])} – ${monthLabel(months[months.length - 1])}); 12 recommended${openNotDue ? `; ${nf(openNotDue)} open lines not yet due excluded` : ''}` },
      { name: 'Consistency', score: Math.round(consistency), detail: `Delivery before order date on ${nf(badDateOrder)} lines; due date = ${c.requested ? 'requested date' : 'promised date'}` },
      { name: 'Granularity', score: Math.round(granularity), detail: `Optional data found: ${optFound.filter(Boolean).join(', ') || 'none'}` },
    ],
  }

  /* ── roadmap from recommendations */
  const recItem = (r?: Recommendation) => (r ? `${r.title}${r.impact ? ` (${currency ? currency + ' ' : ''}${r.impact})` : ''}` : null)
  const ROADMAP: RoadmapPhase[] = [
    { phase: 'Week 1-4', title: 'Diagnose & Quick Wins', color: '#22C55E', items: [recItem(RECOMMENDATIONS[0]), recItem(RECOMMENDATIONS[1]), 'Publish a weekly KPI dashboard (OTIF, OTD, fill rate) with cause codes'].filter(Boolean) as string[] },
    { phase: 'Week 5-8', title: 'Build Foundation', color: '#EAB308', items: [recItem(RECOMMENDATIONS[2]), recItem(RECOMMENDATIONS[3]), 'Align KPI definitions (due date, in-full tolerance) across teams'].filter(Boolean) as string[] },
    { phase: 'Week 9-12', title: 'Sustain & Scale', color: '#0EA5E9', items: [recItem(RECOMMENDATIONS[4]), recItem(RECOMMENDATIONS[5]), 'Establish continuous improvement rhythms'].filter(Boolean) as string[] },
  ]

  /* ── meta */
  const measured = [otif, otd, fillRate, forecastAccuracy, planAdherence, inventoryTurns, dos, scCost].filter(fin).length
  const worstGaps = GAP_ANALYSIS.filter((g) => g.priority === 'CRITICAL' || g.priority === 'HIGH')
  const gapTxt = (g: GapRow) => `${g.kpi.replace(/ \(.*\)/, '')} ${g.gap}`
  notes.push(`OTIF/OTD measured against the ${c.requested ? 'customer requested date' : 'promised date'}; a line is in full when delivered qty ≥ ordered qty. Open lines past due on ${dayToIso(refDay)} (last delivery date in the file) count as failures.`)
  if (otdVsPromise !== null) notes.push(`OTD against the promised date: ${r1(otdVsPromise)}%.`)
  if (!hasValue) notes.push('No line value column: no monetary impact is estimated for service recommendations.')
  if (!currency) notes.push('No currency column found: amounts are shown without currency.')

  return {
    COMPANY: { name: 'Your data', currency },
    KPI_METRICS, RADAR_DATA, MONTHLY_TREND, ROOT_CAUSES, GAP_ANALYSIS, OPERATIONAL_RHYTHM, RECOMMENDATIONS, DATA_HEALTH, ROADMAP,
    META: {
      isDemo: false,
      subtitle: `${nf(N)} order lines · ${months.length}-month history · ${measured} KPIs measured`,
      trendNote: `OTIF ${tOtif === 'flat' ? 'stable' : tOtif === 'up' ? 'improving' : 'deteriorating'} over the period${MONTHLY_TREND.some((x) => fin(x.forecastAcc) || fin(x.planAdhere)) ? '; forecast accuracy / plan adherence from your plan file' : ''}`,
      rootCauseNote: `Share of ${nf(F)} OTIF-failed lines. Failure modes are exclusive; customer / SKU / weekday bars show concentration and overlap with them.`,
      impactDrivers: worstGaps.length ? worstGaps.slice(0, 2).map(gapTxt).join(' / ') : 'All measured KPIs at reference level',
      impactDrivers2: worstGaps.slice(2, 4).map(gapTxt).join(' / ') || 'vs industry reference values',
      valueLabel: 'Addressable value quantified from your data',
      showInvestment: false,
      notes,
    },
  }
}

export function kpiSummary(d: KpiDataset): Record<string, any> {
  const k = d.KPI_METRICS
  return {
    kpis_otif: k.otif, kpis_otd: k.otd, kpis_fill_rate: k.fillRate, kpis_forecast_accuracy: k.forecastAccuracy,
    kpis_plan_adherence: k.planAdherence, kpis_turns: k.inventoryTurns, kpis_sc_cost_pct: k.scCost,
    kpis_recommendations: d.RECOMMENDATIONS.length, kpis_data_health: d.DATA_HEALTH.overall,
  }
}
