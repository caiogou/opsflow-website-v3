/* Inventory & Working Capital Diagnostic engine.
   Pure functions: parsed tables (lib/engine/io) -> dataset rendered by app/platform/inventory.
   Method (per SKU, aggregated across locations):
     - monthly demand from consumption history (zero-filled over the last <=12 months of history)
     - avg monthly demand D, sigma_monthly, CoV -> XYZ (<=0.5 X, <=1 Y, else Z; no demand -> Z)
     - annual consumption value (D x 12 x unit cost) -> ABC (80/15/5 cumulative)
     - SS = z(service level) x sigma_monthly x sqrt(LT/30); ROP = D x LT/30 + SS
     - order-up-to = SS + D x LT/30 + D x R (review period R = 1 month); excess = on hand above it, at cost
     - no movement = zero demand in the last 3 history months or last movement > 90 days -> obsolete risk
     - turns = annual COGS / inventory value; DOS = inventory value / daily COGS */
import { findTable, pick, num, monthKey, monthLabel, mean, std, round, abcClass, xyzClass, normKey, type Table, type Row } from './io'

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type InventoryDataset = {
  isDemo: boolean
  COMPANY: { name: string; currency: string; skuCount: number; warehouseCount: number }
  ABC_XYZ_MATRIX: { abc: string; xyz: string; skus: number; pctRevenue: number; pctInventory: number; avgDOS: number; label: string }[]
  HEALTH_METRICS: {
    totalInventoryValue: number; excessInventoryValue: number; obsoleteRisk: number; stockoutCostMonthly: number
    avgDaysOfSupply: number; targetDaysOfSupply: number; inventoryTurns: number; benchmarkTurns: number
    serviceLevel: number; targetServiceLevel: number; workingCapitalTiedUp: number; potentialRelease: number
    safetyStockAccuracy: number; forecastAccuracy: number; skusWithNoMovement90d: number; skusOverstocked: number; skusUnderstocked: number
    serviceLevelAvailable: boolean; safetyStockAccuracyAvailable: boolean
    benchmarkLabel: string; stockoutLabel: string; stockoutSub: string; serviceLevelNote: string; safetyStockNote: string
  }
  MONTHLY_TREND: Record<string, string | number>[]
  TREND: { title: string; subtitle: string; series: { key: string; name: string; color: string; axis: 'left' | 'right'; dashed?: boolean }[]; rightDomain?: [number, number] }
  TOP_EXCESS: { sku: string; desc: string; value: number; dos: number; segment: string }[]
  TOP_STOCKOUT: { sku: string; desc: string; missedRevenue: number; daysOut: number; segment: string }[]
  STOCKOUT_LABELS: { title: string; daysSuffix: string }
  DATA_HEALTH: { overall: number; dimensions: { name: string; score: number; detail: string }[] }
  HEALTH_NOTE: string
  RECOMMENDATIONS: { id: number; priority: Priority; title: string; impact: string; description: string; timeline: string; practice: string; effort: string; countInTotal?: boolean }[]
  ABC_DATA: { name: string; skus: number; revenue: number; inventory: number; color: string }[]
  DOS_DISTRIBUTION: { range: string; skus: number; color: string }[]
  DOS_SUBTITLE: string
  ROADMAP: { phase: string; title: string; color: string; items: string[] }[]
  CTA: { showInvestment: boolean; impactPhrase: string }
  NOTES: string[]
}

/* ─── Aliases (headers are normalised to snake_case, accents stripped) ─── */
const A = {
  sku: ['sku', 'sku_code', 'item', 'item_code', 'item_no', 'item_number', 'item_id', 'material', 'material_number', 'material_no', 'article', 'article_number', 'article_no', 'product_code', 'product_id', 'part_number', 'part_no', 'reference', 'ref', 'code', 'code_article', 'artikel', 'artikelnummer', 'artikelnr', 'materialnummer', 'codigo', 'codigo_produto', 'cod_produto'],
  desc: ['description', 'desc', 'item_description', 'material_description', 'article_description', 'product_name', 'product', 'name', 'designation', 'libelle', 'bezeichnung', 'beschreibung', 'artikelbezeichnung', 'descricao', 'nome', 'produto'],
  onHand: ['on_hand_qty', 'on_hand', 'qty_on_hand', 'on_hand_quantity', 'quantity_on_hand', 'stock_qty', 'stock_quantity', 'current_stock', 'inventory_qty', 'available_qty', 'stock', 'quantite_en_stock', 'stock_disponible', 'qte_stock', 'bestand', 'lagerbestand', 'bestandsmenge', 'estoque', 'saldo', 'qtd_estoque', 'quantidade_estoque', 'qty', 'quantity', 'quantite', 'menge', 'quantidade'],
  cost: ['unit_cost', 'cost', 'standard_cost', 'std_cost', 'cost_price', 'avg_cost', 'average_cost', 'moving_average_price', 'cout_unitaire', 'cout', 'cout_standard', 'prix_de_revient', 'stuckkosten', 'stueckkosten', 'einstandspreis', 'standardpreis', 'custo_unitario', 'custo', 'custo_medio', 'preco_custo', 'unit_price', 'price', 'prix_unitaire', 'preis', 'preco_unitario'],
  stockValue: ['stock_value', 'inventory_value', 'total_value', 'value', 'valeur_stock', 'valeur', 'bestandswert', 'lagerwert', 'wert', 'valor_estoque', 'valor'],
  location: ['location', 'warehouse', 'site', 'plant', 'depot', 'store', 'entrepot', 'magasin', 'lager', 'lagerort', 'werk', 'armazem', 'deposito', 'local', 'filial'],
  family: ['family', 'product_family', 'category', 'product_group', 'group', 'famille', 'categorie', 'warengruppe', 'kategorie', 'produktgruppe', 'familia', 'categoria', 'grupo'],
  lt: ['lead_time_days', 'lead_time', 'leadtime', 'lt_days', 'lt', 'replenishment_lead_time', 'delai', 'delai_appro', 'delai_approvisionnement', 'delai_livraison', 'lieferzeit', 'wiederbeschaffungszeit', 'prazo', 'prazo_entrega', 'lead_time_dias'],
  ss: ['safety_stock', 'ss', 'safety_stock_qty', 'stock_securite', 'stock_de_securite', 'sicherheitsbestand', 'estoque_seguranca', 'estoque_de_seguranca'],
  sl: ['target_service_level', 'service_level', 'service_level_target', 'niveau_de_service', 'taux_de_service', 'servicegrad', 'lieferbereitschaft', 'nivel_servico', 'nivel_de_servico'],
  lastMove: ['last_movement_date', 'last_movement', 'last_issue_date', 'last_sale_date', 'last_transaction_date', 'last_consumption_date', 'date_dernier_mouvement', 'dernier_mouvement', 'letzte_bewegung', 'letzter_abgang', 'letzte_bewegung_datum', 'ultima_movimentacao', 'data_ultima_movimentacao', 'ultimo_movimento'],
  period: ['month', 'period', 'year_month', 'yearmonth', 'date', 'posting_date', 'transaction_date', 'movement_date', 'mois', 'periode', 'date_mouvement', 'monat', 'periode_monat', 'datum', 'buchungsdatum', 'mes', 'competencia', 'data', 'data_movimento'],
  year: ['year', 'annee', 'jahr', 'ano'],
  qty: ['quantity_issued', 'qty_issued', 'issued_qty', 'quantity_sold', 'qty_sold', 'sales_qty', 'shipped_qty', 'qty_shipped', 'consumption', 'consumption_qty', 'demand', 'demand_qty', 'usage', 'units', 'quantite_sortie', 'quantite_vendue', 'consommation', 'sortie', 'sorties', 'verbrauch', 'absatz', 'abgang', 'absatzmenge', 'consumo', 'vendas', 'quantidade_vendida', 'saida', 'quantity', 'qty', 'quantite', 'menge', 'quantidade', 'qtd'],
  ordered: ['quantity_ordered', 'qty_ordered', 'ordered_qty', 'order_qty', 'requested_qty', 'quantity_requested', 'quantite_commandee', 'bestellmenge', 'auftragsmenge', 'quantidade_pedida'],
  price: ['unit_price', 'price', 'selling_price', 'sales_price', 'prix', 'prix_vente', 'prix_unitaire', 'verkaufspreis', 'preis', 'preco', 'preco_venda', 'preco_unitario'],
}

/* CSV files saved by Excel without a UTF-8 BOM are decoded as Latin-1 by SheetJS, so accented headers
   arrive as mojibake ("StÃ¼ckkosten" -> "sta_ckkosten"). Add those variants for accented aliases. */
const moji = (x: string) => { try { return normKey(unescape(encodeURIComponent(x))) } catch { return normKey(x) } }
const ACCENTED: Partial<Record<keyof typeof A, string[]>> = {
  desc: ['Désignation', 'Libellé', 'Descrição'],
  onHand: ['Quantité en stock', 'Quantité', 'Stock disponible', 'Qté stock', 'Bestandsmenge'],
  cost: ['Stückkosten', 'Coût unitaire', 'Coût', 'Coût standard', 'Custo unitário', 'Custo médio', 'Preço custo', 'Preço unitário'],
  stockValue: ['Valeur stock'],
  location: ['Entrepôt', 'Armazém', 'Depósito'],
  family: ['Catégorie', 'Família', 'Categoria'],
  lt: ['Délai', 'Délai appro', 'Délai approvisionnement', 'Délai livraison', 'Prazo entrega'],
  ss: ['Stock de sécurité', 'Estoque de segurança'],
  sl: ['Niveau de service', 'Nível de serviço', 'Nível serviço'],
  lastMove: ['Date dernier mouvement', 'Dernier mouvement', 'Última movimentação', 'Data última movimentação', 'Último movimento'],
  period: ['Période', 'Mês', 'Competência'],
  year: ['Année', 'Ano'],
  qty: ['Quantité sortie', 'Quantité vendue', 'Quantité', 'Saída'],
  ordered: ['Quantité commandée'],
  price: ['Prix unitaire', 'Preço', 'Preço venda', 'Preço unitário'],
}
for (const k of Object.keys(ACCENTED) as (keyof typeof A)[]) for (const x of ACCENTED[k]!) { const m = moji(x); if (!A[k].includes(m)) A[k].push(m) }

const has = (t: Table, al: string[]) => al.some((a) => t.headers.includes(normKey(a)))
const firstHeader = (t: Table, al: string[]) => al.map(normKey).find((a) => t.headers.includes(a)) || null

/* ─── Inverse standard normal (Acklam's rational approximation, |err| < 1.2e-9) ─── */
export function normInv(p: number): number {
  const q0 = Math.min(Math.max(p, 1e-9), 1 - 1e-9)
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239]
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572]
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416]
  const pl = 0.02425
  if (q0 < pl) { const q = Math.sqrt(-2 * Math.log(q0)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1) }
  if (q0 > 1 - pl) { const q = Math.sqrt(-2 * Math.log(1 - q0)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1) }
  const q = q0 - 0.5, r = q * q
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
}

function parseDate(v: any): Date | null {
  if (v === null || v === undefined || v === '') return null
  if (v instanceof Date) return isNaN(+v) ? null : v
  if (typeof v === 'number') { if (v > 20000 && v < 80000) return new Date(Math.round((v - 25569) * 86400000)); return null }
  const s = String(v).trim()
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/); if (m) return new Date(+m[1], +m[2] - 1, +m[3])
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/); if (m) return new Date(+m[3], +m[2] - 1, +m[1])
  const d = new Date(s); return isNaN(+d) ? null : d
}
const addMonths = (k: string, n: number) => { const [y, m] = k.split('-').map(Number); const t = y * 12 + (m - 1) + n; return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}` }
const monthsBetween = (a: string, b: string) => { const [ya, ma] = a.split('-').map(Number); const [yb, mb] = b.split('-').map(Number); return (yb - ya) * 12 + (mb - ma) }
const fin = (n: number, d = 0) => (isFinite(n) ? round(n, d) : 0)
const pct = (a: number, b: number, d = 1) => (b > 0 ? fin((a / b) * 100, d) : 0)
export const fmtK = (n: number) => { const v = Math.max(0, isFinite(n) ? n : 0); if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`; if (v >= 1_000) return `${Math.round(v / 1_000)}K`; return String(Math.round(v)) }
const clampScore = (n: number) => Math.max(0, Math.min(100, Math.round(isFinite(n) ? n : 0)))

type Sku = {
  sku: string; desc: string; onHand: number; value: number; cost: number; locations: Set<string>; family: string
  lt: number | null; ssGiven: number | null; sl: number | null; lastMove: Date | null; inStock: boolean; inHist: boolean
  monthly: Record<string, number>; ordered: number; issuedVsOrdered: number; priceSum: number; priceQty: number
  // computed
  D: number; sigma: number; cov: number; abc: 'A' | 'B' | 'C'; xyz: 'X' | 'Y' | 'Z'; annualValue: number; ss: number; rop: number
  upTo: number; excessQty: number; excessValue: number; dos: number; noMove: boolean; under: boolean; price: number; ltUsed: number; slUsed: number
}

export function analyzeInventory(tables: Table[]): InventoryDataset {
  /* ── locate tables ── */
  const histCandidates = tables.filter((t) => has(t, A.sku) && has(t, A.period) && has(t, A.qty))
  // prefer tables that do NOT look like a stock snapshot (no cost column), then more rows
  const hist = histCandidates.sort((x, y) => (Number(has(x, A.cost) && has(x, A.onHand) && !has(x, A.period)) - Number(has(y, A.cost) && has(y, A.onHand) && !has(y, A.period))) || y.rows.length - x.rows.length)[0]
  const stock = tables.filter((t) => t !== hist && has(t, A.sku) && has(t, A.onHand) && (has(t, A.cost) || has(t, A.stockValue)))
    .sort((x, y) => Number(has(x, A.period)) - Number(has(y, A.period)))[0]
    || findTable(tables.filter((t) => t !== hist), [A.sku, A.onHand, A.cost], 3)
  if (!stock || !hist) {
    const found = tables.map((t) => `${t.file}${t.sheet ? ' / ' + t.sheet : ''}: ${t.headers.slice(0, 12).join(', ')}`).join(' | ')
    const miss: string[] = []
    if (!stock) miss.push('a STOCK ON HAND table with columns sku, on_hand_qty, unit_cost')
    if (!hist) miss.push('a CONSUMPTION HISTORY table with columns sku, month (or date), quantity')
    throw new Error(`We could not find ${miss.join(' and ')}. Columns found — ${found || 'none'}. Please use the templates (both files are required).`)
  }

  const notes: string[] = []
  const skus = new Map<string, Sku>()
  const get = (code: string): Sku => {
    let s = skus.get(code)
    if (!s) {
      s = { sku: code, desc: '', onHand: 0, value: 0, cost: 0, locations: new Set(), family: '', lt: null, ssGiven: null, sl: null, lastMove: null, inStock: false, inHist: false,
        monthly: {}, ordered: 0, issuedVsOrdered: 0, priceSum: 0, priceQty: 0, D: 0, sigma: 0, cov: 0, abc: 'C', xyz: 'Z', annualValue: 0, ss: 0, rop: 0, upTo: 0,
        excessQty: 0, excessValue: 0, dos: 0, noMove: false, under: false, price: 0, ltUsed: 30, slUsed: 0.95 }
      skus.set(code, s)
    }
    return s
  }

  /* ── stock snapshot ── */
  let stockRows = 0, badStockRows = 0, negStock = 0, missingCostRows = 0
  const locs = new Set<string>()
  const hasLoc = has(stock, A.location), hasLT = has(stock, A.lt), hasSS = has(stock, A.ss), hasSL = has(stock, A.sl), hasLM = has(stock, A.lastMove)
  for (const r of stock.rows) {
    const code = pick(r, A.sku); if (code === null) continue
    stockRows++
    const s = get(String(code).trim()); s.inStock = true
    let q = num(pick(r, A.onHand)); if (q === null) { badStockRows++; q = 0 }
    if (q < 0) { negStock++; q = 0 }
    let c = num(pick(r, A.cost))
    if ((c === null || c <= 0) && q > 0) { const v = num(pick(r, A.stockValue)); if (v !== null && v > 0) c = v / q }
    if (c === null || c < 0) { missingCostRows++; c = 0 }
    s.onHand += q; s.value += q * c
    if (c > 0) s.cost = s.onHand > 0 ? s.value / s.onHand : c
    if (!s.desc) s.desc = String(pick(r, A.desc) ?? '').trim()
    if (!s.family) s.family = String(pick(r, A.family) ?? '').trim()
    const loc = pick(r, A.location); if (loc !== null) { s.locations.add(String(loc)); locs.add(String(loc)) }
    const lt = num(pick(r, A.lt)); if (lt !== null && lt > 0) s.lt = Math.max(s.lt ?? 0, lt)
    const ss = num(pick(r, A.ss)); if (ss !== null && ss >= 0) s.ssGiven = (s.ssGiven ?? 0) + ss
    let sl = num(pick(r, A.sl)); if (sl !== null && sl > 0) { if (sl > 1) sl = sl / 100; if (sl > 0.5 && sl < 1) s.sl = sl }
    const lm = parseDate(pick(r, A.lastMove)); if (lm && (!s.lastMove || lm > s.lastMove)) s.lastMove = lm
  }

  /* ── consumption history ── */
  const periodCol = firstHeader(hist, A.period)!
  const yearCol = firstHeader(hist, A.year)
  let histRows = 0, badHistRows = 0, dailyDates = 0, negQty = 0
  const hasOrdered = has(hist, A.ordered), hasPrice = has(hist, A.price) && firstHeader(hist, A.price) !== firstHeader(hist, A.qty)
  const allMonths = new Set<string>()
  for (const r of hist.rows) {
    const code = pick(r, A.sku); if (code === null) continue
    histRows++
    const raw = r[periodCol]
    let mk: string | null = null
    const pn = num(raw)
    if (yearCol && pn !== null && pn >= 1 && pn <= 12 && typeof raw !== 'object') { const y = num(r[yearCol]); if (y) mk = `${y}-${String(pn).padStart(2, '0')}` }
    if (!mk) mk = monthKey(raw)
    const q = num(pick(r, A.qty))
    if (!mk || q === null) { badHistRows++; continue }
    // transaction-level if the period carries a day other than the 1st (SheetJS turns '2025-09' into a Date on the 1st)
    const dd = raw instanceof Date ? raw : typeof raw === 'string' && /\d[-/.]\d{1,2}[-/.]\d/.test(raw) ? parseDate(raw) : null
    if (dd && dd.getDate() !== 1) dailyDates++
    if (q < 0) negQty++
    const s = get(String(code).trim()); s.inHist = true
    s.monthly[mk] = (s.monthly[mk] || 0) + q
    allMonths.add(mk)
    if (hasOrdered) { const o = num(pick(r, A.ordered)); if (o !== null && o > 0) { s.ordered += o; s.issuedVsOrdered += Math.min(Math.max(q, 0), o) } }
    if (hasPrice) { const p = num(pick(r, A.price)); if (p !== null && p > 0 && q > 0) { s.priceSum += p * q; s.priceQty += q } }
  }
  if (!allMonths.size) throw new Error(`The consumption history (${hist.file}) has no rows with a readable month/date and quantity. Expected columns: sku, month (YYYY-MM or a date), quantity.`)
  if (skus.size === 0) throw new Error('No SKU codes were found in the uploaded files.')

  const sortedMonths = [...allMonths].sort()
  const firstM = sortedMonths[0], lastM = sortedMonths[sortedMonths.length - 1]
  const spanAll = monthsBetween(firstM, lastM) + 1
  const statMonths: string[] = []; for (let i = Math.min(12, spanAll) - 1; i >= 0; i--) statMonths.push(addMonths(lastM, -i))
  const nM = statMonths.length
  const last3 = statMonths.slice(-3)
  const [ly, lmn] = lastM.split('-').map(Number)
  const refDate = new Date(ly, lmn, 0) // end of last history month
  if (nM < 6) notes.push(`Only ${nM} month(s) of history: variability (XYZ, safety stock) is indicative only — 12+ months recommended.`)

  /* ── per-SKU calculations ── */
  const ltGiven = [...skus.values()].map((s) => s.lt).filter((x): x is number => x !== null).sort((a, b) => a - b)
  const ltDefault = ltGiven.length ? ltGiven[Math.floor(ltGiven.length / 2)] : 30
  const R = 1 // review period (months)
  const list = [...skus.values()]
  for (const s of list) {
    const series = statMonths.map((m) => Math.max(0, s.monthly[m] || 0))
    s.D = mean(series); s.sigma = std(series)
    s.cov = s.D > 0 ? s.sigma / s.D : 0
    s.xyz = s.D > 0 ? xyzClass(s.cov) : 'Z'
    if (s.cost <= 0 && s.priceQty > 0) s.cost = 0 // cost unknown: keep 0 (never value inventory at selling price)
    s.price = s.priceQty > 0 ? s.priceSum / s.priceQty : s.cost
    s.annualValue = s.D * 12 * s.cost
    s.ltUsed = s.lt ?? ltDefault
    s.slUsed = s.sl ?? 0.95
    const z = normInv(s.slUsed)
    s.ss = z * s.sigma * Math.sqrt(s.ltUsed / 30)
    const dLT = s.D * (s.ltUsed / 30)
    s.rop = dLT + s.ss
    s.upTo = s.ss + dLT + s.D * R
    const dailyD = (s.D * 12) / 365
    s.dos = dailyD > 0 ? Math.min(999, s.onHand / dailyD) : s.onHand > 0 ? 999 : 0
    const zeroRecent = last3.every((m) => (s.monthly[m] || 0) <= 0)
    const staleDate = s.lastMove ? (+refDate - +s.lastMove) / 86400000 > 90 : false
    s.noMove = s.onHand > 0 && (zeroRecent || staleDate)
    s.excessQty = Math.max(0, s.onHand - s.upTo)
    s.excessValue = s.excessQty * s.cost
    s.under = s.D > 0 && s.onHand < s.ss
  }
  const abc = abcClass(list.map((s) => ({ key: s.sku, value: s.annualValue })))
  for (const s of list) s.abc = s.annualValue > 0 ? abc[s.sku] : 'C'

  /* ── aggregates ── */
  const sum = (f: (s: Sku) => number, arr = list) => arr.reduce((a, s) => a + (isFinite(f(s)) ? f(s) : 0), 0)
  const invValue = sum((s) => s.value)
  const annualCOGS = sum((s) => s.annualValue)
  const dailyCOGS = annualCOGS / 365
  const turns = invValue > 0 ? annualCOGS / invValue : 0
  const avgDOS = dailyCOGS > 0 ? invValue / dailyCOGS : invValue > 0 ? 999 : 0
  const targetAvgInv = sum((s) => (s.ss + (s.D * R) / 2) * s.cost)
  const targetDOS = dailyCOGS > 0 ? targetAvgInv / dailyCOGS : 0
  const targetTurns = targetAvgInv > 0 ? annualCOGS / targetAvgInv : 0
  const obsolete = list.filter((s) => s.noMove)
  const obsoleteValue = sum((s) => s.value, obsolete)
  const excessValue = sum((s) => s.excessValue)
  const excessNonObs = sum((s) => s.excessValue, list.filter((s) => !s.noMove))
  const OBS_RECOVERY = 0.5
  const potentialRelease = excessNonObs + OBS_RECOVERY * obsoleteValue
  const over = list.filter((s) => s.excessQty > 0 && s.onHand > 0)
  const under = list.filter((s) => s.under)
  const atRiskMonthly = sum((s) => s.D * s.price, under)
  const totalOrdered = sum((s) => s.ordered), totalFilled = sum((s) => s.issuedVsOrdered)
  const slAvailable = hasOrdered && totalOrdered > 0
  const serviceLevel = slAvailable ? fin((totalFilled / totalOrdered) * 100, 1) : 0
  const ssGivenSkus = list.filter((s) => s.ssGiven !== null && s.D > 0)
  const ssAccAvailable = ssGivenSkus.length > 0
  const ssAcc = ssAccAvailable ? pct(ssGivenSkus.filter((s) => { const g = s.ssGiven as number; return s.ss === 0 ? g === 0 : Math.abs(g - s.ss) / s.ss <= 0.25 }).length, ssGivenSkus.length, 0) : 0
  const targetSL = fin(mean(list.map((s) => s.slUsed)) * 100, 1)
  const withDemand = list.filter((s) => s.D > 0)

  /* ── ABC/XYZ ── */
  const LBL: Record<string, string> = { A: 'High-value', B: 'Medium-value', C: 'Low-value' }, XL: Record<string, string> = { X: 'predictable', Y: 'variable', Z: 'erratic / no demand' }
  const ABC_XYZ_MATRIX = (['A', 'B', 'C'] as const).flatMap((a) => (['X', 'Y', 'Z'] as const).map((x) => {
    const cell = list.filter((s) => s.abc === a && s.xyz === x)
    const cv = sum((s) => s.value, cell), cc = sum((s) => s.annualValue, cell)
    return { abc: a, xyz: x, skus: cell.length, pctRevenue: pct(cc, annualCOGS), pctInventory: pct(cv, invValue), avgDOS: cc > 0 ? Math.min(999, Math.round(cv / (cc / 365))) : cv > 0 ? 999 : 0, label: `${LBL[a]}, ${XL[x]}` }
  }))
  const ABC_DATA = (['A', 'B', 'C'] as const).map((a, i) => { const g = list.filter((s) => s.abc === a); return { name: `${a} items`, skus: g.length, revenue: pct(sum((s) => s.annualValue, g), annualCOGS, 0), inventory: pct(sum((s) => s.value, g), invValue, 0), color: ['#1a9e8f', '#4ab8ae', '#9fd8d0'][i] } })

  const buckets: [string, number, number, string][] = [['0-7', 0, 7, '#EF4444'], ['8-14', 7, 14, '#F97316'], ['15-25', 14, 25, '#1a9e8f'], ['26-45', 25, 45, '#EAB308'], ['46-90', 45, 90, '#F97316'], ['90+', 90, Infinity, '#EF4444']]
  const dosPop = list.filter((s) => s.onHand > 0 || s.D > 0)
  const DOS_DISTRIBUTION = buckets.map(([range, lo, hi, color]) => ({ range, skus: dosPop.filter((s) => (lo === 0 ? s.dos >= 0 : s.dos > lo) && s.dos <= hi).length, color }))

  /* ── trend (consumption only: a single stock snapshot cannot give historical inventory) ── */
  const trendMonths: string[] = []; for (let i = Math.min(24, spanAll) - 1; i >= 0; i--) trendMonths.push(addMonths(lastM, -i))
  const MONTHLY_TREND = trendMonths.map((m) => ({
    month: monthLabel(m),
    consumption: fin(sum((s) => Math.max(0, s.monthly[m] || 0) * s.cost) / 1000, 1),
    activeSkus: list.filter((s) => (s.monthly[m] || 0) > 0).length,
  }))

  /* ── top lists ── */
  const seg = (s: Sku) => `${s.abc}-${s.xyz}`
  const TOP_EXCESS = [...list].filter((s) => s.excessValue > 0).sort((a, b) => b.excessValue - a.excessValue).slice(0, 8)
    .map((s) => ({ sku: s.sku, desc: s.desc || s.sku, value: fin(s.excessValue), dos: Math.round(s.dos), segment: seg(s) }))
  const TOP_STOCKOUT = [...under].sort((a, b) => b.D * b.price - a.D * a.price).slice(0, 8)
    .map((s) => ({ sku: s.sku, desc: s.desc || s.sku, missedRevenue: fin(s.D * s.price), daysOut: Math.round(s.dos), segment: seg(s) }))

  /* ── data health (real checks) ── */
  const stockSkus = list.filter((s) => s.inStock), histSkus = list.filter((s) => s.inHist)
  const costCov = pct(stockSkus.filter((s) => s.cost > 0).length, stockSkus.length, 0)
  const ltCov = hasLT ? pct(stockSkus.filter((s) => s.lt !== null).length, stockSkus.length, 0) : 0
  const completeness = clampScore(costCov * 0.6 + ltCov * 0.4)
  const badRows = badStockRows + badHistRows + negStock + negQty
  const accuracy = clampScore(100 - pct(badRows, stockRows + histRows, 1) * 5)
  const today = new Date()
  const ageMonths = Math.max(0, monthsBetween(lastM, `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`))
  const timeliness = clampScore(Math.min(100, (nM / 12) * 100) - Math.max(0, ageMonths - 1) * 10)
  const onlyStock = stockSkus.filter((s) => !s.inHist).length, onlyHist = histSkus.filter((s) => !s.inStock).length
  const consistency = clampScore(100 - pct(onlyHist, histSkus.length, 1) * 1.5 - pct(stockSkus.filter((s) => s.onHand > 0 && !s.inHist && !s.lastMove).length, stockSkus.length, 1) * 0.5)
  const granularity = clampScore((dailyDates > histRows * 0.3 ? 60 : 45) + (hasLoc ? 25 : 0) + (has(stock, A.family) ? 15 : 0))
  const dims = [
    { name: 'Completeness', score: completeness, detail: `${100 - costCov}% of stock SKUs without unit cost; ${hasLT ? `${100 - ltCov}% without lead time` : `no lead-time column (default ${ltDefault} days used)`}` },
    { name: 'Accuracy', score: accuracy, detail: badRows ? `${badRows} row(s) with unreadable or negative quantities (${negStock} negative stock, ${negQty} negative consumption)` : 'All quantity and cost fields readable and non-negative' },
    { name: 'Timeliness', score: timeliness, detail: `${nM} month(s) of history used (${monthLabel(statMonths[0])} – ${monthLabel(lastM)}); last period ${ageMonths <= 1 ? 'is current' : `is ${ageMonths} months old`}` },
    { name: 'Consistency', score: consistency, detail: `${onlyHist} SKU(s) consumed but missing from stock file; ${onlyStock} stocked SKU(s) with no consumption in history` },
    { name: 'Granularity', score: granularity, detail: `${dailyDates > histRows * 0.3 ? 'Transaction-level dates' : 'Monthly buckets'}; ${hasLoc ? `${locs.size} location(s)` : 'no location column'}; ${has(stock, A.family) ? 'product family provided' : 'no product family'}` },
  ]
  const DATA_HEALTH = { overall: clampScore(mean(dims.map((d) => d.score))), dimensions: dims }
  const gaps: string[] = []
  if (!hasLT || ltCov < 90) gaps.push('lead times')
  if (costCov < 95) gaps.push('unit costs')
  if (!hasSS) gaps.push('current safety stock parameters')
  if (!hasSL) gaps.push('service-level targets (95% assumed)')
  const HEALTH_NOTE = gaps.length
    ? `Missing or partial ${gaps.join(', ')}. Where absent, defaults are used, so safety stock, reorder point and excess figures are directional. Completing these fields makes the calculation precise.`
    : 'Master data looks complete. Figures below are computed directly from your files.'

  /* ── recommendations (rule-based, impacts = computed values) ── */
  const recs: InventoryDataset['RECOMMENDATIONS'] = []
  const excessShare = invValue > 0 ? excessNonObs / invValue : 0
  if (excessNonObs > 0) recs.push({ id: 1, priority: excessShare > 0.2 ? 'CRITICAL' : 'HIGH', title: `Right-size excess stock on ${over.filter((s) => !s.noMove).length} overstocked SKUs`, impact: fmtK(excessNonObs),
    description: `${over.filter((s) => !s.noMove).length} moving SKUs hold stock above their order-up-to level (safety stock + lead-time demand + 1 month review cycle). The excess is valued at ${fmtK(excessNonObs)} at cost (${pct(excessNonObs, invValue, 0)}% of inventory). Freezing replenishment and cancelling open orders on these items releases this cash as demand consumes it.`,
    timeline: '4-8 weeks', practice: 'Inventory & Demand Optimization', effort: 'Medium' })
  if (obsoleteValue > 0) recs.push({ id: 2, priority: obsoleteValue / Math.max(invValue, 1) > 0.1 ? 'HIGH' : 'MEDIUM', title: 'Launch slow-mover disposition program', impact: fmtK(OBS_RECOVERY * obsoleteValue),
    description: `${obsolete.length} SKUs with stock show no consumption in the last 3 months${hasLM ? ' or no movement for 90+ days' : ''}, representing ${fmtK(obsoleteValue)} at cost. Assuming ~${OBS_RECOVERY * 100}% recovery through return-to-vendor, markdown or transfer, disposition would release about ${fmtK(OBS_RECOVERY * obsoleteValue)} before write-off.`,
    timeline: '2-3 weeks', practice: 'Inventory & Demand Optimization', effort: 'Low' })
  if (under.length > 0) recs.push({ id: 3, priority: under.some((s) => s.abc === 'A') ? 'HIGH' : 'MEDIUM', title: `Rebuild cover on ${under.length} SKUs below safety stock`, impact: fmtK(atRiskMonthly),
    description: `${under.length} SKUs with active demand are below their statistical safety stock (${under.filter((s) => s.abc === 'A').length} are A-class). Their monthly demand is worth ${fmtK(atRiskMonthly)}${hasPrice ? ' at selling price' : ' at cost'} — this is demand at risk, not a saving, so it is not added to the recoverable total.`,
    timeline: '1-2 weeks', practice: 'Inventory & Demand Optimization', effort: 'Low', countInTotal: false })
  const cExcess = sum((s) => s.excessValue, list.filter((s) => s.abc === 'C' || s.xyz === 'Z'))
  recs.push({ id: 4, priority: 'MEDIUM', title: 'Differentiate safety stock and replenishment by ABC/XYZ segment', impact: fmtK(cExcess),
    description: `Statistical parameters (z × σ × √LT) give a policy average inventory of ${fmtK(targetAvgInv)} (${fin(targetDOS)} days) versus ${fmtK(invValue)} today (${fin(avgDOS)} days). ${fmtK(cExcess)} of the excess sits in C-class or erratic (Z) items; setting lower service targets there and higher on A-X items rebalances cover. Already included in recommendation #1.`,
    timeline: '4-6 weeks', practice: 'Inventory & Demand Optimization', effort: 'Medium', countInTotal: false })
  if (gaps.length) recs.push({ id: 5, priority: 'MEDIUM', title: 'Complete replenishment master data', impact: '0',
    description: `Missing ${gaps.join(', ')}. Defaults were used for this diagnostic; accurate master data is a prerequisite for MRP/ERP to generate the right replenishment signals. Not quantified.`,
    timeline: '2-4 weeks', practice: 'APS Health Check & Rescue', effort: 'Medium', countInTotal: false })
  recs.push({ id: 6, priority: 'LOW', title: 'Establish a monthly inventory review cadence', impact: '0',
    description: `Track turns (${fin(turns, 1)}x today), days of supply, excess and no-movement stock monthly against the targets in this report, with owners per ABC segment, to prevent recurrence. Not quantified.`,
    timeline: '2 weeks', practice: 'Planning KPI Dashboard', effort: 'Low', countInTotal: false })
  const PR: Record<Priority, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
  const impactNum = (s: string) => { const m = s.match(/^([\d.]+)([KM]?)$/); return m ? parseFloat(m[1]) * (m[2] === 'M' ? 1e6 : m[2] === 'K' ? 1e3 : 1) : 0 }
  recs.sort((a, b) => PR[a.priority] - PR[b.priority] || impactNum(b.impact) - impactNum(a.impact))
  recs.forEach((r, i) => (r.id = i + 1))

  const ROADMAP = [
    { phase: 'Week 1-3', title: 'Quick Wins', color: '#22C55E', items: [
      obsoleteValue > 0 ? `Launch slow-mover disposition (${fmtK(OBS_RECOVERY * obsoleteValue)})` : 'Confirm no-movement list with sales',
      under.length ? `Expedite ${under.length} SKUs below safety stock` : 'Validate safety stock on A items',
      'Define service level targets by segment'] },
    { phase: 'Week 4-8', title: 'Structural Fixes', color: '#EAB308', items: [
      excessNonObs > 0 ? `Freeze replenishment on overstocked SKUs (${fmtK(excessNonObs)})` : 'Review order-up-to levels',
      gaps.length ? `Complete master data (${gaps.slice(0, 2).join(', ')})` : 'Load statistical safety stocks into ERP',
      'Recalibrate reorder points and lot sizes'] },
    { phase: 'Week 9-12', title: 'Sustain & Scale', color: '#0EA5E9', items: ['Differentiate policies by ABC/XYZ segment', 'Automate KPI tracking and alerts', 'Monthly inventory review cadence'] },
  ]

  notes.push(`Safety stock = z × σ(monthly demand) × √(lead time / 30); z from the target service level (default 95%). Missing lead times default to ${ltDefault} days${ltGiven.length ? ' (median of provided values)' : ''}.`)
  notes.push('Excess = on hand − (safety stock + lead-time demand + 1 month review cycle), valued at unit cost.')
  notes.push(`Working-capital release = excess on moving items + ${OBS_RECOVERY * 100}% assumed recovery on no-movement stock.`)
  if (!slAvailable) notes.push('Achieved service level is not computed: it requires ordered vs. delivered quantities (add a quantity_ordered column to the history).')
  notes.push('Only one stock snapshot is provided, so historical inventory, turns and excess over time are not shown — the trend chart shows consumption only.')
  if (onlyHist) notes.push(`${onlyHist} SKU(s) appear in history but not in the stock file; they are treated as zero stock.`)

  const hm: InventoryDataset['HEALTH_METRICS'] = {
    totalInventoryValue: fin(invValue), excessInventoryValue: fin(excessValue), obsoleteRisk: fin(obsoleteValue), stockoutCostMonthly: fin(atRiskMonthly),
    avgDaysOfSupply: fin(avgDOS), targetDaysOfSupply: fin(targetDOS), inventoryTurns: fin(turns, 1), benchmarkTurns: fin(targetTurns, 1),
    serviceLevel, targetServiceLevel: targetSL, workingCapitalTiedUp: fin(invValue), potentialRelease: fin(potentialRelease),
    safetyStockAccuracy: ssAcc, forecastAccuracy: 0, skusWithNoMovement90d: obsolete.length, skusOverstocked: over.length, skusUnderstocked: under.length,
    serviceLevelAvailable: slAvailable, safetyStockAccuracyAvailable: ssAccAvailable,
    benchmarkLabel: 'policy target', stockoutLabel: 'Monthly Demand at Risk', stockoutSub: `${under.length} SKUs below safety stock`,
    serviceLevelNote: slAvailable ? 'fill rate, last 12 months' : 'needs ordered vs. shipped qty',
    safetyStockNote: ssAccAvailable ? 'current SS within ±25% of statistical SS' : 'needs current safety stock column',
  }

  return {
    isDemo: false,
    COMPANY: { name: 'Your data', currency: '', skuCount: list.length, warehouseCount: Math.max(1, locs.size) },
    ABC_XYZ_MATRIX, HEALTH_METRICS: hm, MONTHLY_TREND,
    TREND: { title: `${trendMonths.length}-Month Consumption Trend`, subtitle: 'Consumption value at cost (K) and number of SKUs with movement per month. Historical inventory is not shown because only one stock snapshot was provided.',
      series: [{ key: 'consumption', name: 'Consumption value (K)', color: '#4ab8ae', axis: 'left' }, { key: 'activeSkus', name: 'SKUs with movement', color: '#EAB308', axis: 'right' }] },
    TOP_EXCESS, TOP_STOCKOUT, STOCKOUT_LABELS: { title: 'Top Stockout-Risk Items (below safety stock)', daysSuffix: 'd of cover left' },
    DATA_HEALTH, HEALTH_NOTE, RECOMMENDATIONS: recs, ABC_DATA, DOS_DISTRIBUTION,
    DOS_SUBTITLE: `SKUs by days of supply (on hand ÷ average daily demand). Policy average: ${fin(targetDOS)} days.`,
    ROADMAP, CTA: { showInvestment: false, impactPhrase: 'a one-off working-capital release of' }, NOTES: notes,
  }
}

/* ─── Templates (used by the uploader) ─── */
export const INVENTORY_TEMPLATES = {
  stock: {
    name: 'Stock on hand (required)', desc: 'Current stock by SKU: quantity, unit cost; optional location, family, lead time, safety stock, service level, last movement',
    filename: 'opsflow_stock_on_hand.csv',
    headers: ['sku', 'description', 'on_hand_qty', 'unit_cost', 'location', 'family', 'lead_time_days', 'safety_stock', 'target_service_level', 'last_movement_date'],
    sample: [
      ['PP-GRAN-4521', 'PP Granulate Natural 25kg', 1850, 42.5, 'WH-Main', 'Granulates', 45, 300, 95, '2026-08-28'],
      ['HDPE-PIPE-220', 'HDPE Pipe Grade Black', 620, 118, 'WH-Main', 'Pipes', 60, 80, 95, '2026-08-30'],
      ['PP-FILM-T200', 'PP Film Transparent 200mu', 40, 65, 'WH-East', 'Films', 30, 120, 98, '2026-08-31'],
      ['PA6-ROD-BK30', 'PA6 Rod Black 30mm', 310, 88, 'WH-Main', 'Semi-finished', 90, 20, 90, '2026-03-14'],
      ['PET-BTL-500C', 'PET Bottle Clear 500ml', 42000, 0.18, 'WH-East', 'Packaging', 21, 15000, 95, '2026-08-29'],
    ] as (string | number)[][],
  },
  history: {
    name: 'Consumption history (required)', desc: '12-24 months of issues/sales by SKU and month (or transaction date); optional unit price, ordered quantity',
    filename: 'opsflow_consumption_history.csv',
    headers: ['sku', 'month', 'quantity', 'unit_price', 'quantity_ordered'],
    sample: [
      ['PP-GRAN-4521', '2025-09', 410, 58, 410],
      ['PP-GRAN-4521', '2025-10', 380, 58, 400],
      ['HDPE-PIPE-220', '2025-09', 150, 160, 150],
      ['PP-FILM-T200', '2025-09', 210, 92, 240],
      ['PET-BTL-500C', '2025-09', 18500, 0.29, 18500],
      ['PA6-ROD-BK30', '2025-09', 12, 120, 12],
    ] as (string | number)[][],
  },
}
