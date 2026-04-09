'use client'

import { useState, useMemo } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts'
import {
  ChevronRight, ChevronLeft, CheckCircle, AlertTriangle,
  Target, ArrowRight, BarChart3, Shield, Network, Cpu,
  ClipboardCheck, TrendingUp, Package, Mail, Building2, User, Briefcase
} from 'lucide-react'
// Logo inline — no external component needed

/* ──────────────────── DATA ──────────────────── */

const DIMENSIONS = [
  {
    id: 'sop_governance',
    name: 'S&OP Process & Governance',
    shortName: 'S&OP',
    practice: 'Practice 1 — Planning Excellence',
    service: 'IBP / S&OP Diagnostic & Redesign',
    price: 'CHF 28–42K',
    description: 'Evaluates formality, cadence, cross-functional participation, and decision-making authority of S&OP/IBP.',
    questions: [
      {
        q: 'How would you describe your S&OP / IBP process today?',
        options: [
          { text: 'No formal process — decisions are ad hoc', score: 1 },
          { text: 'Basic monthly meeting exists but attendance and agenda vary', score: 2 },
          { text: 'Defined cadence with regular attendees, but limited decision authority', score: 3 },
          { text: 'Structured drumbeat with clear forums, decision rights, and escalation path', score: 4 },
          { text: 'Integrated IBP with financial reconciliation, scenario planning, and executive ownership', score: 5 },
        ],
      },
      {
        q: 'Who owns the S&OP process?',
        options: [
          { text: 'No one — or unclear ownership', score: 1 },
          { text: 'Supply Chain / Operations manager runs it informally', score: 2 },
          { text: 'Dedicated planner or coordinator with limited authority', score: 3 },
          { text: 'Senior leader (VP/Director) with cross-functional mandate', score: 4 },
          { text: 'C-level sponsor with clear governance charter', score: 5 },
        ],
      },
      {
        q: 'How are demand-supply trade-off decisions made?',
        options: [
          { text: 'Whoever shouts loudest — no structured process', score: 1 },
          { text: 'Sales and Operations negotiate bilaterally', score: 2 },
          { text: 'Monthly meeting reviews gaps but decisions often deferred', score: 3 },
          { text: 'Defined decision forums with pre-work, options, and clear owners', score: 4 },
          { text: 'Scenario-based decisions with P&L impact quantified before the meeting', score: 5 },
        ],
      },
      {
        q: 'How far out does your planning horizon extend?',
        options: [
          { text: 'Days to 1 week — reactive firefighting', score: 1 },
          { text: '1–3 months — near-term only', score: 2 },
          { text: '3–6 months — some forward visibility', score: 3 },
          { text: '6–18 months — rolling plan with strategic component', score: 4 },
          { text: '18–36 months — integrated with business planning cycle', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'demand_planning',
    name: 'Demand Planning',
    shortName: 'Demand',
    practice: 'Practice 1 — Planning Excellence',
    service: 'Inventory & Demand Optimization',
    price: 'CHF 22–32K',
    description: 'Assesses demand forecasting methodology, accuracy tracking, and collaboration with commercial teams.',
    questions: [
      {
        q: 'How do you generate your demand forecast?',
        options: [
          { text: 'No formal forecast — production reacts to orders', score: 1 },
          { text: 'Sales team provides estimates, often subjective', score: 2 },
          { text: 'Statistical baseline exists but is rarely challenged or enriched', score: 3 },
          { text: 'Statistical + market intelligence with structured consensus process', score: 4 },
          { text: 'Advanced methods (ML/segmented) with demand sensing and continuous improvement', score: 5 },
        ],
      },
      {
        q: 'Do you measure forecast accuracy?',
        options: [
          { text: "No — we don't track it", score: 1 },
          { text: "We know it's bad but don't measure formally", score: 2 },
          { text: 'Measured monthly at aggregate level', score: 3 },
          { text: 'Measured by SKU/family with bias and error decomposition', score: 4 },
          { text: 'Accuracy drives accountability — root causes are acted upon weekly', score: 5 },
        ],
      },
      {
        q: 'How is demand segmented (e.g., ABC/XYZ)?',
        options: [
          { text: 'No segmentation — all SKUs treated equally', score: 1 },
          { text: 'Basic Pareto / ABC by revenue', score: 2 },
          { text: 'ABC/XYZ matrix exists but not used to differentiate planning approach', score: 3 },
          { text: 'Segmentation drives differentiated service levels, safety stock, and review frequency', score: 4 },
          { text: 'Dynamic segmentation with periodic refresh and full planning policy differentiation', score: 5 },
        ],
      },
      {
        q: 'How do commercial teams contribute to demand planning?',
        options: [
          { text: 'They don\'t — planning and sales work in silos', score: 1 },
          { text: 'Sales provides ad hoc input when asked', score: 2 },
          { text: 'Monthly demand review meeting exists but commercial input is unreliable', score: 3 },
          { text: 'Structured Demand Review with documented assumptions and commercial sign-off', score: 4 },
          { text: 'Cross-functional demand consensus with promotions, NPIs, and market events built in', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'supply_planning',
    name: 'Supply Planning & Execution',
    shortName: 'Supply',
    practice: 'Practice 1 — Planning Excellence',
    service: 'APS Health Check & Rescue',
    price: 'CHF 18–26K',
    description: 'Evaluates supply planning tools, constraint management, and the link between planning and execution.',
    questions: [
      {
        q: 'What tools do you use for supply/production planning?',
        options: [
          { text: 'Spreadsheets and manual scheduling', score: 1 },
          { text: 'Basic MRP in ERP but heavily overridden manually', score: 2 },
          { text: 'MRP runs with some parameter governance, occasional manual adjustments', score: 3 },
          { text: 'APS/IBP system with configured constraints and regular master data review', score: 4 },
          { text: 'Integrated APS with two-layer design — system team maintains, business decides', score: 5 },
        ],
      },
      {
        q: 'How do you handle planning constraints (capacity, materials, lead times)?',
        options: [
          { text: "No formal constraint modelling — planners manage in their heads", score: 1 },
          { text: 'Key constraints known but not modelled — addressed when problems occur', score: 2 },
          { text: 'Main constraints modelled in system but rarely updated or challenged', score: 3 },
          { text: 'Constraints actively maintained and simplified — only those that drive decisions are kept', score: 4 },
          { text: 'Continuous constraint review with clear ownership — complexity reduced systematically', score: 5 },
        ],
      },
      {
        q: 'How well does planning translate into execution?',
        options: [
          { text: 'Plan and execution are disconnected — shop floor does its own thing', score: 1 },
          { text: 'Plan exists but is often overridden by urgent orders or production preferences', score: 2 },
          { text: 'Plan adherence is tracked but root causes of deviations are not addressed', score: 3 },
          { text: 'Schedule adherence >85% with structured exception management', score: 4 },
          { text: 'Closed-loop: execution feeds back to planning, deviations trigger systematic improvement', score: 5 },
        ],
      },
      {
        q: 'Do your planners trust the system-generated plan?',
        options: [
          { text: 'No — they override nearly everything', score: 1 },
          { text: 'Partially — they use it as a starting point but rebuild most of it', score: 2 },
          { text: 'Mostly — but key product families still require heavy manual adjustment', score: 3 },
          { text: 'Yes — exceptions are limited to genuinely unusual situations', score: 4 },
          { text: 'High trust — planners focus on exceptions and decisions, not recalculating the plan', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory & Working Capital',
    shortName: 'Inventory',
    practice: 'Practice 1 — Planning Excellence',
    service: 'Inventory & Demand Optimization',
    price: 'CHF 22–32K',
    description: 'Assesses inventory strategy, safety stock logic, and working capital visibility.',
    questions: [
      {
        q: 'How is your safety stock determined?',
        options: [
          { text: "No formal safety stock — we stock what we can or what fits", score: 1 },
          { text: 'Fixed quantities based on historical guesses or rules of thumb', score: 2 },
          { text: 'Calculated but not differentiated by SKU segment or service level target', score: 3 },
          { text: 'Statistically calculated by segment with defined service level targets', score: 4 },
          { text: 'Dynamic safety stock with regular refresh, tied to demand variability and supply reliability', score: 5 },
        ],
      },
      {
        q: 'Do you experience simultaneous stockouts AND excess inventory?',
        options: [
          { text: "Yes, constantly — it's our biggest frustration", score: 1 },
          { text: 'Frequently — different product families, same warehouse', score: 2 },
          { text: "Sometimes — we're aware of it but haven't fixed the root cause", score: 3 },
          { text: "Occasionally — we've addressed the worst cases through segmentation", score: 4 },
          { text: 'Rarely — our inventory policy is well-calibrated and reviewed regularly', score: 5 },
        ],
      },
      {
        q: 'How visible is inventory performance to your CFO / Finance?',
        options: [
          { text: "Not visible — finance doesn't track inventory at SKU level", score: 1 },
          { text: 'Monthly inventory value reported but no root cause analysis', score: 2 },
          { text: 'Days of supply and turns reported but not linked to planning decisions', score: 3 },
          { text: 'Working capital reviews include inventory segmentation and targets', score: 4 },
          { text: 'Inventory is a strategic KPI — CFO and COO jointly review performance monthly', score: 5 },
        ],
      },
      {
        q: 'Do you have a formal slow-mover / obsolescence management process?',
        options: [
          { text: 'No — we discover obsolete stock during physical counts', score: 1 },
          { text: "We know what's aging but don't have a structured disposition process", score: 2 },
          { text: 'Quarterly review exists but write-offs are reactive', score: 3 },
          { text: 'Proactive identification with defined triggers and disposition paths', score: 4 },
          { text: 'Integrated into S&OP — slow movers flagged early, NPI/EOL managed through lifecycle planning', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'kpis',
    name: 'KPIs & Performance',
    shortName: 'KPIs',
    practice: 'Practice 1 — Planning Excellence',
    service: 'Planning KPI Dashboard',
    price: 'CHF 14–18K',
    description: 'Evaluates SC performance measurement maturity, operational rhythm, and root cause discipline.',
    questions: [
      {
        q: 'Do you have a supply chain KPI scorecard?',
        options: [
          { text: 'No — we track issues reactively when they become visible', score: 1 },
          { text: 'A few metrics exist (e.g., OTD) but not in a structured scorecard', score: 2 },
          { text: 'Scorecard exists but is reviewed inconsistently and not acted upon', score: 3 },
          { text: 'Balanced scorecard with service, cost, inventory, and planning KPIs reviewed weekly/monthly', score: 4 },
          { text: 'KPIs drive actions — root causes are identified, owners assigned, and improvements tracked', score: 5 },
        ],
      },
      {
        q: 'How do you define and measure service level?',
        options: [
          { text: "We don't measure it formally", score: 1 },
          { text: 'We track on-time delivery at aggregate level', score: 2 },
          { text: 'OTIF measured by customer or product group but targets not differentiated', score: 3 },
          { text: 'OTIF by segment with differentiated targets and root cause analysis on misses', score: 4 },
          { text: 'Service levels contractually defined, measured against SLAs, and tied to inventory/planning decisions', score: 5 },
        ],
      },
      {
        q: 'Do you have an operational rhythm (weekly/monthly review cadence)?',
        options: [
          { text: 'No structured cadence — meetings happen when problems arise', score: 1 },
          { text: 'Weekly production meetings exist but focus on firefighting', score: 2 },
          { text: 'Weekly ops review + monthly S&OP but not well connected', score: 3 },
          { text: 'Integrated cadence: daily/weekly execution → monthly S&OP → quarterly business review', score: 4 },
          { text: 'Layered cadence with clear escalation, pre-work discipline, and decision tracking', score: 5 },
        ],
      },
      {
        q: 'How mature is your root cause analysis discipline?',
        options: [
          { text: "We don't do root cause analysis — problems recur", score: 1 },
          { text: 'Informal — someone investigates when there is a major issue', score: 2 },
          { text: 'Some structured analysis but findings are not systematically tracked or closed', score: 3 },
          { text: 'Formal RCA process for top issues with corrective actions and follow-up', score: 4 },
          { text: 'Continuous improvement culture — RCA embedded in ops rhythm, Pareto-driven, actions closed within cycle', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'supply_risk',
    name: 'Supply Risk & Resilience',
    shortName: 'Risk',
    practice: 'Practice 2 — Supply Resilience',
    service: 'Supply Risk Assessment & Roadmap',
    price: 'CHF 22–30K',
    description: 'Evaluates supply base visibility, risk identification, and mitigation strategies.',
    questions: [
      {
        q: 'Do you know which of your suppliers are single-source?',
        options: [
          { text: "No — we haven't mapped it", score: 1 },
          { text: "We know the obvious ones but haven't done a systematic review", score: 2 },
          { text: 'Mapped for direct materials but not for Tier 2 or critical components', score: 3 },
          { text: 'Full single-source mapping with criticality scoring and dual-source roadmap', score: 4 },
          { text: 'Dynamic risk dashboard covering Tier 1+2 with automated alerts and mitigation plans', score: 5 },
        ],
      },
      {
        q: 'Have you experienced a significant supply disruption in the last 12 months?',
        options: [
          { text: 'Yes, and we had no contingency — significant revenue impact', score: 1 },
          { text: 'Yes, and we managed reactively — it was painful and costly', score: 2 },
          { text: 'Yes, but we had partial mitigation in place (buffer stock, alternative source)', score: 3 },
          { text: 'Minor disruptions only — our mitigation plans worked as designed', score: 4 },
          { text: 'We stress-test our supply base regularly and disruptions are managed within tolerance', score: 5 },
        ],
      },
      {
        q: 'How do you assess and monitor supplier risk?',
        options: [
          { text: "We don't — we react when problems happen", score: 1 },
          { text: "Informal knowledge in procurement team's heads", score: 2 },
          { text: 'Annual supplier reviews but focused on cost, not risk', score: 3 },
          { text: 'Structured risk scoring (financial, operational, geopolitical) with periodic review', score: 4 },
          { text: 'Continuous monitoring with early warning indicators and scenario-based mitigation plans', score: 5 },
        ],
      },
      {
        q: 'Do you have a formal dual-sourcing or diversification strategy?',
        options: [
          { text: 'No — we typically buy from whoever is cheapest', score: 1 },
          { text: "We've discussed it but haven't acted", score: 2 },
          { text: 'Some categories have backup suppliers but not formally managed', score: 3 },
          { text: 'Dual-sourcing strategy for critical categories with defined split ratios', score: 4 },
          { text: 'Strategic sourcing framework with risk-adjusted total cost, regional diversification, and regular market scans', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'network',
    name: 'Network & Footprint',
    shortName: 'Network',
    practice: 'Practice 3 — Network & Footprint',
    service: 'SC Network Design & Optimization',
    price: 'CHF 45–80K',
    description: 'Evaluates network complexity awareness, cost-to-serve visibility, and footprint strategy.',
    questions: [
      {
        q: 'How well do you understand your end-to-end cost-to-serve?',
        options: [
          { text: "We don't have visibility — costs are allocated at aggregate level", score: 1 },
          { text: 'We know production costs but logistics and warehousing are unclear', score: 2 },
          { text: 'Cost-to-serve estimated by region/channel but based on allocations, not activity-based', score: 3 },
          { text: 'Activity-based cost-to-serve by product family and customer segment', score: 4 },
          { text: 'Full cost-to-serve model used to drive pricing, network, and customer profitability decisions', score: 5 },
        ],
      },
      {
        q: 'When was the last time you reviewed your manufacturing/warehouse footprint?',
        options: [
          { text: 'Never — it evolved organically or through M&A', score: 1 },
          { text: 'More than 5 years ago', score: 2 },
          { text: '3–5 years ago with limited scope', score: 3 },
          { text: 'Within last 2 years with scenario analysis', score: 4 },
          { text: 'Continuous — network optimization is part of strategic planning cycle', score: 5 },
        ],
      },
      {
        q: 'How complex is your supply chain network?',
        options: [
          { text: 'Single site, simple — but growing and unsure how to scale', score: 2 },
          { text: '2–3 sites, some cross-shipments, complexity emerging', score: 3 },
          { text: 'Multi-site, multi-country with significant cross-border flows', score: 4 },
          { text: 'Highly complex — post-M&A, overlapping footprints, redundant capacity', score: 4 },
          { text: 'Complex but well-understood — network decisions are data-driven and scenario-tested', score: 5 },
        ],
      },
      {
        q: 'Have you evaluated make-vs-buy or insource-vs-outsource for key products?',
        options: [
          { text: "No — we do what we've always done", score: 1 },
          { text: 'Discussed informally but no structured analysis', score: 2 },
          { text: 'Done for a few items but not with a total cost model', score: 3 },
          { text: 'Structured make-vs-buy analysis for key categories with total cost and risk factors', score: 4 },
          { text: 'Regular portfolio review with outsourcing strategy aligned to capacity and market dynamics', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'technology',
    name: 'Technology & Data',
    shortName: 'Technology',
    practice: 'Cross-cutting',
    service: 'APS Health Check & Rescue',
    price: 'CHF 18–26K',
    description: 'Assesses the IT/data infrastructure supporting planning — ERP, APS, data quality, and analytics.',
    questions: [
      {
        q: 'What is your primary planning system?',
        options: [
          { text: 'Spreadsheets (Excel/Google Sheets)', score: 1 },
          { text: 'Basic ERP with MRP but no APS', score: 2 },
          { text: 'ERP + bolt-on planning tool or partially implemented APS', score: 3 },
          { text: 'Fully implemented APS (SAP IBP, Kinaxis, o9, etc.) with trained users', score: 4 },
          { text: 'Integrated digital planning platform with analytics, scenario modelling, and control tower', score: 5 },
        ],
      },
      {
        q: 'How would you rate your master data quality?',
        options: [
          { text: 'Poor — BOMs, lead times, and parameters are unreliable', score: 1 },
          { text: 'Inconsistent — some product families are clean, others are a mess', score: 2 },
          { text: 'Adequate — periodic clean-ups happen but no ongoing governance', score: 3 },
          { text: 'Good — data stewards assigned, regular audits, KPIs on data quality', score: 4 },
          { text: 'Excellent — automated validation, continuous monitoring, master data treated as strategic asset', score: 5 },
        ],
      },
      {
        q: 'How accessible is supply chain data for analysis and decision-making?',
        options: [
          { text: 'Data is locked in ERP — extracting insights requires IT involvement every time', score: 1 },
          { text: 'Some reports exist but they are static and often outdated', score: 2 },
          { text: 'BI/reporting layer exists but SC team uses it inconsistently', score: 3 },
          { text: 'Self-service analytics with live dashboards for key SC metrics', score: 4 },
          { text: 'Advanced analytics with predictive capabilities — data drives proactive decisions', score: 5 },
        ],
      },
      {
        q: "Is there a clear separation between 'business planning' and 'system/technical planning' roles?",
        options: [
          { text: 'No — planners do everything: data maintenance, system config, and business planning', score: 1 },
          { text: 'Planners are mostly stuck maintaining the system rather than making business decisions', score: 2 },
          { text: 'Some separation exists but boundaries are unclear — planners still fix data issues daily', score: 3 },
          { text: 'Clear two-layer design: business planners decide, technical team maintains system and data', score: 4 },
          { text: 'Mature operating model: Layer 1 (business decisions) fully separated from Layer 2 (system execution)', score: 5 },
        ],
      },
    ],
  },
]

const MATURITY_LABELS: Record<number, string> = {
  1: 'Reactive',
  2: 'Emerging',
  3: 'Defined',
  4: 'Managed',
  5: 'Leading',
}

const MATURITY_COLORS: Record<number, string> = {
  1: '#EF4444',
  2: '#F97316',
  3: '#EAB308',
  4: '#1a9e8f',
  5: '#0EA5E9',
}

/* ──────────────────── COMPONENT ──────────────────── */

export default function DiagnosticPage() {
  const [screen, setScreen] = useState<'welcome' | 'assessment' | 'gate' | 'results'>('welcome')
  const [currentDim, setCurrentDim] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [companyName, setCompanyName] = useState('')
  const [respondentName, setRespondentName] = useState('')
  const [respondentRole, setRespondentRole] = useState('')
  const [email, setEmail] = useState('')
  const [industry, setIndustry] = useState('')
  const [revenue, setRevenue] = useState('')

  const totalQuestions = DIMENSIONS.reduce((s, d) => s + d.questions.length, 0)
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / totalQuestions) * 100

  const scores = useMemo(() => {
    return DIMENSIONS.map((dim) => {
      const dimAnswers = dim.questions
        .map((_, qi) => answers[`${dim.id}_${qi}`])
        .filter(Boolean)
      if (dimAnswers.length === 0) return { ...dim, score: 0, avg: 0, level: 'N/A' }
      const avg = dimAnswers.reduce((s, a) => s + a, 0) / dim.questions.length
      const rounded = Math.round(avg * 10) / 10
      const level = MATURITY_LABELS[Math.round(avg)] || 'N/A'
      return { ...dim, score: rounded, avg, level }
    })
  }, [answers])

  const overallScore = useMemo(() => {
    const valid = scores.filter((s) => s.score > 0)
    if (valid.length === 0) return 0
    return Math.round((valid.reduce((s, d) => s + d.score, 0) / valid.length) * 10) / 10
  }, [scores])

  const handleAnswer = (score: number) => {
    const key = `${DIMENSIONS[currentDim].id}_${currentQ}`
    setAnswers((prev) => ({ ...prev, [key]: score }))
    setTimeout(() => {
      if (currentQ < DIMENSIONS[currentDim].questions.length - 1) {
        setCurrentQ(currentQ + 1)
      } else if (currentDim < DIMENSIONS.length - 1) {
        setCurrentDim(currentDim + 1)
        setCurrentQ(0)
      } else {
        setScreen('gate')
      }
    }, 300)
  }

  const goBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1)
    else if (currentDim > 0) {
      setCurrentDim(currentDim - 1)
      setCurrentQ(DIMENSIONS[currentDim - 1].questions.length - 1)
    }
  }

  const selectedAnswer = answers[`${DIMENSIONS[currentDim]?.id}_${currentQ}`]

  /* ─── WELCOME ─── */
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-5">
        <div className="max-w-xl w-full bg-navy-deep/50 rounded-2xl border border-navy-mid p-10 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center">
                <span className="text-white font-bold text-base">OF</span>
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-white tracking-tight">OpsFlow Advisory</div>
                <div className="text-[11px] text-teal-muted tracking-widest uppercase">S&OP Maturity Engine</div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white leading-tight">
              How mature is your <em className="text-teal not-italic">S&OP process</em>?
            </h1>
            <p className="text-teal-muted mt-3 text-sm leading-relaxed max-w-md mx-auto">
              32 questions across 8 dimensions. Takes around 12 minutes. Get AI-powered insights with your personalised maturity profile and automated recommendations.
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-muted/40" />
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name *"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-navy-mid bg-navy/60 text-white text-sm placeholder:text-teal-muted/40 focus:border-teal focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-muted/40" />
                <input
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  placeholder="Your name *"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-navy-mid bg-navy/60 text-white text-sm placeholder:text-teal-muted/40 focus:border-teal focus:outline-none"
                />
              </div>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-muted/40" />
                <input
                  value={respondentRole}
                  onChange={(e) => setRespondentRole(e.target.value)}
                  placeholder="Your role *"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-navy-mid bg-navy/60 text-white text-sm placeholder:text-teal-muted/40 focus:border-teal focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Industry"
                className="w-full px-4 py-3 rounded-lg border border-navy-mid bg-navy/60 text-white text-sm placeholder:text-teal-muted/40 focus:border-teal focus:outline-none"
              />
              <select
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-navy-mid bg-navy/60 text-white text-sm focus:border-teal focus:outline-none"
              >
                <option value="">Annual revenue</option>
                <option value="<5M">Below CHF 5M</option>
                <option value="5-20M">CHF 5M – 20M</option>
                <option value="20-50M">CHF 20M – 50M</option>
                <option value="50-200M">CHF 50M – 200M</option>
                <option value=">200M">Above CHF 200M</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => { if (companyName && respondentName && respondentRole) setScreen('assessment') }}
            disabled={!companyName || !respondentName || !respondentRole}
            className="mt-8 w-full py-3.5 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-colors disabled:opacity-30 disabled:cursor-default flex items-center justify-center gap-2"
          >
            Start Assessment <ChevronRight size={18} />
          </button>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {DIMENSIONS.map((d) => (
              <span key={d.id} className="px-2.5 py-1 rounded-full bg-navy-mid/40 text-teal-muted/60 text-[10px] border border-navy-mid/60">
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ─── ASSESSMENT ─── */
  if (screen === 'assessment') {
    const dim = DIMENSIONS[currentDim]
    const question = dim.questions[currentQ]
    const globalQIndex = DIMENSIONS.slice(0, currentDim).reduce((s, d) => s + d.questions.length, 0) + currentQ + 1

    return (
      <div className="min-h-screen bg-navy">
        {/* Top bar */}
        <div className="px-6 border-b border-navy-mid flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0D9488] flex items-center justify-center"><span className="text-white font-bold text-xs">OF</span></div>
            <span className="text-teal-muted text-xs hidden sm:inline">OpsFlow S&OP Health Check</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-teal-muted/50 text-xs">{answeredCount}/{totalQuestions}</span>
            {answeredCount === totalQuestions && (
              <button
                onClick={() => setScreen('gate')}
                className="px-4 py-1.5 rounded bg-teal text-white text-xs font-semibold hover:bg-teal-light transition-colors"
              >
                View Results
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="h-0.5 bg-navy-mid">
          <div className="h-full bg-teal transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Dimension pills */}
        <div className="px-6 py-3 flex gap-1.5 overflow-x-auto border-b border-navy-mid/50 scrollbar-none">
          {DIMENSIONS.map((d, i) => {
            const complete = d.questions.every((_, qi) => answers[`${d.id}_${qi}`])
            const active = i === currentDim
            return (
              <button
                key={d.id}
                onClick={() => { setCurrentDim(i); setCurrentQ(0) }}
                className={`px-3 py-1.5 rounded text-[11px] whitespace-nowrap border transition-colors flex items-center gap-1 ${
                  active
                    ? 'border-teal bg-teal/10 text-teal font-semibold'
                    : complete
                    ? 'border-teal/20 bg-teal/5 text-teal/70'
                    : 'border-navy-mid bg-transparent text-teal-muted/40 hover:text-teal-muted/60'
                }`}
              >
                {complete && <CheckCircle size={11} />}
                {d.shortName}
              </button>
            )
          })}
        </div>

        {/* Question */}
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal/10 text-teal text-[11px] font-semibold">{dim.name}</span>
            <span className="text-teal-muted/40 text-xs">{currentQ + 1} of {dim.questions.length}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mt-4 mb-8 leading-snug">{question.q}</h2>

          <div className="space-y-2.5">
            {question.options.map((opt, oi) => {
              const selected = selectedAnswer === opt.score
              return (
                <button
                  key={oi}
                  onClick={() => handleAnswer(opt.score)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-start gap-3 ${
                    selected
                      ? 'border-teal bg-teal/10 text-white'
                      : 'border-navy-mid bg-navy-deep/30 text-teal-muted hover:border-teal/30 hover:text-white'
                  }`}
                >
                  <span
                    className={`min-w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 ${
                      selected ? 'bg-teal text-white' : 'bg-navy-mid/60 text-teal-muted/50'
                    }`}
                  >
                    {opt.score}
                  </span>
                  <span className="text-sm leading-relaxed">{opt.text}</span>
                </button>
              )
            })}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={goBack}
              disabled={currentDim === 0 && currentQ === 0}
              className="px-5 py-2.5 rounded-lg border border-navy-mid text-teal-muted/50 text-sm hover:text-teal-muted transition-colors disabled:opacity-20 disabled:cursor-default flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-teal-muted/30 text-xs self-center">{globalQIndex} / {totalQuestions}</span>
          </div>
        </div>
      </div>
    )
  }

  /* ─── EMAIL GATE ─── */
  if (screen === 'gate') {
    const overallLevel = MATURITY_LABELS[Math.round(overallScore)] || 'N/A'
    const overallColor = MATURITY_COLORS[Math.round(overallScore)] || '#94A3B8'

    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-5">
        <div className="max-w-md w-full bg-navy-deep/50 rounded-2xl border border-navy-mid p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-teal">
            <span className="text-white font-bold text-lg">OF</span>
          </div>
          <h2 className="text-2xl font-serif text-white mt-6 mb-2">Your AI-powered insights are ready</h2>

          {/* Teaser score */}
          <div className="my-6 p-5 rounded-xl bg-navy-mid/30 border border-navy-mid">
            <div className="text-5xl font-extrabold" style={{ color: overallColor }}>{overallScore}</div>
            <div className="text-teal-muted/50 text-xs uppercase tracking-wider mt-1">Overall maturity score</div>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${overallColor}15`, color: overallColor }}>
              {overallLevel}
            </div>
          </div>

          <p className="text-teal-muted text-sm leading-relaxed mb-6">
            Enter your email to unlock the full decision dashboard with your personalised radar chart, automated gap analysis, priority recommendations, and AI-generated action plan.
          </p>

          <div className="relative mb-4">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-muted/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your work email *"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-navy-mid bg-navy/60 text-white text-sm placeholder:text-teal-muted/40 focus:border-teal focus:outline-none"
            />
          </div>

          <button
            onClick={() => { if (email) setScreen('results') }}
            disabled={!email}
            className="w-full py-3.5 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-colors disabled:opacity-30 disabled:cursor-default flex items-center justify-center gap-2"
          >
            Unlock Full Report <ArrowRight size={16} />
          </button>

          <p className="text-teal-muted/30 text-[11px] mt-4">No spam. We may reach out with relevant insights.</p>
        </div>
      </div>
    )
  }

  /* ─── RESULTS ─── */
  if (screen === 'results') {
    const radarData = scores.map((s) => ({ dimension: s.shortName, score: s.score, fullMark: 5 }))
    const sortedScores = [...scores].filter((s) => s.score > 0).sort((a, b) => a.score - b.score)
    const weakest = sortedScores.slice(0, 3)
    const strongest = sortedScores.slice(-2).reverse()
    const overallLevel = MATURITY_LABELS[Math.round(overallScore)] || 'N/A'
    const overallColor = MATURITY_COLORS[Math.round(overallScore)] || '#94A3B8'

    const barData = scores
      .filter((s) => s.score > 0)
      .map((s) => ({
        name: s.shortName,
        fullName: s.name,
        score: s.score,
        color: MATURITY_COLORS[Math.round(s.score)],
      }))

    return (
      <div className="min-h-screen bg-navy pb-16">
        {/* Header */}
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center"><span className="text-white font-bold text-sm">OF</span></div>
              <div>
                <div className="text-sm font-bold text-white">S&OP Health Check Results</div>
                <div className="text-xs text-teal-muted/50">{companyName} &middot; {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
            <button
              onClick={() => { setScreen('assessment'); setCurrentDim(0); setCurrentQ(0) }}
              className="px-4 py-2 rounded-lg border border-navy-mid text-teal-muted text-xs hover:border-teal transition-colors"
            >
              Edit Answers
            </button>
          </div>

          {/* Overall */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-8 flex flex-col md:flex-row items-center gap-8 mb-6">
            <div className="text-center min-w-[140px]">
              <div className="text-6xl font-extrabold" style={{ color: overallColor }}>{overallScore}</div>
              <div className="text-teal-muted/40 text-[11px] uppercase tracking-wider mt-1">out of 5.0</div>
              <div className="mt-2 inline-block px-4 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${overallColor}15`, color: overallColor }}>
                {overallLevel}
              </div>
            </div>
            <p className="text-teal-muted text-sm leading-relaxed">
              {overallScore <= 2 &&
                `${companyName}'s S&OP process is in early stages. Significant opportunity exists to structure planning governance, improve demand visibility, and establish a performance management rhythm. Quick wins are available in multiple areas.`}
              {overallScore > 2 && overallScore <= 3 &&
                `${companyName} has foundational S&OP elements in place but key gaps remain in process discipline, cross-functional integration, and data-driven decision-making. Targeted interventions can deliver rapid improvement.`}
              {overallScore > 3 && overallScore <= 4 &&
                `${companyName} has a solid S&OP foundation with good practices across several dimensions. Focus areas are advancing to best-in-class in your weakest dimensions and building a closed-loop continuous improvement system.`}
              {overallScore > 4 &&
                `${companyName} demonstrates advanced S&OP maturity. Refinement opportunities remain in specific areas — consider advanced analytics, scenario planning, and extending IBP integration with financial planning.`}
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
              <div className="text-sm font-semibold text-white mb-4">Maturity Profile</div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1a3a5c" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9fd8d0', fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#1a3a5c', fontSize: 10 }} />
                  <Radar dataKey="score" stroke="#1a9e8f" fill="#1a9e8f" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
              <div className="text-sm font-semibold text-white mb-4">Dimension Scores</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" horizontal={false} />
                  <XAxis type="number" domain={[0, 5]} tick={{ fill: '#1a3a5c', fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#9fd8d0', fontSize: 11 }} width={90} />
                  <Tooltip
                    contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }}
                    formatter={(value: any, _: any, props: any) => [
                      `${value} / 5.0 — ${MATURITY_LABELS[Math.round(Number(value))]}`,
                      props.payload.fullName,
                    ]}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Gaps + Strengths + CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
            {/* Priority areas — 3 cols */}
            <div className="lg:col-span-3 rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle size={16} className="text-orange-400" />
                <span className="text-sm font-semibold text-white">Priority Improvement Areas</span>
              </div>
              {weakest.map((dim, i) => (
                <div key={dim.id} className="p-4 rounded-xl bg-navy/40 border border-navy-mid/60 mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-white">#{i + 1} {dim.name}</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${MATURITY_COLORS[Math.round(dim.score)]}15`, color: MATURITY_COLORS[Math.round(dim.score)] }}
                    >
                      {dim.score} — {dim.level}
                    </span>
                  </div>
                  <p className="text-xs text-teal-muted/60 leading-relaxed mb-3">{dim.description}</p>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-teal/5 border border-teal/15">
                    <div>
                      <div className="text-[10px] text-teal-muted/40 uppercase tracking-wider">Recommended</div>
                      <div className="text-xs text-teal font-semibold">{dim.service}</div>
                    </div>
                    <span className="text-xs text-teal-muted/40">{dim.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right column — 2 cols */}
            <div className="lg:col-span-2 space-y-5">
              {/* Strengths */}
              <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={16} className="text-teal" />
                  <span className="text-sm font-semibold text-white">Areas of Strength</span>
                </div>
                {strongest.map((dim) => (
                  <div key={dim.id} className="flex justify-between items-center py-2.5 border-b border-navy-mid/40 last:border-0">
                    <span className="text-xs text-teal-muted">{dim.name}</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${MATURITY_COLORS[Math.round(dim.score)]}15`, color: MATURITY_COLORS[Math.round(dim.score)] }}
                    >
                      {dim.score} — {dim.level}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/10 to-navy-mid/20 p-6">
                <div className="text-base font-bold text-white mb-2">Ready to close the gaps?</div>
                <p className="text-xs text-teal-muted leading-relaxed mb-4">
                  Book a free Problem Session with our senior team. We'll dive deeper into your priority areas and map out a concrete execution plan — not a report.
                </p>
                <div className="text-[11px] text-teal-muted/40 mb-4">
                  Typical ROI: CHF 25K engagement recovers CHF 500K–2M in margin (20–80x return)
                </div>
                <a
                  href="https://calendly.com/caio-opsflow-advisory/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-colors text-center no-underline"
                >
                  Book Free Problem Session
                </a>
                <div className="text-center mt-2 text-[10px] text-teal-muted/30">
                  opsflow-advisory.ch &middot; 90 minutes &middot; No commitment
                </div>
              </div>

              {/* Maturity Scale */}
              <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
                <div className="text-xs font-semibold text-teal-muted/50 mb-3 uppercase tracking-wider">Maturity Scale</div>
                {Object.entries(MATURITY_LABELS).map(([score, label]) => (
                  <div key={score} className="flex items-center gap-2.5 py-1">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ backgroundColor: MATURITY_COLORS[Number(score)] }}
                    >
                      {score}
                    </div>
                    <span className="text-xs text-teal-muted/60">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-6">
            <div className="text-sm font-semibold text-white mb-5">Detailed Dimension Breakdown</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {scores.filter((s) => s.score > 0).map((dim) => (
                <div key={dim.id} className="p-4 rounded-xl border border-navy-mid/50 bg-navy/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-teal-muted">{dim.name}</span>
                    <span className="text-xl font-extrabold" style={{ color: MATURITY_COLORS[Math.round(dim.score)] }}>{dim.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-navy-mid/40 mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(dim.score / 5) * 100}%`, backgroundColor: MATURITY_COLORS[Math.round(dim.score)] }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-teal-muted/40">{dim.level}</span>
                    <span className="text-[10px] text-teal-muted/30">{dim.practice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-5 border-t border-navy-mid/40">
            <div className="text-xs text-teal-muted/40">OpsFlow Advisory — Smarter supply chains. Built by people. Powered by AI.</div>
            <div className="text-[10px] text-teal-muted/20 mt-1">opsflow-advisory.ch &middot; Nyon, Canton Vaud, Switzerland</div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
