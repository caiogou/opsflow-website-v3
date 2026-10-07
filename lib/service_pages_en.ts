// Per-service layer of the dark service template (approved prototypes paginas_v1/service_*.html, 07/10/2026).
// The body copy, title, description and FAQ stay in lib/services_en.ts.

export type ServicePage = {
  short: string              // breadcrumb and "Other services" label
  h1a: string                // H1 before the teal part
  h1b: string                // teal part of the H1
  facts: { b: string; s: string }[]
  bookQ: string              // headline of the sticky booking card
  model: { decision: string; execution: string }
  related: { slug: string; kind: string; title: string }[]
  offer?: boolean            // show the paid Supply Chain Health Check card in the aside
}

export const SERVICE_PAGES: Record<string, ServicePage> = {
  's-op-consulting': {
    short: 'S&OP consulting',
    h1a: 'S&OP Consulting: ', h1b: 'Aligning Sales and Operations',
    facts: [{ b: '45 min', s: 'first session, free' }, { b: 'A few weeks', s: 'to a first working cycle' }, { b: '1 plan', s: 'signed off by leadership, every month' }],
    bookQ: 'Is an S&OP cycle worth it for you now?',
    model: { decision: 'The plan validated by leadership, once a month.', execution: 'Day-to-day operations, driven by that plan.' },
    related: [
      { slug: 'what-is-sop', kind: 'Guide', title: 'What is S&OP? Definition and 5-step cycle' },
      { slug: 'demand-forecasting', kind: 'Method', title: 'Demand forecasting: methods for SMEs' },
      { slug: 'otif', kind: 'KPI', title: 'OTIF: definition and how to manage it' },
    ],
  },
  'inventory-optimization': {
    short: 'Inventory optimization',
    h1a: 'Inventory Optimization: ', h1b: 'Less Stock, Better Service',
    facts: [{ b: '45 min', s: 'first session, free' }, { b: 'ABC/XYZ', s: 'segmentation of your SKU range' }, { b: 'SKU by SKU', s: 'safety stocks on real data' }],
    bookQ: 'Where is unnecessary stock hiding?',
    model: { decision: 'Which service level to target, and for which products.', execution: 'Tuning the stock that carries it out.' },
    related: [
      { slug: 'safety-stock', kind: 'Guide', title: 'Safety Stock: How to Calculate It in an SME' },
      { slug: 'reorder-point-economic-order-quantity', kind: 'Method', title: 'Reorder point and economic order quantity (EOQ)' },
      { slug: 'inventory-turnover', kind: 'KPI', title: 'Inventory turnover: how to calculate and read it' },
    ],
  },
  'supply-chain-risk-management': {
    short: 'Supply chain risk',
    h1a: 'Supply Chain ', h1b: 'Risk Management',
    facts: [{ b: '45 min', s: 'first session, free' }, { b: 'Impact × probability', s: 'how risks are ranked' }, { b: 'Early warning', s: 'indicators to anticipate' }],
    bookQ: 'Which dependencies could stop your operations?',
    model: { decision: 'Which risks to accept, which to cover and at what cost.', execution: 'Implementing those choices in purchasing and planning.' },
    related: [
      { slug: 'dual-sourcing', kind: 'Strategy', title: 'Dual Sourcing: A Strategy to Secure Supply' },
      { slug: 'safety-stock', kind: 'Guide', title: 'Safety Stock: How to Calculate It in an SME' },
      { slug: 'supply-chain-kpis-dashboard', kind: 'KPI', title: 'Supply chain KPIs: building your dashboard' },
    ],
  },
  'distribution-planning': {
    short: 'Distribution planning',
    h1a: 'Distribution Planning: ', h1b: 'Serve at the Right Cost',
    facts: [{ b: '45 min', s: 'first session, free' }, { b: 'Per location', s: 'needs and replenishment rules' }, { b: 'Cost, stock, service', s: 'one explicit trade-off' }],
    bookQ: 'Where is your distribution losing service or money?',
    model: { decision: 'The cost and service compromise, decided by leadership.', execution: 'The replenishment rules that apply it.' },
    related: [
      { slug: 'cost-to-serve', kind: 'Analysis', title: 'Cost-to-Serve: Definition and Analysis for SMEs' },
      { slug: 'otif', kind: 'KPI', title: 'OTIF (On Time In Full): Definition and How to Manage It' },
      { slug: 'inventory-turnover', kind: 'KPI', title: 'Inventory turnover: how to calculate and read it' },
    ],
  },
  'supply-chain-audit': {
    short: 'Supply chain audit',
    h1a: 'Supply Chain Audit: ', h1b: 'The Two-Week Health Check',
    facts: [{ b: '2 weeks', s: 'fixed scope, from forecast to delivery' }, { b: 'From CHF 8,500', s: 'fixed price' }, { b: 'Top 3 priorities', s: 'ranked by P&L impact' }],
    bookQ: 'Is the Health Check the right next step?',
    model: { decision: 'Each recommendation states who must decide.', execution: 'And who must execute it.' },
    related: [
      { slug: 'supply-chain-kpis-dashboard', kind: 'KPI', title: 'Supply chain KPIs: building your dashboard' },
      { slug: 'supply-chain-consultant', kind: 'Guide', title: 'Supply Chain Consultant: When and Why to Hire One' },
      { slug: 'what-is-sop', kind: 'Guide', title: 'What Is S&OP? Definition and 5-Step Cycle' },
    ],
    offer: true,
  },
}
