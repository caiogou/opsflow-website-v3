// Content for the new EN site structure (Behrad's 9-page map, 07/10/2026).
// Rules: no em/en dashes, US spelling, only the 3 approved prices, no invented numbers, people or clients.
// Case copy is taken verbatim from qa/CASOS_BEHRAD_SECAO_HOME_07OUT.md (checked against the sources on 07/10/2026).

export const BASE = 'https://www.opsflow-advisory.ch'
export const CONTACT_EMAIL = 'caio@opsflow-advisory.ch'
export const LOCATION = 'Nyon, Switzerland'

export type PageMeta = { path: string; title: string; description: string; name: string }

export const PAGE_META: Record<'howWeWork' | 'caseStudies' | 'whoWeHelp' | 'about' | 'contact' | 'solutions', PageMeta> = {
  solutions: {
    path: '/en/services', name: 'Solutions',
    title: 'Supply Chain Solutions for Growing SMEs | OpsFlow',
    description: 'S&OP consulting, inventory optimization, supply chain risk, distribution planning and a two-week Supply Chain Health Check for growing SMEs.',
  },
  howWeWork: {
    path: '/en/how-we-work', name: 'How we work',
    title: 'How We Work: From First Session to Follow-Through',
    description: 'Three steps: a free 45-minute session, a two-week Supply Chain Health Check from CHF 8,500, then strategy with senior follow-through.',
  },
  caseStudies: {
    path: '/en/case-studies', name: 'Case studies',
    title: 'Supply Chain Case Studies: Results and Lessons',
    description: 'What better supply chain systems deliver: results from our partners’ past roles and published market examples, with the source for each.',
  },
  whoWeHelp: {
    path: '/en/who-we-help', name: 'Who we help',
    title: 'Who We Help: Growing Manufacturing and Distribution SMEs',
    description: 'Supply chain advisory for growing manufacturing and distribution SMEs across Europe: S&OP/IBP, supply planning, order management and logistics.',
  },
  about: {
    path: '/en/about', name: 'About',
    title: 'About OpsFlow Advisory: Supply Chain Advisory in Nyon',
    description: 'OpsFlow Advisory is a Swiss supply chain advisory in Nyon. Embedded leadership, not an embedded team. Built by people, AI-assisted.',
  },
  contact: {
    path: '/en/contact', name: 'Contact',
    title: 'Contact OpsFlow Advisory: Book a Free 45-Minute Session',
    description: 'Talk to OpsFlow Advisory in Nyon, Switzerland. Book a free 45-minute session, no commitment, or email caio@opsflow-advisory.ch.',
  },
}

/** BreadcrumbList JSON-LD: Home > page. */
export function breadcrumbLd(meta: PageMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/en` },
      { '@type': 'ListItem', position: 2, name: meta.name, item: `${BASE}${meta.path}` },
    ],
  }
}

export function pageMetadata(meta: PageMeta) {
  const url = `${BASE}${meta.path}`
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: { title: meta.title, description: meta.description, url, siteName: 'OpsFlow Advisory', type: 'website' as const },
  }
}

/* ───────────── Offer ladder (the only prices allowed) ───────────── */

export type OfferStep = { num: string; title: string; price: string; desc: string; href?: string; linkLabel?: string }

export const OFFER_STEPS: OfferStep[] = [
  {
    num: '1', title: 'Free 45-minute session', price: 'Free, no commitment.',
    desc: 'A structured conversation about your supply chain. You leave with a clear view of your top priorities, whether we work together or not.',
  },
  {
    num: '2', title: 'Supply Chain Health Check', price: 'Two weeks, fixed price. From CHF 8,500.',
    desc: 'A structured two-week review of your supply chain, based on your own data and interviews with your team. You get your top 3 priorities ranked by P&L impact, a 90-day plan and an executive summary for your leadership team.',
    href: '/en/services/supply-chain-audit', linkLabel: 'About the Supply Chain Health Check',
  },
  {
    num: '3', title: 'Strategy and senior follow-through', price: 'CHF 22,000 to 80,000 depending on scope.',
    desc: 'We build the strategy and the plan with you. A senior practitioner then oversees execution with your team, month by month: regular calls, KPI tracking and plan adjustments to keep it on track.',
  },
]

/* ───────────── How we work ───────────── */

export const HOW_WE_WORK = {
  rubric: 'How we work',
  h1: 'From first conversation to measurable results',
  intro: 'Three steps, a clear scope at each one, and no open-ended engagements. Embedded leadership, not an embedded team.',
  followThrough: {
    h2: 'Senior follow-through, month by month',
    paragraphs: [
      'A plan only creates value when it is executed. That is why our work does not stop at the recommendations.',
      'Your team runs the work and keeps ownership. A senior practitioner stays involved month by month: reviewing progress against the plan, tracking the KPIs that matter and adjusting priorities when reality changes.',
    ],
    points: [
      'Regular calls with your team, at a set rhythm',
      'KPI tracking against the 90-day plan',
      'Plan adjustments when demand, supply or priorities change',
      'Your people build the capability; we do not place a team inside your company',
    ],
  },
  ai: {
    h2: 'Built by people, AI-assisted.',
    paragraphs: [
      'We use AI tools to speed up the analysis: reading your data, running diagnostics and testing scenarios. That leaves more time for the conversations and decisions that matter.',
      'Judgment and recommendations stay with senior people. AI-assisted, senior-decided.',
    ],
  },
  selfAssessment: {
    h2: 'Not ready to talk yet?',
    text: 'Take the free S&OP Self-Assessment: 32 questions, about 12 minutes, with a maturity profile at the end.',
    cta: 'Take the free S&OP Self-Assessment',
  },
  faq: [
    {
      q: 'Is the first session really free?',
      a: 'Yes. The first session lasts 45 minutes and is free, with no commitment.',
    },
    {
      q: 'What do we get from the Supply Chain Health Check?',
      a: 'In two weeks, at a fixed price from CHF 8,500, you get your top 3 priorities ranked by P&L impact, a 90-day plan and an executive summary.',
    },
    {
      q: 'What does strategy and senior follow-through cost?',
      a: 'CHF 22,000 to 80,000 depending on scope. A senior practitioner oversees execution with your team, month by month.',
    },
    {
      q: 'Do you place a team inside our company?',
      a: 'No. We offer embedded leadership, not an embedded team. Your people run the work, and a senior practitioner guides it and follows it through.',
    },
  ],
}

/* ───────────── Case studies ───────────── */

export type OwnCase = { title: string; problem: string; intervention: string; result: string; setup: string }
export type MarketCase = { title: string; changed: string; results: string; lesson: string; sourceLabel: string; sourceUrl: string }

export const CASES = {
  rubric: 'Case studies',
  h1: 'What better supply chain systems deliver',
  intro: 'Three ways to look at the same question: what our partners delivered before OpsFlow, what large companies have published, and how we apply the same principles to growing companies.',
  tabs: [
    { id: 'our-experience', label: 'Our experience', desc: 'Results our partners delivered as senior supply chain professionals, before OpsFlow.' },
    { id: 'market-proof', label: 'Market proof', desc: 'Published results from large companies, with the source.' },
    { id: 'opsflow-approach', label: 'The OpsFlow approach', desc: 'How we apply the same principles to growing companies.' },
  ],
  ownNote: 'Anonymized. These results were delivered by our partners in previous roles, not by OpsFlow.',
  own: [
    {
      title: 'Inventory and planning visibility',
      problem: 'Planners spent much of their time reconciling fragmented data and reports. Inventory risks surfaced late, and real supply issues were hard to tell apart from data or planning errors.',
      intervention: 'One central Power BI report for planning, inventory and supply. The team moved from investigating issues by hand to managing exceptions on a shared data set.',
      result: 'About USD 2 million in annual savings, fewer expedited shipments, less supply chain waste, and better visibility for planners and decision makers.',
      setup: 'A connected planning and inventory dashboard with automated exception management.',
    },
    {
      title: 'Supplier lead time and cost',
      problem: 'A supplier process took about six months, tying up working capital and slowing the response to changes in demand.',
      intervention: 'The supplier process was redesigned: closer collaboration with the supplier, better planning, and a clearer way to communicate and manage requirements.',
      result: 'Lead time cut from about six months to about one month, annual supplier cost down about 10%, more flexibility to follow demand, and lower supply risk.',
      setup: 'Supplier segmentation, lead time analysis, planning parameters, and a supplier review that tracks cost, lead time and service.',
    },
    {
      title: 'Slow-moving inventory',
      problem: 'A large EMEA inventory base held significant slow-moving stock. Products differed in demand patterns, lead times and supply constraints, so one rule could not fit all.',
      intervention: 'Inventory was segmented and the planning approach was adjusted to demand, supply risk and product characteristics, so planners focused on the stock that needed action.',
      result: 'About 20% less slow-moving inventory, healthier inventory, better use of working capital, and a more focused planner workload.',
      setup: 'Inventory segmentation, planning parameters, an exception dashboard, and a recurring inventory review.',
    },
  ] as OwnCase[],
  marketH2: 'What happens when supply chains work better',
  marketIntro: 'Real-world examples of how changes in planning, data, inventory management and supply chain processes can create measurable business impact.',
  market: [
    {
      title: 'GE Power: connecting demand and supply planning',
      changed: 'Consolidated 15 demand forecasting tools into one planning environment, replacing fragmented forecasting with a connected approach to demand, supply and capacity planning.',
      results: 'Forecast cycle cut from more than 5 days to half a day. Forecast accuracy up from 55% to 70%. Spreadsheet work virtually eliminated.',
      lesson: 'Connecting data, process and decision making can make planning much faster and better.',
      sourceLabel: 'Oracle customer story: GE Power',
      sourceUrl: 'https://www.oracle.com/customers/ge-power-scm-long/',
    },
    {
      title: 'ASC Engineered Solutions: better forecasting and inventory',
      changed: 'Facing forecasting, safety stock and inventory visibility issues, the company introduced automated demand planning, fulfillment and inventory optimization.',
      results: 'Forecast accuracy up 10 percentage points. Inventory down 15% in the first year. OTIF up 15 percentage points. Annual spend down 5%.',
      lesson: 'Better forecasting and inventory optimization can improve customer service and working capital at the same time.',
      sourceLabel: 'Blue Yonder customer story: ASC Engineered Solutions',
      sourceUrl: 'https://blueyonder.com/customers/asc-engineered-solutions',
    },
    {
      title: 'Mahindra & Mahindra: moving beyond manual planning',
      changed: 'The spares business unit of Mahindra & Mahindra Farm Equipment managed 100,000 SKUs across 21 distribution centers with manual analysis and Excel. It introduced integrated planning and inventory optimization.',
      results: 'Revenue up 10%. Customer response time down 40%. Service level up 10%.',
      lesson: 'As complexity grows, manual planning becomes a constraint. Integrated planning gives the visibility needed for faster, better decisions.',
      sourceLabel: 'Blue Yonder customer story: Mahindra & Mahindra',
      sourceUrl: 'https://blueyonder.com/customers/mahindra-and-mahindra',
    },
    {
      title: 'Positec: from fragmented planning to a connected supply chain',
      changed: 'The global power tool maker had no aggregate forecasting, long replenishment planning cycles and low visibility. It replaced manual planning and reporting with automation and connected planning.',
      results: 'Global inventory down about 60%. Safety stock down 75% (from 150 to 35 days). Forecast accuracy up 40%. On-time delivery up 20% on average. Order fulfillment lead time from 90 to 30 days.',
      lesson: 'Connecting planning processes and data can raise service levels while cutting inventory and planning effort.',
      sourceLabel: 'Blue Yonder customer story: Positec',
      sourceUrl: 'https://blueyonder.com/customers/positec',
    },
    {
      title: 'Dole Food & Beverage Group: integrating planning and S&OP',
      changed: 'A broader transformation combining demand planning, supply planning, factory planning, S&OP and analytics, connecting people, process and technology.',
      results: 'Inventory down 40% in 18 months. Fill rates above 95% in all key markets. Higher forecast accuracy.',
      lesson: 'Lasting improvement comes from connecting people, process and technology for faster, better-informed decisions.',
      sourceLabel: 'Blue Yonder customer story: Dole Food & Beverage Group',
      sourceUrl: 'https://blueyonder.com/customers/dole-food-and-beverage-group',
    },
  ] as MarketCase[],
  marketNote: 'These examples are based on publicly available customer case studies published by Oracle and Blue Yonder. They are shown for illustration and are not OpsFlow client engagements.',
  approachH2: 'The OpsFlow approach',
  approachIntro: 'How we apply the same principles to growing companies. For each situation above, this is what OpsFlow would set up.',
}

/* ───────────── Who we help ───────────── */

export const WHO_WE_HELP = {
  rubric: 'Who we help',
  h1: 'Supply chain advisory for growing SMEs',
  // TODO Caio/Behrad: replace with the confirmed profile.
  // Placeholder from the brief: "[confirm with partners: revenue range and key industries]"
  profile: 'Growing manufacturing and distribution SMEs across Europe.',
  intro: 'Companies whose growth has outpaced the way they plan, buy, store and deliver. We help leadership teams put structure into S&OP/IBP, supply planning, order management and logistics, and then follow it through.',
  signalsH2: 'Signs it is time to talk',
  signals: [
    'Sales, operations and finance work from different numbers.',
    'Planners spend more time reconciling data and reports than planning.',
    'Inventory keeps growing, yet service levels do not improve.',
    'Slow-moving stock ties up working capital.',
    'Supplier lead times are long and hard to predict.',
    'Late or incomplete orders, and expediting has become routine.',
    'New markets, channels or sites are adding complexity faster than your processes can absorb it.',
  ],
  areasH2: 'What we work on',
  areas: [
    { title: 'S&OP and IBP', desc: 'One monthly cycle where demand, supply and finance agree on a single plan.', href: '/en/services/s-op-consulting' },
    { title: 'Supply planning and inventory', desc: 'Planning parameters, segmentation and inventory policies that free up working capital.', href: '/en/services/inventory-optimization' },
    { title: 'Order management and logistics', desc: 'Distribution planning that serves customers at the right cost.', href: '/en/services/distribution-planning' },
    { title: 'Supply risk', desc: 'Seeing supply disruptions coming instead of suffering them.', href: '/en/services/supply-chain-risk-management' },
  ],
  rolesH2: 'Who we usually talk to',
  roles: [
    'CEOs and managing directors who want a reliable plan behind their growth.',
    'COOs and supply chain leaders who need senior support without hiring a team.',
    'CFOs who want working capital and service under control at the same time.',
  ],
}

/* ───────────── About ───────────── */

export const ABOUT = {
  rubric: 'About',
  h1: 'About OpsFlow Advisory',
  positioning: 'Embedded leadership, not an embedded team.',
  paragraphs: [
    'OpsFlow Advisory is a Swiss supply chain advisory based in Nyon, Switzerland. We work with growing manufacturing and distribution SMEs across Europe on S&OP/IBP, supply planning, order management and logistics.',
    'We build the strategy and the plan with your leadership team, then a senior practitioner follows the execution month by month. Your people run the work and keep the capability.',
  ],
  tagline: 'Built by people, AI-assisted.',
  approachH2: 'Our approach',
  approach: [
    { title: 'Strategy first', desc: 'We start from your data and your business goals, then rank priorities by P&L impact.' },
    { title: 'Senior follow-through', desc: 'A senior practitioner oversees execution with your team, month by month, until the plan delivers.' },
    { title: 'Your team stays in charge', desc: 'Embedded leadership, not an embedded team. Your people run the process and build the capability.' },
    { title: 'AI-assisted, senior-decided', desc: 'AI tools speed up the analysis. Judgment and recommendations stay with senior people.' },
  ],
  experienceH2: 'Experience',
  experience: 'Our partners worked as senior supply chain professionals in large companies before founding OpsFlow. Some of the results they delivered there are on our case studies page.',
  experienceLink: 'See the case studies',
}

/* ───────────── Contact ───────────── */

export const CONTACT = {
  rubric: 'Contact',
  h1: 'Talk to us',
  intro: 'The first conversation is a free 45-minute session about your supply chain. Free, no commitment.',
  bookCta: 'Book a free 45-minute session',
  emailLabel: 'Email',
  locationLabel: 'Location',
  healthCheck: {
    h2: 'Supply Chain Health Check',
    text: 'Two weeks, fixed price, from CHF 8,500. Your top 3 priorities ranked by P&L impact, a 90-day plan and an executive summary.',
    link: 'How the Health Check works',
    href: '/en/services/supply-chain-audit',
  },
  selfAssessment: {
    h2: 'Free S&OP Self-Assessment',
    text: '32 questions, about 12 minutes. A first view of your S&OP maturity before we talk.',
    cta: 'Take the free S&OP Self-Assessment',
  },
}
