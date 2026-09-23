/* Supply Risk & Resilience engine.
   Pure functions: parsed tables (see io.ts) -> dashboard dataset for /platform/supply-risk.
   Everything is computed from the uploaded rows; nothing is invented. Where a figure cannot be
   derived from the data (e.g. disruption cost without an incident log) it is flagged as unavailable. */
import { findTable, pick, num, normKey, round, type Table } from './io'

/* ───────────────────────── Types ───────────────────────── */
export type RiskRecommendation = {
  id: number; priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; title: string
  /** '420K' / '1.2M' / '850' — parsed by the page. '' = not quantifiable from the data. */
  impact: string
  description: string; timeline: string; practice: string; effort: 'High' | 'Medium' | 'Low'
}
export type SupplyRiskDataset = {
  isDemo: boolean
  COMPANY: { name: string; currency: string; supplierCount: number; activeSuppliers: number }
  EXECUTIVE_SUMMARY: {
    totalSuppliers: number; activeSuppliers: number; singleSourceMaterials: number
    singleSourceSpend: number; top5Spend: number
    annualDisruptionCost: number; disruptionCostAvailable: boolean; disruptionCostBasis: string
  }
  SUPPLIER_CONCENTRATION: { name: string; spend: number; spending: number }[]
  RISK_HEAT_MAP: { category: string; count: number; probability: number; impact: number; bgColor: string }[]
  SINGLE_SOURCE_MATERIALS: { material: string; supplier: string; spend: number; leadTime: string; alternative: string; riskLevel: string }[]
  GEOGRAPHIC_DATA: { region: string; suppliers: number; spend: number; label: string }[]
  DISRUPTION_HISTORY: { date: string; supplier: string; cause: string; duration: string; impact: string }[]
  RECOMMENDATIONS: RiskRecommendation[]
  ROADMAP: { phase: string; title: string; color: string; items: string[] }[]
  DATA_HEALTH: { overall: number; dimensions: { name: string; score: number; detail: string }[] }
  META: {
    hhi: number; hhiLabel: string; concentrationText: string; heatMapRule: string; singleSourceRule: string
    incidentsProvided: boolean; incidentCount: number; totalSpend: number; periodLabel: string; notes: string[]
  }
}

/* ───────────────────────── Aliases (en / fr / de / pt) ───────────────────────── */
const A = {
  supplier: ['supplier', 'supplier_name', 'vendor', 'vendor_name', 'supplier_id', 'vendor_id', 'fournisseur', 'nom_fournisseur', 'lieferant', 'lieferantenname', 'kreditor', 'fornecedor', 'nome_fornecedor'],
  material: ['material', 'material_name', 'material_id', 'material_number', 'part', 'part_number', 'part_no', 'sku', 'item', 'item_code', 'item_number', 'article', 'article_number', 'artikel', 'artikelnummer', 'materialnummer', 'teil', 'produit', 'matiere', 'composant', 'reference', 'material_code', 'peca', 'produto', 'componente', 'codigo_material'],
  spend: ['annual_spend', 'spend', 'total_spend', 'annual_spend_value', 'spend_value', 'purchase_value', 'net_value', 'line_total', 'amount', 'po_value', 'depense', 'depenses', 'depense_annuelle', 'montant', 'montant_achats', 'jahresvolumen', 'einkaufsvolumen', 'ausgaben', 'betrag', 'bestellwert', 'gasto', 'gastos', 'gasto_anual', 'valor', 'valor_total', 'valor_compras'],
  qty: ['qty', 'quantity', 'order_qty', 'po_qty', 'menge', 'bestellmenge', 'quantite', 'qte', 'quantidade', 'qtd'],
  price: ['unit_price', 'price', 'net_price', 'einzelpreis', 'preis', 'stuckpreis', 'prix_unitaire', 'prix', 'preco_unitario', 'preco'],
  date: ['po_date', 'order_date', 'document_date', 'date', 'bestelldatum', 'belegdatum', 'datum', 'date_commande', 'data_pedido', 'data'],
  country: ['country', 'supplier_country', 'country_code', 'country_of_origin', 'origin', 'pays', 'pays_fournisseur', 'land', 'herkunftsland', 'lieferland', 'pais', 'pais_fornecedor'],
  leadDays: ['lead_time_days', 'lead_time', 'leadtime', 'lt_days', 'lieferzeit', 'lieferzeit_tage', 'wiederbeschaffungszeit', 'delai', 'delai_jours', 'delai_livraison', 'delai_appro', 'prazo', 'prazo_entrega', 'prazo_dias', 'lead_time_dias'],
  leadWeeks: ['lead_time_weeks', 'lead_time_wks', 'lieferzeit_wochen', 'delai_semaines', 'prazo_semanas'],
  category: ['category', 'material_group', 'commodity', 'spend_category', 'warengruppe', 'kategorie', 'categorie', 'famille', 'categoria', 'grupo_material'],
  alt: ['alternative_supplier_qualified', 'alternative_qualified', 'alternative_supplier', 'alternative', 'alt_supplier_qualified', 'second_source', 'dual_source', 'zweitlieferant', 'alternativer_lieferant', 'alternative_qualifiziert', 'fournisseur_alternatif', 'alternative_qualifiee', 'second_fournisseur', 'fornecedor_alternativo', 'alternativo_qualificado', 'alternativa'],
  currency: ['currency', 'waehrung', 'wahrung', 'devise', 'monnaie', 'moeda'],
  // incidents
  incDate: ['date', 'incident_date', 'event_date', 'start_date', 'datum', 'vorfallsdatum', 'date_incident', 'data', 'data_incidente'],
  cause: ['cause', 'root_cause', 'reason', 'description', 'incident', 'event', 'ursache', 'grund', 'beschreibung', 'raison', 'motif', 'causa', 'motivo', 'descricao'],
  duration: ['duration_days', 'duration', 'days', 'downtime_days', 'downtime', 'dauer', 'dauer_tage', 'ausfalltage', 'duree', 'duree_jours', 'duracao', 'duracao_dias', 'dias'],
  impactValue: ['impact_value', 'impact', 'cost', 'cost_impact', 'financial_impact', 'impact_cost', 'loss', 'kosten', 'schaden', 'auswirkung', 'cout', 'cout_impact', 'perte', 'impacto', 'custo', 'prejuizo'],
}

/* ───────────────────────── Country → region ───────────────────────── */
export type Region = 'DACH' | 'W.Europe' | 'E.Europe' | 'Asia' | 'Americas' | 'Other'
const REGION_ORDER: Region[] = ['DACH', 'W.Europe', 'E.Europe', 'Asia', 'Americas', 'Other']
const FAR: Region[] = ['Asia', 'Americas', 'Other']
// iso2: [region, display name, ...aliases (iso3, en/fr/de/pt names)]
const COUNTRIES: Record<string, [Region, string, ...string[]]> = {
  DE: ['DACH', 'Germany', 'DEU', 'germany', 'deutschland', 'allemagne', 'alemanha', 'federal republic of germany', 'brd'],
  AT: ['DACH', 'Austria', 'AUT', 'austria', 'osterreich', 'oesterreich', 'autriche'],
  CH: ['DACH', 'Switzerland', 'CHE', 'switzerland', 'schweiz', 'suisse', 'suica', 'svizzera', 'swiss'],
  LI: ['DACH', 'Liechtenstein', 'LIE', 'liechtenstein'],
  FR: ['W.Europe', 'France', 'FRA', 'france', 'frankreich', 'franca'],
  BE: ['W.Europe', 'Belgium', 'BEL', 'belgium', 'belgien', 'belgique', 'belgica'],
  NL: ['W.Europe', 'Netherlands', 'NLD', 'netherlands', 'the netherlands', 'holland', 'niederlande', 'pays bas', 'paises baixos', 'holanda'],
  LU: ['W.Europe', 'Luxembourg', 'LUX', 'luxembourg', 'luxemburg', 'luxemburgo'],
  GB: ['W.Europe', 'United Kingdom', 'GBR', 'UK', 'united kingdom', 'great britain', 'britain', 'england', 'scotland', 'wales', 'royaume uni', 'grossbritannien', 'vereinigtes konigreich', 'reino unido', 'inglaterra'],
  IE: ['W.Europe', 'Ireland', 'IRL', 'ireland', 'irland', 'irlande', 'irlanda'],
  IT: ['W.Europe', 'Italy', 'ITA', 'italy', 'italien', 'italie', 'italia'],
  ES: ['W.Europe', 'Spain', 'ESP', 'spain', 'spanien', 'espagne', 'espanha', 'espana'],
  PT: ['W.Europe', 'Portugal', 'PRT', 'portugal'],
  DK: ['W.Europe', 'Denmark', 'DNK', 'denmark', 'danemark', 'dinamarca'],
  SE: ['W.Europe', 'Sweden', 'SWE', 'sweden', 'schweden', 'suede', 'suecia'],
  NO: ['W.Europe', 'Norway', 'NOR', 'norway', 'norwegen', 'norvege', 'noruega'],
  FI: ['W.Europe', 'Finland', 'FIN', 'finland', 'finnland', 'finlande', 'finlandia'],
  GR: ['W.Europe', 'Greece', 'GRC', 'greece', 'griechenland', 'grece', 'grecia'],
  PL: ['E.Europe', 'Poland', 'POL', 'poland', 'polen', 'pologne', 'polonia'],
  CZ: ['E.Europe', 'Czechia', 'CZE', 'czechia', 'czech republic', 'tschechien', 'republique tcheque', 'tchequie', 'republica checa', 'tchequia', 'chequia'],
  SK: ['E.Europe', 'Slovakia', 'SVK', 'slovakia', 'slowakei', 'slovaquie', 'eslovaquia'],
  HU: ['E.Europe', 'Hungary', 'HUN', 'hungary', 'ungarn', 'hongrie', 'hungria'],
  RO: ['E.Europe', 'Romania', 'ROU', 'romania', 'rumanien', 'roumanie', 'romenia'],
  BG: ['E.Europe', 'Bulgaria', 'BGR', 'bulgaria', 'bulgarien', 'bulgarie'],
  SI: ['E.Europe', 'Slovenia', 'SVN', 'slovenia', 'slowenien', 'slovenie', 'eslovenia'],
  HR: ['E.Europe', 'Croatia', 'HRV', 'croatia', 'kroatien', 'croatie', 'croacia'],
  RS: ['E.Europe', 'Serbia', 'SRB', 'serbia', 'serbien', 'serbie', 'servia'],
  EE: ['E.Europe', 'Estonia', 'EST', 'estonia', 'estland', 'estonie', 'estonia'],
  LV: ['E.Europe', 'Latvia', 'LVA', 'latvia', 'lettland', 'lettonie', 'letonia'],
  LT: ['E.Europe', 'Lithuania', 'LTU', 'lithuania', 'litauen', 'lituanie', 'lituania'],
  UA: ['E.Europe', 'Ukraine', 'UKR', 'ukraine', 'ucrania'],
  TR: ['E.Europe', 'Turkey', 'TUR', 'turkey', 'turkiye', 'turkei', 'turquie', 'turquia'],
  RU: ['E.Europe', 'Russia', 'RUS', 'russia', 'russian federation', 'russland', 'russie', 'russia'],
  CN: ['Asia', 'China', 'CHN', 'PRC', 'china', 'chine', 'volksrepublik china', 'peoples republic of china'],
  HK: ['Asia', 'Hong Kong', 'HKG', 'hong kong', 'hongkong'],
  TW: ['Asia', 'Taiwan', 'TWN', 'taiwan', 'taiwan roc'],
  JP: ['Asia', 'Japan', 'JPN', 'japan', 'japon', 'japao'],
  KR: ['Asia', 'South Korea', 'KOR', 'south korea', 'korea', 'republic of korea', 'sudkorea', 'coree du sud', 'coreia do sul'],
  IN: ['Asia', 'India', 'IND', 'india', 'indien', 'inde'],
  VN: ['Asia', 'Vietnam', 'VNM', 'vietnam', 'viet nam', 'vietname'],
  TH: ['Asia', 'Thailand', 'THA', 'thailand', 'thailande', 'tailandia'],
  MY: ['Asia', 'Malaysia', 'MYS', 'malaysia', 'malaisie', 'malasia'],
  SG: ['Asia', 'Singapore', 'SGP', 'singapore', 'singapur', 'singapour', 'singapura'],
  ID: ['Asia', 'Indonesia', 'IDN', 'indonesia', 'indonesien', 'indonesie'],
  PH: ['Asia', 'Philippines', 'PHL', 'philippines', 'philippinen', 'filipinas'],
  BD: ['Asia', 'Bangladesh', 'BGD', 'bangladesh', 'bangladesch'],
  PK: ['Asia', 'Pakistan', 'PAK', 'pakistan', 'paquistao'],
  LK: ['Asia', 'Sri Lanka', 'LKA', 'sri lanka'],
  US: ['Americas', 'United States', 'USA', 'US', 'united states', 'united states of america', 'america', 'vereinigte staaten', 'etats unis', 'estados unidos', 'eua', 'eeuu'],
  CA: ['Americas', 'Canada', 'CAN', 'canada', 'kanada'],
  MX: ['Americas', 'Mexico', 'MEX', 'mexico', 'mexiko', 'mexique'],
  BR: ['Americas', 'Brazil', 'BRA', 'brazil', 'brasilien', 'bresil', 'brasil'],
  AR: ['Americas', 'Argentina', 'ARG', 'argentina', 'argentinien', 'argentine'],
  CL: ['Americas', 'Chile', 'CHL', 'chile', 'chili'],
  CO: ['Americas', 'Colombia', 'COL', 'colombia', 'kolumbien', 'colombie', 'colombia'],
  PE: ['Americas', 'Peru', 'PER', 'peru', 'perou'],
  ZA: ['Other', 'South Africa', 'ZAF', 'south africa', 'sudafrika', 'afrique du sud', 'africa do sul'],
  MA: ['Other', 'Morocco', 'MAR', 'morocco', 'marokko', 'maroc', 'marrocos'],
  TN: ['Other', 'Tunisia', 'TUN', 'tunisia', 'tunesien', 'tunisie', 'tunisia'],
  EG: ['Other', 'Egypt', 'EGY', 'egypt', 'agypten', 'egypte', 'egito'],
  IL: ['Other', 'Israel', 'ISR', 'israel'],
  AE: ['Other', 'United Arab Emirates', 'ARE', 'UAE', 'united arab emirates', 'vereinigte arabische emirate', 'emirats arabes unis', 'emirados arabes unidos'],
  SA: ['Other', 'Saudi Arabia', 'SAU', 'saudi arabia', 'saudi arabien', 'arabie saoudite', 'arabia saudita'],
  AU: ['Other', 'Australia', 'AUS', 'australia', 'australien', 'australie'],
  NZ: ['Other', 'New Zealand', 'NZL', 'new zealand', 'neuseeland', 'nouvelle zelande', 'nova zelandia'],
}
const normName = (s: string) =>
  String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
const COUNTRY_INDEX: Record<string, string> = (() => {
  const idx: Record<string, string> = {}
  for (const iso of Object.keys(COUNTRIES)) {
    const [, display, ...aliases] = COUNTRIES[iso]
    idx[normName(iso)] = iso
    idx[normName(display)] = iso
    for (const a of aliases) idx[normName(a)] = iso
  }
  return idx
})()
/** Map a country value (ISO2/ISO3 or name in en/fr/de/pt) to a region. */
export function countryToRegion(raw: any): { iso: string | null; name: string; region: Region; known: boolean } {
  const n = normName(raw)
  if (!n) return { iso: null, name: 'Unknown', region: 'Other', known: false }
  const iso = COUNTRY_INDEX[n] ?? COUNTRY_INDEX[n.replace(/^the /, '')]
  if (iso) return { iso, name: COUNTRIES[iso][1], region: COUNTRIES[iso][0], known: true }
  return { iso: null, name: String(raw).trim(), region: 'Other', known: false }
}

/* ───────────────────────── Helpers ───────────────────────── */
const str = (v: any) => (v === null || v === undefined ? '' : v instanceof Date ? v.toISOString().slice(0, 10) : String(v).trim())
const fin = (n: number) => (isFinite(n) ? n : 0)
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY = 86_400_000

/** Parse a date-ish cell (Date, Excel serial, ISO, dd.mm.yyyy, dd/mm/yyyy, mm/yyyy). */
export function parseDate(v: any): Date | null {
  if (v === null || v === undefined || v === '') return null
  if (v instanceof Date) return isNaN(+v) ? null : v
  if (typeof v === 'number') {
    if (v > 20000 && v < 80000) return new Date(Math.round((v - 25569) * DAY))
    return null
  }
  const s = String(v).trim()
  let m = s.match(/^(\d{4})[-/.](\d{1,2})(?:[-/.](\d{1,2}))?/)
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, m[3] ? +m[3] : 1))
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/)
  if (m) { const y = +m[3] < 100 ? 2000 + +m[3] : +m[3]; return new Date(Date.UTC(y, +m[2] - 1, +m[1])) }
  m = s.match(/^(\d{1,2})[-/.](\d{4})$/)
  if (m) return new Date(Date.UTC(+m[2], +m[1] - 1, 1))
  const d = new Date(s)
  return isNaN(+d) ? null : d
}
const dateLabel = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`

function yesNo(v: any): boolean | null {
  if (v === null || v === undefined || v === '') return null
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v > 0
  const s = normName(v)
  if (['yes', 'y', 'true', '1', 'ja', 'j', 'oui', 'o', 'sim', 's', 'x', 'qualified', 'qualifie', 'qualifiziert', 'qualificado', 'available'].includes(s)) return true
  if (['no', 'n', 'false', '0', 'nein', 'non', 'nao', 'none', 'not qualified', 'nicht qualifiziert', 'non qualifie', 'nao qualificado', '-'].includes(s)) return false
  return null
}

/** Compact money format matching the page's parser ('420K', '1.2M'). */
export function compact(n: number): string {
  const v = Math.max(0, fin(n))
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${Math.round(v / 1_000)}K`
  return `${Math.round(v)}`
}
const money = (cur: string, n: number) => `${cur ? cur + ' ' : ''}${compact(n)}`
const pct = (n: number, d = 1) => round(fin(n), d)
const has = (t: Table, aliases: string[]) => aliases.some((a) => t.headers.includes(normKey(a)))

/* ───────────────────────── Templates ───────────────────────── */
export const SUPPLY_RISK_TEMPLATES = [
  {
    name: 'Purchase Spend (required)',
    desc: 'One row per supplier × material (annual spend) — or raw PO lines with po_date, qty, unit_price. Country, lead time and alternative-supplier flag drive the risk scoring.',
    filename: 'opsflow_supply_risk_spend.csv',
    headers: ['supplier', 'material', 'annual_spend', 'country', 'lead_time_days', 'category', 'alternative_supplier_qualified', 'currency'],
    sample: [
      ['ChemCorp AG', 'Resin X42', 245000, 'DE', 56, 'Chemicals', 'no', 'CHF'],
      ['ChemCorp AG', 'Adhesive TK-7', 156000, 'DE', 84, 'Chemicals', 'no', 'CHF'],
      ['BallTech GmbH', 'Bearing Assembly 6204', 189000, 'Austria', 42, 'Mechanical', 'no', 'CHF'],
      ['Shenzhen Elec Co', 'Control Module ECM-3', 128000, 'China', 70, 'Electronics', 'yes', 'CHF'],
      ['FlexPak Ltd', 'Packaging Film 40µ', 134000, 'United Kingdom', 28, 'Packaging', 'yes', 'CHF'],
      ['PackPro SA', 'Packaging Film 40µ', 61000, 'France', 21, 'Packaging', 'yes', 'CHF'],
    ] as (string | number)[][],
  },
  {
    name: 'Incident Log (optional)',
    desc: 'Past supply disruptions: date, supplier, cause, duration in days and financial impact. Enables disruption cost and probability scoring.',
    filename: 'opsflow_supply_risk_incidents.csv',
    headers: ['date', 'supplier', 'cause', 'duration_days', 'impact_value'],
    sample: [
      ['2025-02-14', 'ChemCorp AG', 'Production fire at main plant', 18, 285000],
      ['2024-12-03', 'BallTech GmbH', 'Quality issue — tolerance drift', 8, 142000],
      ['2024-10-21', 'FlexPak Ltd', 'Port congestion Rotterdam', 14, 98000],
      ['2024-08-09', 'Shenzhen Elec Co', 'Component shortage', 21, 156000],
    ] as (string | number)[][],
  },
]

/* ───────────────────────── Engine ───────────────────────── */
type Line = { supplier: string; material: string; spend: number; date: Date | null; country: string; lead: number | null; alt: boolean | null; category: string; currency: string }

export function analyzeSupplyRisk(tables: Table[]): SupplyRiskDataset {
  if (!tables?.length) throw new Error('No data found. Upload the Purchase Spend file (see template).')

  /* 1. locate the spend table */
  const spendGroups = [A.supplier, A.material, [...A.spend, ...A.qty]]
  const spendT = findTable(tables, spendGroups, 3)
  if (!spendT) {
    const best = findTable(tables, spendGroups, 0)
    const found = best ? best.headers.slice(0, 20).join(', ') : 'none'
    throw new Error(
      `Purchase Spend file not recognised. Expected columns: supplier, material (or part / sku), annual_spend (or po_date + qty + unit_price), country. ` +
      `Found in "${best?.file ?? '?'}": ${found}.`)
  }
  const hasSpendCol = has(spendT, A.spend)
  const hasQtyPrice = has(spendT, A.qty) && has(spendT, A.price)
  const missing: string[] = []
  if (!hasSpendCol && !hasQtyPrice) missing.push('annual_spend (or qty + unit_price)')
  if (!has(spendT, A.country)) missing.push('country')
  if (missing.length) {
    throw new Error(
      `Purchase Spend file "${spendT.file}" is missing required column(s): ${missing.join(', ')}. ` +
      `Expected: supplier, material, annual_spend (or po_date + qty + unit_price), country; optional: lead_time_days, category, alternative_supplier_qualified. ` +
      `Found: ${spendT.headers.slice(0, 20).join(', ')}.`)
  }
  const hasLead = has(spendT, A.leadDays) || has(spendT, A.leadWeeks)
  const hasAlt = has(spendT, A.alt)
  const hasCat = has(spendT, A.category)

  /* 2. parse lines */
  const lines: Line[] = []
  let badSpend = 0
  for (const r of spendT.rows) {
    const supplier = str(pick(r, A.supplier)); const material = str(pick(r, A.material))
    if (!supplier || !material) continue
    let spend = hasSpendCol ? num(pick(r, A.spend)) : null
    if (spend === null && hasQtyPrice) {
      const q = num(pick(r, A.qty)); const p = num(pick(r, A.price))
      spend = q !== null && p !== null ? q * p : null
    }
    if (spend === null || !isFinite(spend)) { badSpend++; spend = 0 }
    let lead = num(pick(r, A.leadDays))
    if (lead === null) { const w = num(pick(r, A.leadWeeks)); lead = w === null ? null : w * 7 }
    if (lead !== null && (lead < 0 || lead > 1000)) lead = null
    lines.push({
      supplier, material, spend, date: parseDate(pick(r, A.date)), country: str(pick(r, A.country)),
      lead, alt: yesNo(pick(r, A.alt)), category: str(pick(r, A.category)), currency: str(pick(r, A.currency)).toUpperCase(),
    })
  }
  if (!lines.length) throw new Error(`No usable rows in "${spendT.file}": every row needs at least a supplier and a material.`)

  /* 3. period: if dated, keep last 12 months ending at the latest date */
  const dated = lines.filter((l) => l.date)
  const maxDate = dated.length ? new Date(Math.max(...dated.map((l) => +l.date!))) : null
  const minDate = dated.length ? new Date(Math.min(...dated.map((l) => +l.date!))) : null
  let periodLabel = 'Spend as provided (annual)'
  let inPeriod = (_l: Line) => true
  if (maxDate && dated.length >= lines.length * 0.8) {
    const from = +maxDate - 365 * DAY
    inPeriod = (l) => !!l.date && +l.date > from
    periodLabel = `Last 12 months to ${dateLabel(maxDate)}`
  }

  /* currency: explicit column or header hint */
  const curCounts: Record<string, number> = {}
  for (const l of lines) if (/^[A-Z]{3}$/.test(l.currency)) curCounts[l.currency] = (curCounts[l.currency] || 0) + 1
  let currency = Object.keys(curCounts).sort((a, b) => curCounts[b] - curCounts[a])[0] || ''
  if (!currency) {
    const h = spendT.headers.join(' ')
    const m = h.match(/(?:^|_)(chf|eur|usd|gbp|brl)(?:_|$| )/)
    if (m) currency = m[1].toUpperCase()
  }

  /* 4. aggregate per supplier and per material */
  type Sup = { name: string; spend: number; countrySpend: Record<string, number>; maxLead: number | null; materials: Set<string> }
  type Mat = { name: string; spend: number; suppliers: Record<string, number>; lead: number | null; alt: boolean | null; category: string }
  const sups: Record<string, Sup> = {}
  const mats: Record<string, Mat> = {}
  const supKey = (s: string) => normName(s) || s
  const matKey = (s: string) => normName(s) || s
  const supVariants: Record<string, Set<string>> = {}
  for (const l of lines) {
    const sk = supKey(l.supplier)
    ;(supVariants[sk] ||= new Set()).add(l.supplier)
    const s = (sups[sk] ||= { name: l.supplier, spend: 0, countrySpend: {}, maxLead: null, materials: new Set() })
    const active = inPeriod(l)
    const sp = active ? Math.max(0, l.spend) : 0
    s.spend += sp
    if (l.country) s.countrySpend[l.country] = (s.countrySpend[l.country] || 0) + sp + 1e-9
    if (l.lead !== null) s.maxLead = Math.max(s.maxLead ?? 0, l.lead)
    if (!active || sp <= 0) continue
    const mk = matKey(l.material)
    s.materials.add(mk)
    const m = (mats[mk] ||= { name: l.material, spend: 0, suppliers: {}, lead: null, alt: null, category: l.category })
    m.spend += sp
    m.suppliers[sk] = (m.suppliers[sk] || 0) + sp
    if (l.lead !== null) m.lead = Math.max(m.lead ?? 0, l.lead)
    if (l.alt !== null) m.alt = (m.alt ?? false) || l.alt
    if (!m.category && l.category) m.category = l.category
  }
  const allSup = Object.keys(sups).map((k) => ({ key: k, ...sups[k] }))
  const activeSup = allSup.filter((s) => s.spend > 0).sort((a, b) => b.spend - a.spend)
  const totalSpend = activeSup.reduce((a, s) => a + s.spend, 0)
  if (!(totalSpend > 0)) throw new Error(`Total spend is zero in "${spendT.file}". Check the annual_spend (or qty × unit_price) values${maxDate ? ' and the PO dates (last 12 months are analysed)' : ''}.`)
  const share = (v: number) => (totalSpend > 0 ? (v / totalSpend) * 100 : 0)

  /* supplier geography (dominant country by spend) */
  const supGeo: Record<string, ReturnType<typeof countryToRegion>> = {}
  let unmappedSup = 0
  for (const s of allSup) {
    const c = Object.keys(s.countrySpend).sort((a, b) => s.countrySpend[b] - s.countrySpend[a])[0] || ''
    supGeo[s.key] = countryToRegion(c)
    if (s.spend > 0 && !supGeo[s.key].known) unmappedSup++
  }

  /* 5. concentration */
  const top10 = activeSup.slice(0, 10)
  const othersSpend = activeSup.slice(10).reduce((a, s) => a + s.spend, 0)
  const SUPPLIER_CONCENTRATION = top10.map((s) => ({ name: s.name, spend: pct(share(s.spend)), spending: pct(share(s.spend)) }))
  if (othersSpend > 0) SUPPLIER_CONCENTRATION.push({ name: `Others (${activeSup.length - 10})`, spend: pct(share(othersSpend)), spending: pct(share(othersSpend)) })
  const top5Share = share(activeSup.slice(0, 5).reduce((a, s) => a + s.spend, 0))
  const hhi = Math.round(activeSup.reduce((a, s) => a + share(s.spend) ** 2, 0))
  const hhiLabel = hhi >= 2500 ? 'highly concentrated' : hhi >= 1500 ? 'moderately concentrated' : 'unconcentrated'
  const concentrationText = `Top 5 suppliers = ${pct(top5Share, 0)}% of total spend · HHI ${hhi} (${hhiLabel})`

  /* 6. single-source materials */
  const matList = Object.keys(mats).map((k) => ({ key: k, ...mats[k] }))
  const single = matList.filter((m) => Object.keys(m.suppliers).length === 1)
  const LT_LONG = 42
  const riskOf = (m: typeof single[number]) => {
    const noAlt = m.alt !== true
    const longLT = m.lead !== null && m.lead >= LT_LONG
    const big = share(m.spend) >= 1
    if (noAlt && (longLT || big)) return 'Critical'
    if (noAlt || (longLT && big)) return 'High'
    return 'Medium'
  }
  const rank: Record<string, number> = { Critical: 0, High: 1, Medium: 2 }
  const singleRows = single.map((m) => {
    const sk = Object.keys(m.suppliers)[0]
    return { m, sk, risk: riskOf(m) }
  }).sort((a, b) => rank[a.risk] - rank[b.risk] || b.m.spend - a.m.spend)
  const singleSpend = single.reduce((a, m) => a + m.spend, 0)
  const critical = singleRows.filter((r) => r.risk === 'Critical')
  const SINGLE_SOURCE_MATERIALS = singleRows.slice(0, 10).map(({ m, sk, risk }) => ({
    material: m.name, supplier: sups[sk].name, spend: Math.round(m.spend),
    leadTime: m.lead === null ? 'n/a' : m.lead >= 14 ? `${round(m.lead / 7, 0)} weeks` : `${round(m.lead, 0)} days`,
    alternative: m.alt === true ? 'Yes' : m.alt === false ? 'No' : 'Unknown',
    riskLevel: risk,
  }))
  const singleSourceRule = `Single-source = material bought from exactly one supplier in the period. Critical = no qualified alternative${hasAlt ? '' : ' (flag missing → treated as not qualified)'} AND (lead time ≥ ${LT_LONG / 7} weeks OR ≥ 1% of spend); High = no alternative, or long lead time with ≥ 1% of spend; otherwise Medium.`

  /* 7. geography */
  const geo: Record<Region, { suppliers: number; spend: number; countries: Record<string, number> }> = {} as any
  for (const r of REGION_ORDER) geo[r] = { suppliers: 0, spend: 0, countries: {} }
  for (const s of activeSup) {
    const g = supGeo[s.key]; const bucket = geo[g.region]
    bucket.suppliers++; bucket.spend += s.spend
    bucket.countries[g.name] = (bucket.countries[g.name] || 0) + s.spend
  }
  const GEOGRAPHIC_DATA = REGION_ORDER.filter((r) => geo[r].suppliers > 0).map((r) => ({
    region: r, suppliers: geo[r].suppliers, spend: pct(share(geo[r].spend)),
    label: Object.keys(geo[r].countries).sort((a, b) => geo[r].countries[b] - geo[r].countries[a]).slice(0, 3).join(', '),
  }))

  /* 8. incidents */
  const incGroups = [A.incDate, A.supplier, [...A.cause, ...A.duration, ...A.impactValue]]
  const incT = findTable(tables.filter((t) => t !== spendT), incGroups, 3)
  type Inc = { date: Date | null; supplier: string; sk: string; cause: string; dur: number | null; impact: number | null }
  const incidents: Inc[] = []
  const hasImpact = !!incT && has(incT, A.impactValue)
  if (incT) {
    for (const r of incT.rows) {
      const supplier = str(pick(r, A.supplier)); if (!supplier) continue
      const dur = num(pick(r, A.duration)); const imp = num(pick(r, A.impactValue))
      incidents.push({ date: parseDate(pick(r, A.incDate)), supplier, sk: supKey(supplier), cause: str(pick(r, A.cause)) || 'Not specified', dur: dur !== null && dur >= 0 ? dur : null, impact: imp !== null && imp >= 0 ? imp : null })
    }
  }
  const incidentsProvided = incidents.length > 0
  const incDates = incidents.filter((i) => i.date).map((i) => +i.date!)
  const refDate = new Date(Math.max(maxDate ? +maxDate : 0, incDates.length ? Math.max(...incDates) : 0) || Date.now())
  const last12 = incidents.filter((i) => i.date && +i.date > +refDate - 365 * DAY && +i.date <= +refDate)
  const disruptionCostAvailable = incidentsProvided && hasImpact && incidents.some((i) => i.impact !== null)
  const annualDisruptionCost = disruptionCostAvailable ? Math.round(last12.reduce((a, i) => a + (i.impact ?? 0), 0)) : 0
  const disruptionCostBasis = !incidentsProvided ? 'no incident log provided'
    : !disruptionCostAvailable ? 'incident log has no impact_value'
    : `${last12.length} incident${last12.length === 1 ? '' : 's'} in last 12 months to ${dateLabel(refDate)}`
  const incBySup: Record<string, Inc[]> = {}
  for (const i of incidents) (incBySup[i.sk] ||= []).push(i)
  const DISRUPTION_HISTORY = [...incidents]
    .sort((a, b) => (b.date ? +b.date : 0) - (a.date ? +a.date : 0))
    .slice(0, 6)
    .map((i) => ({
      date: i.date ? dateLabel(i.date) : 'Date n/a',
      supplier: sups[i.sk]?.name ?? i.supplier,
      cause: i.cause,
      duration: i.dur === null ? 'n/a' : `${round(i.dur, 0)} days`,
      impact: i.impact === null ? 'Not quantified in log' : money(currency, i.impact),
    }))

  /* 9. risk heat map — per active supplier */
  const supSingle: Record<string, { count: number; noAlt: number; spend: number }> = {}
  for (const { m, sk } of singleRows) {
    const x = (supSingle[sk] ||= { count: 0, noAlt: 0, spend: 0 })
    x.count++; x.spend += m.spend; if (m.alt !== true) x.noAlt++
  }
  type Scored = { key: string; name: string; p: number; i: number }
  const scored: Scored[] = activeSup.map((s) => {
    const ss = supSingle[s.key]; const inc = incBySup[s.key]?.length ?? 0
    let p = 0
    if (ss) p += 25
    if (s.maxLead !== null) p += s.maxLead > 56 ? 25 : s.maxLead > 28 ? 10 : 0
    if (supGeo[s.key].known && FAR.includes(supGeo[s.key].region)) p += 20
    p += inc >= 2 ? 35 : inc === 1 ? 20 : 0
    const sh = share(s.spend)
    let i = sh >= 5 ? 60 : sh >= 2 ? 40 : sh >= 1 ? 20 : 0
    if (ss && ss.noAlt > 0) i += 30
    if (ss && share(ss.spend) >= 1) i += 10
    return { key: s.key, name: s.name, p: Math.min(100, p), i: Math.min(100, i) }
  })
  const quad = (hp: boolean, hi: boolean) => scored.filter((x) => (x.p >= 50) === hp && (x.i >= 50) === hi)
  const avg = (a: number[]) => (a.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length) : 0)
  const mkQ = (label: string, hp: boolean, hi: boolean, color: string) => {
    const q = quad(hp, hi)
    return { category: label, count: q.length, probability: avg(q.map((x) => x.p)), impact: avg(q.map((x) => x.i)), bgColor: color }
  }
  const RISK_HEAT_MAP = [
    mkQ('High Probability,\nHigh Impact', true, true, '#EF4444'),
    mkQ('High Probability,\nLow Impact', true, false, '#F97316'),
    mkQ('Low Probability,\nHigh Impact', false, true, '#EAB308'),
    mkQ('Low Probability,\nLow Impact', false, false, '#22C55E'),
  ]
  const heatMapRule = `Each active supplier is scored 0–100. Probability: +25 sole source of ≥1 material, +25 max lead time > 8 weeks (+10 if > 4 weeks), +20 located in Asia / Americas / other non-European region${incidentsProvided ? ', +20 one logged incident (+35 if two or more)' : ' (no incident log, so history not scored)'}. Impact: +60 spend share ≥ 5% (+40 if ≥ 2%, +20 if ≥ 1%), +30 sole source of a material without a qualified alternative, +10 if its single-source spend ≥ 1% of total. High = score ≥ 50. Figures shown are the average scores per quadrant.`
  const hphi = quad(true, true)

  /* 10. recommendations (rules on real metrics) */
  const recs: Omit<RiskRecommendation, 'id'>[] = []
  const incCost12 = (keys: Set<string>) => last12.filter((i) => keys.has(i.sk)).reduce((a, i) => a + (i.impact ?? 0), 0)
  const covered = new Set<string>() // suppliers whose incident cost is already attributed (avoid double counting)
  if (critical.length) {
    const keys = new Set(critical.map((c) => c.sk))
    keys.forEach((k) => covered.add(k))
    const cost = disruptionCostAvailable ? incCost12(keys) : 0
    const critSpend = critical.reduce((a, c) => a + c.m.spend, 0)
    const names = critical.slice(0, 4).map((c) => `${c.m.name} (${sups[c.sk].name})`).join(', ')
    recs.push({
      priority: 'CRITICAL', title: `Qualify alternative sources for ${critical.length} critical single-source material${critical.length === 1 ? '' : 's'}`,
      impact: cost > 0 ? compact(cost) : '',
      description: `${critical.length} materials (${money(currency, critSpend)}, ${pct(share(critSpend))}% of spend) depend on one supplier with no qualified alternative and a long lead time or material spend. Start with: ${names}.` +
        (cost > 0 ? ` Their suppliers caused ${money(currency, cost)} of logged disruption cost in the last 12 months — the value at stake.` : ' Disruption cost not quantified (no incident impact data).'),
      timeline: '8-12 weeks', practice: 'Supply Chain Resilience', effort: 'High',
    })
  }
  const biggestRegion = GEOGRAPHIC_DATA.slice().sort((a, b) => b.spend - a.spend)[0]
  const farShare = pct(FAR.reduce((a, r) => a + share(geo[r].spend), 0))
  if (biggestRegion && biggestRegion.spend >= 50 && GEOGRAPHIC_DATA.length > 0) {
    recs.push({
      priority: biggestRegion.spend >= 70 ? 'CRITICAL' : 'HIGH',
      title: `Reduce geographic concentration in ${biggestRegion.region} (${biggestRegion.spend}% of spend)`,
      impact: '',
      description: `${biggestRegion.suppliers} suppliers in ${biggestRegion.region} (${biggestRegion.label}) carry ${biggestRegion.spend}% of spend (${money(currency, (biggestRegion.spend / 100) * totalSpend)}). A single regional event (logistics, energy, regulation) would hit most of the supply base. Identify dual sources in a second region for the critical materials first.`,
      timeline: '6-10 weeks', practice: 'Supply Chain Resilience', effort: 'High',
    })
  } else if (farShare >= 25) {
    recs.push({
      priority: 'HIGH', title: `Mitigate long-distance exposure (${farShare}% of spend outside Europe)`,
      impact: '',
      description: `${farShare}% of spend (${money(currency, (farShare / 100) * totalSpend)}) comes from Asia, the Americas or other non-European regions — longer transit, customs and geopolitical risk. Review buffer stock and near-shore options for the long-lead-time items in this group.`,
      timeline: '6-8 weeks', practice: 'Supply Chain Resilience', effort: 'High',
    })
  }
  const bufferMats = single.filter((m) => m.alt !== true && m.lead !== null && m.lead >= LT_LONG)
  if (bufferMats.length) {
    const wc = bufferMats.reduce((a, m) => a + m.spend * ((m.lead as number) / 365) * 0.5, 0)
    recs.push({
      priority: 'HIGH', title: `Contingency stock for ${bufferMats.length} long-lead single-source material${bufferMats.length === 1 ? '' : 's'}`,
      impact: '',
      description: `${bufferMats.length} sole-sourced materials without a qualified alternative have lead times ≥ ${LT_LONG / 7} weeks. A buffer covering half the lead time would tie up about ${money(currency, wc)} of working capital (rule: annual spend × lead time / 365 × 0.5) — size it per material against the cost of a stoppage.`,
      timeline: '3-4 weeks', practice: 'Demand & Inventory Optimization', effort: 'Medium',
    })
  }
  if (incidentsProvided) {
    const repeat = Object.keys(incBySup).filter((k) => incBySup[k].length >= 2)
    if (repeat.length) {
      const cost = disruptionCostAvailable ? incCost12(new Set(repeat.filter((k) => !covered.has(k)))) : 0
      recs.push({
        priority: 'HIGH', title: `Corrective action plans with ${repeat.length} repeat-disruption supplier${repeat.length === 1 ? '' : 's'}`,
        impact: cost > 0 ? compact(cost) : '',
        description: `${repeat.slice(0, 5).map((k) => `${sups[k]?.name ?? incBySup[k][0].supplier} (${incBySup[k].length} incidents)`).join(', ')} appear more than once in the incident log.` +
          (cost > 0 ? ` Those not already covered by the sourcing action above account for ${money(currency, cost)} of disruption cost in the last 12 months.` : '') + ' Agree root-cause actions, capacity/quality KPIs and escalation paths.',
        timeline: '6-10 weeks', practice: 'Supplier Development & Collaboration', effort: 'Medium',
      })
    }
  } else {
    recs.push({
      priority: 'MEDIUM', title: 'Start a structured supply disruption log',
      impact: '',
      description: 'No incident log was provided, so disruption probability and cost could not be measured. Record every late/short delivery, quality stop or force majeure with date, supplier, cause, duration and financial impact — it turns this diagnostic from exposure-based into loss-based.',
      timeline: '2-3 weeks', practice: 'Risk Management & Analytics', effort: 'Low',
    })
  }
  if (top5Share >= 50 || hhi >= 1500) {
    recs.push({
      priority: top5Share >= 70 || hhi >= 2500 ? 'HIGH' : 'MEDIUM',
      title: `Secure long-term agreements with the top 5 suppliers (${pct(top5Share, 0)}% of spend)`,
      impact: '',
      description: `${concentrationText}. Negotiate multi-year agreements with capacity reservation, priority allocation in shortages, advance notice of changes and business-continuity plans: ${activeSup.slice(0, 5).map((s) => s.name).join(', ')}.`,
      timeline: '6-8 weeks', practice: 'Contract & Relationship Management', effort: 'Medium',
    })
  }
  const tail = activeSup.filter((s) => share(s.spend) < 0.5)
  if (activeSup.length >= 20 && tail.length / activeSup.length >= 0.5) {
    recs.push({
      priority: 'LOW', title: `Consolidate the supplier tail (${tail.length} suppliers < 0.5% of spend each)`,
      impact: '',
      description: `${tail.length} of ${activeSup.length} active suppliers together represent ${pct(share(tail.reduce((a, s) => a + s.spend, 0)))}% of spend. Consolidating them frees buyer capacity for managing the critical suppliers above.`,
      timeline: '8-12 weeks', practice: 'Contract & Relationship Management', effort: 'Low',
    })
  }
  const gaps: string[] = []
  if (!hasLead) gaps.push('lead times')
  if (!hasAlt) gaps.push('alternative-supplier qualification')
  if (unmappedSup) gaps.push(`countries for ${unmappedSup} suppliers`)
  recs.push({
    priority: 'LOW', title: gaps.length ? `Complete the supplier risk master (${gaps.join(', ')})` : 'Implement continuous supplier risk monitoring',
    impact: '',
    description: gaps.length
      ? `The analysis could not use ${gaps.join(', ')}. Adding them sharpens the single-source risk levels and the heat map, then refresh this diagnostic quarterly.`
      : 'Refresh this diagnostic quarterly and track the heat-map movers: lead-time drift, new sole-source items, incidents and financial health of the high-impact suppliers.',
    timeline: '2-4 weeks', practice: 'Supply Chain Visibility', effort: 'Low',
  })
  const prio = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
  const RECOMMENDATIONS: RiskRecommendation[] = recs
    .sort((a, b) => prio[a.priority] - prio[b.priority] || parseImpact(b.impact) - parseImpact(a.impact))
    .map((r, i) => ({ id: i + 1, ...r }))

  /* 11. roadmap from the actual findings */
  const ROADMAP = [
    { phase: 'Week 1-4', title: 'Risk Assessment & Quick Wins', color: '#22C55E', items: [
      `Validate the ${single.length} single-source materials with category owners`,
      hphi.length ? `Risk review with the ${hphi.length} high-probability / high-impact suppliers` : 'Confirm supplier risk scores with category owners',
      incidentsProvided ? 'Root-cause review of the logged incidents' : 'Launch a structured disruption log',
    ] },
    { phase: 'Week 5-8', title: 'Sourcing Resilience', color: '#EAB308', items: [
      critical.length ? `Qualify alternative suppliers for ${Math.min(critical.length, 10)} critical materials` : 'Dual-source the highest-spend single-source items',
      `Negotiate continuity terms with the top 5 suppliers (${pct(top5Share, 0)}% of spend)`,
      biggestRegion ? `Assess second-region options for ${biggestRegion.region} spend` : 'Assess regional diversification',
    ] },
    { phase: 'Week 9-12', title: 'Sustain & Monitor', color: '#0EA5E9', items: [
      bufferMats.length ? `Contingency stock for ${bufferMats.length} long-lead sole-sourced materials` : 'Set buffer rules for long-lead items',
      'Deploy supplier risk monitoring on this data model',
      'Establish quarterly supply chain risk review',
    ] },
  ]

  /* 12. data health (measured on the upload) */
  const n = lines.length
  const filled = (f: (l: Line) => boolean) => (n ? (lines.filter(f).length / n) * 100 : 0)
  const cCountry = filled((l) => !!l.country); const cLead = hasLead ? filled((l) => l.lead !== null) : 0; const cAlt = hasAlt ? filled((l) => l.alt !== null) : 0
  const completeness = Math.round((cCountry + cLead + cAlt) / 3)
  const validSpend = n ? ((n - badSpend) / n) * 100 : 0
  const mappedPct = activeSup.length ? ((activeSup.length - unmappedSup) / activeSup.length) * 100 : 0
  const accuracy = Math.round((validSpend + mappedPct) / 2)
  const monthsOld = maxDate ? Math.max(0, (Date.now() - +maxDate) / (30.4 * DAY)) : null
  const timeliness = monthsOld === null ? 60 : Math.round(Math.max(20, Math.min(100, 100 - Math.max(0, monthsOld - 1) * 8)))
  const variantSup = Object.keys(supVariants).filter((k) => supVariants[k].size > 1).length
  const multiCountry = allSup.filter((s) => Object.keys(s.countrySpend).length > 1).length
  const consistency = Math.round(Math.max(0, 100 - ((variantSup + multiCountry) / Math.max(1, allSup.length)) * 100))
  const granularity = Math.round((hasCat ? 35 : 0) + (incidentsProvided ? 35 : 0) + (dated.length ? 30 : hasLead ? 15 : 0))
  const dims = [
    { name: 'Completeness', score: completeness, detail: `Country ${round(cCountry)}% · lead time ${hasLead ? round(cLead) + '%' : 'column missing'} · alternative flag ${hasAlt ? round(cAlt) + '%' : 'column missing'}` },
    { name: 'Accuracy', score: accuracy, detail: `${n - badSpend} of ${n} rows with a numeric spend · ${activeSup.length - unmappedSup} of ${activeSup.length} supplier countries mapped to a region` },
    { name: 'Timeliness', score: timeliness, detail: maxDate ? `Latest purchase dated ${dateLabel(maxDate)}${minDate ? ` (data from ${dateLabel(minDate)})` : ''}` : 'No purchase dates — spend taken as annual, recency unknown' },
    { name: 'Consistency', score: consistency, detail: `${variantSup} suppliers written in several ways · ${multiCountry} suppliers with more than one country` },
    { name: 'Granularity', score: granularity, detail: `Category ${hasCat ? 'present' : 'missing'} · incident log ${incidentsProvided ? `${incidents.length} events` : 'not provided'} · ${dated.length ? 'dated PO lines' : 'annual totals'}` },
  ]
  const DATA_HEALTH = { overall: Math.round(dims.reduce((a, d) => a + d.score, 0) / dims.length), dimensions: dims }

  const notes: string[] = []
  if (badSpend) notes.push(`${badSpend} rows had no numeric spend and were counted as 0.`)
  if (unmappedSup) notes.push(`${unmappedSup} supplier countries not recognised → region "Other".`)

  return {
    isDemo: false,
    COMPANY: { name: 'Your data', currency, supplierCount: allSup.length, activeSuppliers: activeSup.length },
    EXECUTIVE_SUMMARY: {
      totalSuppliers: allSup.length, activeSuppliers: activeSup.length, singleSourceMaterials: single.length,
      singleSourceSpend: pct(share(singleSpend), 0), top5Spend: pct(top5Share, 0),
      annualDisruptionCost: fin(annualDisruptionCost), disruptionCostAvailable, disruptionCostBasis,
    },
    SUPPLIER_CONCENTRATION, RISK_HEAT_MAP, SINGLE_SOURCE_MATERIALS, GEOGRAPHIC_DATA, DISRUPTION_HISTORY,
    RECOMMENDATIONS, ROADMAP, DATA_HEALTH,
    META: { hhi, hhiLabel, concentrationText, heatMapRule, singleSourceRule, incidentsProvided, incidentCount: incidents.length, totalSpend: Math.round(totalSpend), periodLabel, notes },
  }
}

/** Parse '420K' / '1.2M' / '850' → number; '' or garbage → 0. */
export function parseImpact(s: string): number {
  const m = String(s ?? '').trim().match(/^([\d.]+)\s*([KM]?)$/i)
  if (!m) return 0
  const v = parseFloat(m[1]); if (!isFinite(v)) return 0
  return m[2].toUpperCase() === 'M' ? v * 1_000_000 : m[2].toUpperCase() === 'K' ? v * 1_000 : v
}

