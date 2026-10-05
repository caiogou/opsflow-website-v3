/* Demand & Forecast Diagnostic engine.
   Pure computation over parsed tables (see io.ts). Runs in the browser; no data leaves the machine. */
import { findTable, pick, num, monthKey, monthLabel, mean, cov, round, abcClass, xyzClass, normKey, type Table, type Row } from './io'

/* ─────────────────────────── Types (shape of the dashboard dataset) ─────────────────────────── */

export type DemandDataset = {
  COMPANY: { name: string; currency: string; skuCount: number; warehouseCount: number }
  FORECAST_BY_FAMILY: { family: string; mape: number; skus: number; demand: number }[]
  FORECAST_TREND: { month: string; actual: number; forecast: number; bias: number }[]
  DEMAND_SEGMENTATION: { abc: string; xyz: string; skus: number; pctRevenue: number; planning: string; cov: number }[]
  WORST_FORECAST_SKUS: { sku: string; desc: string; family: string; mape: number; demand: string; seasonality: string }[]
  DEMAND_PATTERNS: { pattern: string; count: number; color: string; description: string }[]
  HEALTH_METRICS: {
    mapeActual: number; mapeBenchmark: number; forecastBias: number; demandVolatility: number
    skusNoForecast: number; totalSkus: number; avgForecastHorizon: number; dataCompleteness: number; forecastingMethod: string
  }
  DATA_HEALTH: { overall: number; dimensions: { name: string; score: number; detail: string }[] }
  RECOMMENDATIONS: {
    id: number; priority: string; title: string; impact: string; description: string
    timeline: string; practice: string; effort: string
  }[]
  /** Labels / flags that keep the UI honest about what was actually computed. */
  META: {
    isDemo: boolean
    hasForecast: boolean
    hasValue: boolean
    periodLabel: string
    accuracyLabel: string
    benchmarkLabel: string
    biasLabel: string
    noForecastLabel: string
    volumeLabel: string
    trendTitle: string
    trendSubtitle: string
    worstTitle: string
    roadmap: string[][]
    notes: string[]
  }
}

/* ─────────────────────────── Templates ─────────────────────────── */

export const DEMAND_TEMPLATES = [
  {
    name: 'Demand History',
    desc: 'Required — monthly demand by SKU (12-24+ months). Optional: the forecast you had for that month, family, unit price',
    filename: 'demand_history_template.csv',
    headers: ['sku', 'month', 'quantity', 'forecast', 'family', 'description', 'unit_price'],
    sample: [
      ['SKU-1001', '2025-01', 420, 450, 'Beverages', 'Sparkling water 6x1.5L', 4.2],
      ['SKU-1001', '2025-02', 398, 430, 'Beverages', 'Sparkling water 6x1.5L', 4.2],
      ['SKU-1001', '2025-03', 455, 440, 'Beverages', 'Sparkling water 6x1.5L', 4.2],
      ['SKU-2040', '2025-01', 0, 15, 'Personal Care', 'Shampoo repair 250ml', 6.9],
      ['SKU-2040', '2025-02', 37, 15, 'Personal Care', 'Shampoo repair 250ml', 6.9],
      ['SKU-2040', '2025-03', 4, 20, 'Personal Care', 'Shampoo repair 250ml', 6.9],
    ] as (string | number)[][],
  },
  {
    name: 'SKU Master',
    desc: 'Optional — family, description, unit cost/price and the current forecast method per SKU',
    filename: 'sku_master_template.csv',
    headers: ['sku', 'description', 'family', 'unit_cost', 'unit_price', 'forecast_method'],
    sample: [
      ['SKU-1001', 'Sparkling water 6x1.5L', 'Beverages', 2.6, 4.2, 'Moving average'],
      ['SKU-2040', 'Shampoo repair 250ml', 'Personal Care', 3.1, 6.9, 'Manual'],
      ['SKU-3310', 'Dog food adult 3kg', 'Pet Care', 7.8, 14.5, 'Exponential smoothing'],
      ['SKU-4102', 'Dishwasher tabs x40', 'Home & Cleaning', 5.2, 9.9, 'Manual'],
    ] as (string | number)[][],
  },
]

/* ─────────────────────────── Header aliases (en/fr/de/pt/es) ─────────────────────────── */

const A = {
  sku: ['sku', 'item', 'item_code', 'item_number', 'item_no', 'material', 'material_number', 'product_code', 'product_id', 'product', 'article', 'artikel', 'artikelnummer', 'article_code', 'code_article', 'reference', 'ref', 'codigo', 'codigo_produto', 'produto', 'sku_code', 'part_number', 'code'],
  month: ['month', 'period', 'date', 'year_month', 'yearmonth', 'periode', 'mois', 'monat', 'datum', 'mes', 'data', 'periodo', 'fecha', 'posting_date', 'order_date', 'ship_date'],
  qty: ['quantity', 'qty', 'units', 'demand', 'sales_qty', 'sales_quantity', 'actual', 'actuals', 'shipments', 'shipped_qty', 'consumption', 'volume', 'quantite', 'menge', 'absatz', 'quantidade', 'qtd', 'cantidad', 'demand_qty', 'actual_qty', 'order_qty', 'sales'],
  fcst: ['forecast', 'fcst', 'forecast_qty', 'forecast_quantity', 'fc', 'prevision', 'previsao', 'prognose', 'vorhersage', 'planned_qty', 'statistical_forecast', 'final_forecast', 'consensus_forecast'],
  family: ['family', 'product_family', 'category', 'product_category', 'product_group', 'famille', 'categorie', 'familia', 'categoria', 'warengruppe', 'produktgruppe', 'kategorie', 'product_line', 'group', 'segment'],
  desc: ['description', 'desc', 'item_description', 'product_name', 'name', 'designation', 'libelle', 'bezeichnung', 'beschreibung', 'descricao', 'descripcion', 'nome'],
  price: ['unit_price', 'price', 'selling_price', 'list_price', 'prix', 'prix_unitaire', 'preis', 'stuckpreis', 'preco', 'preco_unitario', 'precio', 'unit_cost', 'cost', 'standard_cost', 'cout', 'cout_unitaire', 'kosten', 'custo', 'custo_unitario'],
  value: ['value', 'sales_value', 'revenue', 'net_sales', 'amount', 'turnover', 'chiffre_affaires', 'umsatz', 'faturamento', 'receita', 'valor', 'ventas'],
  method: ['forecast_method', 'planning_method', 'method', 'methode', 'metodo', 'prognosemethode', 'forecasting_method'],
  currency: ['currency', 'curr', 'devise', 'wahrung', 'moeda', 'moneda'],
  site: ['warehouse', 'location', 'site', 'plant', 'dc', 'depot', 'entrepot', 'lager', 'werk', 'armazem', 'deposito'],
}

const has = (t: Table, aliases: string[]) => aliases.some((a) => t.headers.includes(normKey(a)))

/* ─────────────────────────── Stats helpers ─────────────────────────── */

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))
const safe = (n: number, d = 0) => (isFinite(n) ? round(n, d) : 0)

function addMonths(k: string, n: number): string {
  const [y, m] = k.split('-').map(Number)
  const t = y * 12 + (m - 1) + n
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`
}
function monthsBetween(a: string, b: string): number {
  const [ya, ma] = a.split('-').map(Number); const [yb, mb] = b.split('-').map(Number)
  return (yb * 12 + mb) - (ya * 12 + ma)
}

/** OLS slope of y on t = 0..n-1, its t-statistic and residuals. */
function slopeT(y: number[]): { slope: number; t: number; resid: number[] } {
  const n = y.length
  const tm = (n - 1) / 2; const ym = mean(y)
  let sxx = 0, sxy = 0
  for (let i = 0; i < n; i++) { sxx += (i - tm) ** 2; sxy += (i - tm) * (y[i] - ym) }
  const slope = sxx ? sxy / sxx : 0
  const resid = y.map((v, i) => v - (ym + slope * (i - tm)))
  const sse = resid.reduce((s, r) => s + r * r, 0)
  const se = n > 2 && sxx ? Math.sqrt(sse / (n - 2) / sxx) : 0
  const t = se > 0 ? slope / se : 0
  return { slope, t, resid }
}

/** Sample autocorrelation at a given lag. */
function acf(x: number[], lag: number): number {
  const n = x.length; if (n <= lag + 2) return 0
  const m = mean(x); let nu = 0, de = 0
  for (let i = 0; i < n; i++) de += (x[i] - m) ** 2
  for (let i = lag; i < n; i++) nu += (x[i] - m) * (x[i - lag] - m)
  return de > 0 ? nu / de : 0
}

type Pattern = 'Stable' | 'Trending' | 'Seasonal' | 'Erratic' | 'Lumpy'

/** Syntetos-Boylan (ADI / CV²) + OLS trend significance + lag-12 seasonality (≥24 months only). */
function classify(series: number[]): { pattern: Pattern; seasonality: string } {
  const n = series.length
  const nz = series.filter((v) => v > 0)
  const adi = nz.length ? n / nz.length : Infinity
  let seasonality = n >= 24 ? 'None detected' : 'n/a (<24 mo)'
  // Intermittent (ADI>1.32, CV²≤0.49) and lumpy (ADI>1.32, CV²>0.49) = sparse demand events
  if (adi > 1.32) return { pattern: 'Lumpy', seasonality }
  const { t, resid } = slopeT(series)
  const trendSig = Math.abs(t) > 2.0
  if (n >= 24) {
    const base = trendSig ? resid : series
    const r12 = acf(base, 12)
    const crit = 2 / Math.sqrt(n) // ~95% band for the sample ACF
    if (r12 > crit && r12 > 0.3) return { pattern: 'Seasonal', seasonality: r12 > 0.6 ? 'Strong' : 'Moderate' }
    if (r12 > crit) seasonality = 'Weak'
  }
  if (trendSig) return { pattern: 'Trending', seasonality }
  const cv2 = cov(nz) ** 2
  return { pattern: cv2 > 0.49 ? 'Erratic' : 'Stable', seasonality }
}

const PLANNING: Record<string, string> = {
  AX: 'Stat. forecast + MRP', AY: 'Forecasting + Safety Stock', AZ: 'Judgmental/Causal (S&OP)',
  BX: 'Stat. forecast + MRP', BY: 'Forecasting + Safety Stock', BZ: 'Croston/SBA + review',
  CX: 'Min-Max / ROP', CY: 'Simple Exponential', CZ: 'Min-Max / make-to-order',
}

const PATTERN_META: Record<Pattern, { color: string; description: string }> = {
  Stable: { color: '#1a9e8f', description: 'Regular, predictable demand' },
  Trending: { color: '#4ab8ae', description: 'Significant growth or decline (OLS |t|>2)' },
  Seasonal: { color: '#EAB308', description: 'Repeating 12-month pattern (needs ≥24 mo)' },
  Erratic: { color: '#F97316', description: 'Frequent demand, high size volatility (CV²>0.49)' },
  Lumpy: { color: '#EF4444', description: 'Sparse / intermittent demand (ADI>1.32)' },
}

const fmtK = (n: number) => {
  const a = Math.abs(n)
  if (a >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (a >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(Math.round(n))
}

/* ─────────────────────────── Main ─────────────────────────── */

type Sku = {
  sku: string; desc: string; family: string; price: number | null
  qty: Map<string, number>; fc: Map<string, number>; value: number; months: Set<string>
}

export function analyzeDemand(tables: Table[]): DemandDataset {
  const hist = findTable(tables.filter((t) => has(t, A.month)), [A.sku, A.month, A.qty], 3)
  if (!hist) {
    const found = Array.from(new Set(tables.flatMap((t) => t.headers))).slice(0, 30).join(', ') || '(none)'
    const all = tables.flatMap((t) => t.headers)
    const miss = ([['item (sku / item / material / product_code)', A.sku], ['period (month / date / period)', A.month], ['quantity (quantity / qty / units / demand / sales)', A.qty]] as [string, string[]][])
      .filter(([, al]) => !al.some((a) => all.includes(normKey(a)))).map(([l]) => l)
    throw new Error(
      'Demand History not recognised. Expected one sheet with an item column, a period column and a quantity column' +
      (miss.length ? ` — missing: ${miss.join('; ')}` : ' in the same sheet') + `. Headers found: ${found}.`,
    )
  }
  const master = tables.find((t) => t !== hist && has(t, A.sku) && !has(t, A.month) &&
    (has(t, A.family) || has(t, A.price) || has(t, A.method) || has(t, A.desc)))

  // ── master data
  const mInfo = new Map<string, { desc?: string; family?: string; price?: number }>()
  const methods: Record<string, number> = {}
  if (master) {
    for (const r of master.rows) {
      const s = pick(r, A.sku); if (s === null) continue
      const p = num(pick(r, A.price))
      const method = pick(r, A.method)
      if (method) { const m = String(method).trim(); methods[m] = (methods[m] || 0) + 1 }
      const d = pick(r, A.desc); const f = pick(r, A.family)
      mInfo.set(String(s).trim(), {
        desc: d !== null ? String(d) : undefined, family: f !== null ? String(f).trim() : undefined,
        price: p !== null && p > 0 ? p : undefined,
      })
    }
  }

  // ── demand history
  const hasFcCol = has(hist, A.fcst)
  const hasValueCol = has(hist, A.value)
  const skus = new Map<string, Sku>()
  const seen = new Set<string>()
  const sites = new Set<string>()
  let currency = ''
  let rowsTotal = 0, blankQty = 0, negQty = 0, badDate = 0, dupRows = 0, fcRows = 0
  let minM = '', maxM = ''

  for (const r of hist.rows as Row[]) {
    rowsTotal++
    const s = pick(r, A.sku); if (s === null) { blankQty++; continue }
    const key = String(s).trim()
    const rawDate = pick(r, A.month)
    const mk = monthKey(rawDate)
    if (!mk) { badDate++; continue }
    const q = num(pick(r, A.qty))
    if (q === null) { blankQty++; continue }
    if (q < 0) negQty++ // returns: flagged in data health, floored at 0 in the monthly series
    const site = pick(r, A.site)
    const sig = `${key}|${rawDate instanceof Date ? rawDate.toISOString() : String(rawDate)}|${q}|${site ?? ''}|${pick(r, A.fcst) ?? ''}`
    if (seen.has(sig)) { dupRows++; continue } // exact duplicate line → dropped
    seen.add(sig)
    if (site !== null) sites.add(String(site))
    const c = pick(r, A.currency); if (!currency && c) currency = String(c).trim().toUpperCase().slice(0, 4)

    let o = skus.get(key)
    if (!o) {
      const mi = mInfo.get(key) || {}
      o = { sku: key, desc: mi.desc ?? '', family: mi.family ?? '', price: mi.price ?? null, qty: new Map(), fc: new Map(), value: 0, months: new Set() }
      skus.set(key, o)
    }
    if (!o.desc) { const d = pick(r, A.desc); if (d !== null) o.desc = String(d) }
    if (!o.family) { const f = pick(r, A.family); if (f !== null) o.family = String(f).trim() }
    if (o.price === null) { const p = num(pick(r, A.price)); if (p !== null && p > 0) o.price = p }
    if (hasValueCol) { const v = num(pick(r, A.value)); if (v !== null) o.value += v }
    o.qty.set(mk, (o.qty.get(mk) || 0) + q)
    o.months.add(mk)
    if (hasFcCol) { const f = num(pick(r, A.fcst)); if (f !== null) { fcRows++; o.fc.set(mk, (o.fc.get(mk) || 0) + f) } }
    if (!minM || mk < minM) minM = mk
    if (!maxM || mk > maxM) maxM = mk
  }

  if (!skus.size || !minM) {
    throw new Error(`Demand History was found (${hist.file} / ${hist.sheet}) but has no usable rows: the period column must contain dates or YYYY-MM and the quantity column must be numeric.`)
  }
  const totalMonths = monthsBetween(minM, maxM) + 1
  if (totalMonths < 6) {
    throw new Error(`Only ${totalMonths} month(s) of demand found (${minM} to ${maxM}). The diagnostic needs at least 6 months, ideally 12–24.`)
  }
  const hasForecast = hasFcCol && fcRows > 0
  const allMonths: string[] = []; for (let i = 0; i < totalMonths; i++) allMonths.push(addMonths(minM, i))
  const last12 = allMonths.slice(-12)
  const last12Set = new Set(last12)

  // ── value basis: explicit value column, else qty × price (history or master)
  const skuList = Array.from(skus.values())
  const pricedShare = skuList.filter((s) => s.price !== null).length / skuList.length
  const hasValue = hasValueCol ? skuList.some((s) => s.value > 0) : pricedShare >= 0.5
  const unitValue = (s: Sku) => {
    if (hasValueCol) { const q = Array.from(s.qty.values()).reduce((a, b) => a + Math.max(0, b), 0); return q > 0 ? Math.max(0, s.value) / q : 0 }
    return s.price ?? 0
  }

  // ── per-SKU analysis
  type Res = {
    s: Sku; histMonths: number; gaps: number; cov: number; pattern: Pattern | null; seasonality: string
    val12: number; qty12: number
    absErr: number; sumA: number; sumErr: number; errs: number[]; evalN: number   // company forecast (or naive if none)
    nAbs: number; nA: number; nErrs: number[]                                      // naive benchmark
  }
  const res: Res[] = []
  const trendAgg = new Map<string, { a: number; f: number }>()
  let pairA = 0, pairNaiveAbs = 0

  for (const s of skuList) {
    const sorted = Array.from(s.months).sort()
    const first = sorted[0]; const lastRec = sorted[sorted.length - 1]
    const span = monthsBetween(first, maxM) + 1
    const series: number[] = []; let gaps = 0
    for (let i = 0; i < span; i++) {
      const k = addMonths(first, i)
      const v = s.qty.get(k)
      if (v === undefined && k < lastRec) gaps++
      series.push(Math.max(0, v ?? 0)) // missing month = zero demand
    }
    const qty12 = last12.reduce((a, k) => a + Math.max(0, s.qty.get(k) || 0), 0)
    const val12 = hasValue ? qty12 * unitValue(s) : qty12
    const r: Res = {
      s, histMonths: span, gaps, cov: cov(series), pattern: null, seasonality: '—', val12, qty12,
      absErr: 0, sumA: 0, sumErr: 0, errs: [], evalN: 0, nAbs: 0, nA: 0, nErrs: [],
    }
    if (span >= 6) {
      const c = classify(series); r.pattern = c.pattern; r.seasonality = c.seasonality
      // One-step-ahead naive benchmark: 3-month moving average, evaluated on the last 12 months
      for (let i = 3; i < span; i++) {
        const k = addMonths(first, i)
        if (!last12Set.has(k)) continue
        const a = series[i]
        const naive = (series[i - 1] + series[i - 2] + series[i - 3]) / 3
        r.nAbs += Math.abs(naive - a); r.nA += a; r.nErrs.push(naive - a)
        let f: number | undefined = naive
        if (hasForecast) { f = s.fc.get(k); if (f === undefined) continue; pairA += a; pairNaiveAbs += Math.abs(naive - a) }
        r.absErr += Math.abs(f - a); r.sumA += a; r.sumErr += f - a; r.errs.push(f - a); r.evalN++
        const t = trendAgg.get(k) || { a: 0, f: 0 }; t.a += a; t.f += f; trendAgg.set(k, t)
      }
    }
    res.push(r)
  }

  // Per-SKU WMAPE capped at 200%; portfolio WMAPE built from capped SKU errors so one tiny SKU cannot dominate
  const skuWmape = (r: Res) => (r.sumA > 0 ? Math.min(200, (r.absErr / r.sumA) * 100) : 200)
  const cappedAbs = (r: Res) => (r.sumA > 0 ? Math.min(r.absErr, 2 * r.sumA) : 0)
  const evaluated = res.filter((r) => r.evalN > 0)
  const totA = evaluated.reduce((a, r) => a + r.sumA, 0)
  const wmape = totA > 0 ? (evaluated.reduce((a, r) => a + cappedAbs(r), 0) / totA) * 100 : 0
  const bias = totA > 0 ? (evaluated.reduce((a, r) => a + r.sumErr, 0) / totA) * 100 : 0
  const naiveA = res.reduce((a, r) => a + r.nA, 0)
  const naiveW = naiveA > 0 ? (res.reduce((a, r) => a + Math.min(r.nAbs, 2 * r.nA), 0) / naiveA) * 100 : 0
  const naiveSame = pairA > 0 ? (pairNaiveAbs / pairA) * 100 : naiveW // naive on the SAME sku-months as the company forecast
  const insufficient = res.filter((r) => r.histMonths < 6)
  const noFcSkus = hasForecast ? res.filter((r) => r.histMonths < 6 || r.s.fc.size === 0) : insufficient

  // ── ABC / XYZ
  const abc = abcClass(res.map((r) => ({ key: r.s.sku, value: r.val12 })))
  const totalVal = res.reduce((a, r) => a + Math.max(0, r.val12), 0)
  const seg: Record<string, { n: number; v: number; covs: number[] }> = {}
  for (const r of res) {
    const k = abc[r.s.sku] + xyzClass(r.cov)
    seg[k] = seg[k] || { n: 0, v: 0, covs: [] }
    seg[k].n++; seg[k].v += Math.max(0, r.val12); seg[k].covs.push(r.cov)
  }
  const DEMAND_SEGMENTATION = ['A', 'B', 'C'].flatMap((a) => ['X', 'Y', 'Z'].map((x) => {
    const c = seg[a + x] || { n: 0, v: 0, covs: [] }
    return { abc: a, xyz: x, skus: c.n, pctRevenue: totalVal > 0 ? safe((c.v / totalVal) * 100, 1) : 0, planning: PLANNING[a + x], cov: safe(mean(c.covs), 2) }
  }))

  // ── patterns
  const pCount: Record<Pattern, number> = { Stable: 0, Trending: 0, Seasonal: 0, Erratic: 0, Lumpy: 0 }
  for (const r of res) if (r.pattern) pCount[r.pattern]++
  const DEMAND_PATTERNS = (Object.keys(pCount) as Pattern[]).map((p) => ({ pattern: p, count: pCount[p], ...PATTERN_META[p] }))

  // ── accuracy by family (top 8 by volume)
  const hasFamily = res.some((r) => r.s.family)
  const famAgg = new Map<string, { abs: number; a: number; skus: number; q: number }>()
  for (const r of res) {
    const f = r.s.family || (hasFamily ? 'Unassigned' : 'All SKUs')
    const g = famAgg.get(f) || { abs: 0, a: 0, skus: 0, q: 0 }
    g.abs += cappedAbs(r); g.a += r.sumA; g.skus++; g.q += r.qty12
    famAgg.set(f, g)
  }
  const FORECAST_BY_FAMILY = Array.from(famAgg.entries())
    .filter(([, g]) => g.a > 0)
    .sort((a, b) => b[1].q - a[1].q).slice(0, 8)
    .map(([family, g]) => ({ family: family.slice(0, 22), mape: safe((g.abs / g.a) * 100), skus: g.skus, demand: safe(g.q / 1000, 1) }))
    .sort((a, b) => a.mape - b.mape)

  // ── monthly trend (last 12 months with evaluated pairs)
  const FORECAST_TREND = last12.filter((k) => trendAgg.has(k)).map((k) => {
    const t = trendAgg.get(k)!
    return { month: monthLabel(k), actual: safe(t.a), forecast: safe(t.f), bias: t.a > 0 ? safe(((t.f - t.a) / t.a) * 100, 1) : 0 }
  })

  // ── worst SKUs (≥3 evaluated months with demand)
  const WORST_FORECAST_SKUS = evaluated.filter((r) => r.evalN >= 3 && r.sumA > 0)
    .sort((a, b) => skuWmape(b) - skuWmape(a) || b.val12 - a.val12).slice(0, 10)
    .map((r) => ({ sku: r.s.sku, desc: r.s.desc || '—', family: r.s.family || '—', mape: safe(skuWmape(r)), demand: r.pattern || '—', seasonality: r.seasonality }))

  // ── data health (real checks)
  const skusWithGaps = res.filter((r) => r.gaps > 0).length
  const pctInsuf = insufficient.length / res.length
  const pctGaps = skusWithGaps / res.length
  const badRows = blankQty + badDate + dupRows + negQty
  const pctBad = rowsTotal ? badRows / rowsTotal : 0
  const validRows = Math.max(1, rowsTotal - blankQty - badDate - dupRows)
  const fcCoverage = hasForecast ? Math.min(1, fcRows / validRows) : 0
  const famShare = res.filter((r) => r.s.family).length / res.length
  const dims = [
    { name: 'Demand History', score: safe(clamp((totalMonths / 24) * 100)), detail: `${totalMonths} months of demand (${monthLabel(minM)} – ${monthLabel(maxM)}); 24+ months needed to test seasonality` },
    { name: 'Completeness', score: safe(clamp(100 * (1 - 0.5 * pctInsuf - 0.5 * pctGaps))), detail: `${insufficient.length} SKUs (${safe(pctInsuf * 100)}%) have < 6 months of history; ${skusWithGaps} SKUs have missing months (treated as zero demand)` },
    { name: 'Accuracy', score: safe(clamp(100 - pctBad * 300)), detail: `${blankQty} blank/non-numeric quantities, ${badDate} unreadable dates, ${negQty} negative quantities (returns), ${dupRows} exact duplicate lines removed — out of ${rowsTotal} lines` },
    { name: 'Forecast Records', score: hasForecast ? safe(clamp(fcCoverage * 100)) : 20, detail: hasForecast ? `Forecast provided on ${safe(fcCoverage * 100)}% of demand lines` : 'No forecast column provided — error measured against a naive 3-month moving average' },
    { name: 'Attributes', score: safe(clamp(50 * famShare + (hasValue ? 50 : 0))), detail: `${safe(famShare * 100)}% of SKUs have a product family; ${hasValue ? 'price/value data available' : 'no price/cost data — financial impact cannot be estimated'}` },
  ]
  const overall = safe(mean(dims.map((d) => d.score)))

  const topMethod = Object.entries(methods).sort((a, b) => b[1] - a[1])[0]
  const HEALTH_METRICS = {
    mapeActual: safe(wmape),
    mapeBenchmark: safe(hasForecast ? naiveSame : naiveW),
    forecastBias: safe(bias, 1),
    demandVolatility: safe(mean(res.filter((r) => r.histMonths >= 6).map((r) => r.cov)), 2),
    skusNoForecast: noFcSkus.length,
    totalSkus: res.length,
    avgForecastHorizon: 1,
    dataCompleteness: dims[1].score,
    forecastingMethod: topMethod ? `${topMethod[0]} (most common)` : 'Not provided',
  }

  // ── financial estimates (value data only). Safety-stock proxy: 1.65 · RMSE(error) · unit value, 1-month lead time.
  const ssValue = (r: Res) => {
    const e = r.errs.length >= 2 ? r.errs : r.nErrs
    if (e.length < 2) return 0
    return 1.65 * Math.sqrt(e.reduce((a, x) => a + x * x, 0) / e.length) * unitValue(r.s)
  }
  const SS = hasValue ? res.reduce((a, r) => a + ssValue(r), 0) : 0
  const monthlyValue = hasValue ? totalVal / Math.min(12, totalMonths) : 0
  const imp = (n: number) => (hasValue && isFinite(n) && n > 0 ? fmtK(n) : '0')
  const needCost = ' Financial impact needs unit cost/price data (add unit_cost to the SKU Master).'
  const cur = currency ? `${currency} ` : ''
  const errName = hasForecast ? 'forecast error (WMAPE)' : 'naive-forecast error (no forecast provided)'

  const recs: DemandDataset['RECOMMENDATIONS'] = []
  const erraticLumpy = pCount.Erratic + pCount.Lumpy
  const classified = res.filter((r) => r.pattern).length || 1
  const azBz = (seg.AZ?.n || 0) + (seg.BZ?.n || 0)

  if (!hasForecast) {
    recs.push({
      id: 0, priority: 'CRITICAL', title: 'Put a measured forecast of record in place', impact: '0',
      description: `No forecast column was provided, so accuracy could only be benchmarked with a naive 3-month moving average (WMAPE ${safe(naiveW)}%, bias ${bias > 0 ? '+' : ''}${safe(bias, 1)}%). Without a stored forecast per SKU and month, planning cannot be measured, governed or improved. Log the forecast used each month and track WMAPE and bias by family. Enabling action — not quantified.`,
      timeline: '2-3 weeks', practice: 'Planning KPI Dashboard', effort: 'Low',
    })
  } else if (wmape > naiveSame + 2) {
    recs.push({
      id: 0, priority: 'CRITICAL', title: 'Current forecast is worse than a naive benchmark', impact: imp(SS * 0.2),
      description: `Your forecast has a WMAPE of ${safe(wmape)}% vs ${safe(naiveSame)}% for a simple 3-month moving average on the same SKU-months (negative Forecast Value Added). Review manual overrides and model selection per segment.` +
        (hasValue ? ` Estimate: 20% lower error on a safety-stock base of ${cur}${fmtK(SS)} (1.65σ, 1-month lead time) = one-off working-capital release.` : needCost),
      timeline: '4-6 weeks', practice: 'Demand & Forecast Optimization', effort: 'Medium',
    })
  }

  recs.push({
    id: 0, priority: wmape > 50 ? 'CRITICAL' : 'HIGH', title: 'Implement segment-specific forecasting methods', impact: imp(SS * 0.15),
    description: `${res.length} SKUs split into 9 ABC/XYZ segments (A-X: ${seg.AX?.n || 0}, A-Z: ${seg.AZ?.n || 0}, C-Z: ${seg.CZ?.n || 0}). Current ${errName} is ${safe(wmape)}%. Matching the method to the segment (statistical models for X/Y, Croston/SBA or judgmental for Z, min-max for C) typically lowers error by 10-20%.` +
      (hasValue ? ` Estimate: 15% error reduction on a safety-stock base of ${cur}${fmtK(SS)} = one-off working-capital release.` : needCost),
    timeline: '6-8 weeks', practice: 'Demand & Forecast Optimization', effort: 'High',
  })

  if (Math.abs(bias) >= 5) {
    const over = bias > 0
    recs.push({
      id: 0, priority: Math.abs(bias) >= 10 ? 'CRITICAL' : 'HIGH', title: over ? 'Correct systematic over-forecasting' : 'Correct systematic under-forecasting',
      impact: imp((Math.abs(bias) / 100) * monthlyValue),
      description: `Aggregate ${hasForecast ? 'forecast' : 'naive-forecast'} bias is ${over ? '+' : ''}${safe(bias, 1)}% (${over ? 'over' : 'under'}-forecast). ${over ? 'Persistent over-forecasting builds excess stock and markdowns.' : 'Persistent under-forecasting drives stockouts and expediting.'} Introduce monthly bias tracking with a tolerance band and root-cause review.` +
        (hasValue ? ` Estimate: |bias| × average monthly demand value (${cur}${fmtK(monthlyValue)}) = ${over ? 'excess inventory' : 'demand exposure'} per planning cycle.` : needCost),
      timeline: '4-6 weeks', practice: 'Demand Planning Center of Excellence', effort: 'Medium',
    })
  }

  if (erraticLumpy / classified >= 0.2 || azBz >= 5) {
    const elSS = hasValue ? res.filter((r) => r.pattern === 'Erratic' || r.pattern === 'Lumpy').reduce((a, r) => a + ssValue(r), 0) : 0
    recs.push({
      id: 0, priority: 'HIGH', title: 'Dedicated approach for erratic and intermittent SKUs', impact: imp(elSS * 0.25),
      description: `${erraticLumpy} of ${classified} classified SKUs (${safe((erraticLumpy / classified) * 100)}%) are erratic or lumpy (Syntetos-Boylan ADI/CV²). Moving averages perform poorly here: use Croston/SBA, demand-driven buffers or make-to-order, and review A/B-Z items (${azBz}) in S&OP.` +
        (hasValue ? ` Estimate: 25% lower safety stock on these SKUs (base ${cur}${fmtK(elSS)}).` : needCost),
      timeline: '8-10 weeks', practice: 'Advanced Analytics & AI', effort: 'High',
    })
  }

  if (insufficient.length > 0 || pctGaps > 0.1 || famShare < 0.8) {
    recs.push({
      id: 0, priority: pctInsuf > 0.15 ? 'HIGH' : 'MEDIUM', title: 'Clean and enrich demand master data', impact: '0',
      description: `${insufficient.length} SKUs have < 6 months of history (no statistical forecast possible), ${skusWithGaps} SKUs have missing months and ${safe((1 - famShare) * 100)}% of SKUs have no product family. Use analog SKUs for new items, flag promotions/stockouts and complete the product hierarchy. Enabling action — not quantified.`,
      timeline: '3-4 weeks', practice: 'Data & Governance', effort: 'Medium',
    })
  }

  if (hasForecast) {
    const worstFam = FORECAST_BY_FAMILY[FORECAST_BY_FAMILY.length - 1]
    recs.push({
      id: 0, priority: 'MEDIUM', title: 'Establish forecast governance and review cadence', impact: '0',
      description: `Track WMAPE and bias monthly by family (worst today: ${worstFam ? `${worstFam.family} at ${worstFam.mape}%` : '—'}), measure Forecast Value Added against the naive benchmark and hold a monthly demand review. Enabling action — not quantified.`,
      timeline: '2-3 weeks', practice: 'Planning KPI Dashboard', effort: 'Low',
    })
  }

  const parseImp = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n * (/M$/.test(s) ? 1e6 : /K$/.test(s) ? 1e3 : 1) : 0 }
  const pr: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
  const RECOMMENDATIONS = recs
    .sort((a, b) => pr[a.priority] - pr[b.priority] || parseImp(b.impact) - parseImp(a.impact))
    .map((r, i) => ({ ...r, id: i + 1 }))

  return {
    COMPANY: { name: 'Your company', currency, skuCount: res.length, warehouseCount: sites.size },
    FORECAST_BY_FAMILY, FORECAST_TREND, DEMAND_SEGMENTATION, WORST_FORECAST_SKUS, DEMAND_PATTERNS,
    HEALTH_METRICS, DATA_HEALTH: { overall, dimensions: dims }, RECOMMENDATIONS,
    META: {
      isDemo: false, hasForecast, hasValue,
      periodLabel: `History: ${totalMonths} months (${monthLabel(minM)} – ${monthLabel(maxM)})`,
      accuracyLabel: hasForecast ? 'Forecast Error (WMAPE)' : 'Naive-Forecast Error (no forecast provided)',
      benchmarkLabel: hasForecast ? `Naive 3-mo moving avg: ${safe(naiveSame)}%` : 'Naive 3-month moving average, 1 step ahead',
      biasLabel: bias >= 0 ? 'Over-forecast (aggregate)' : 'Under-forecast (aggregate)',
      noForecastLabel: hasForecast ? '< 6 months history or no forecast' : '< 6 months history',
      volumeLabel: 'Volume (units)',
      trendTitle: `${FORECAST_TREND.length}-Month ${hasForecast ? 'Forecast' : 'Naive-Forecast'} Bias Trend`,
      trendSubtitle: hasForecast ? 'Actual demand vs your forecast — positive = over-forecast' : 'No forecast provided: actual vs naive 3-month moving average — positive = over-forecast',
      worstTitle: `Top ${WORST_FORECAST_SKUS.length} Worst ${hasForecast ? 'Forecast' : 'Naive-Forecast'} Accuracy SKUs (WMAPE, capped 200%)`,
      roadmap: [
        ['Profile demand patterns and segments by family', `Fix demand history gaps (${insufficient.length + skusWithGaps} SKUs)`, 'Implement monthly forecast bias monitoring'],
        ['Deploy segment-specific forecasting methods', `Intermittent-demand methods for ${erraticLumpy} erratic/lumpy SKUs`, hasForecast ? 'Measure Forecast Value Added vs naive benchmark' : 'Start storing a forecast of record per SKU-month'],
        ['Establish demand review dashboard', 'Implement forecast governance process', 'Train planning team and go-live with new methods'],
      ],
      notes: [
        'Missing months between an SKU’s first record and the end of the dataset are treated as zero demand.',
        'Patterns: Syntetos-Boylan ADI/CV² (intermittent and lumpy both shown as Lumpy), OLS trend |t|>2, seasonal only with ≥24 months via lag-12 autocorrelation.',
        hasValue ? 'Financial estimates use a safety-stock proxy (1.65 × RMSE of error × unit value, 1-month lead time) and are directional.' : 'No price/cost data provided: financial impact is not estimated.',
      ],
    },
  }
}
