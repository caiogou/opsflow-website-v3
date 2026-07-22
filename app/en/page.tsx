import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'

const CALENDLY = 'https://calendly.com/caio-opsflow-advisory/30min'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Supply Chain Consulting & S&OP · Switzerland',
  description:
    'Supply chain consulting for SMEs in Switzerland and EMEA: S&OP, inventory optimization, supply risk and distribution planning. MIT-certified. Free diagnostic session.',
  alternates: {
    canonical: 'https://www.opsflow-advisory.ch/en',
    languages: { fr: 'https://www.opsflow-advisory.ch/', de: 'https://www.opsflow-advisory.ch/de', en: 'https://www.opsflow-advisory.ch/en', 'x-default': 'https://www.opsflow-advisory.ch/' },
  },
  openGraph: { title: 'OpsFlow Advisory', description: 'AI-powered supply chain advisory — Switzerland & EMEA.', url: 'https://www.opsflow-advisory.ch/en', type: 'website' },
}

const services = [
  { title: 'Planning Excellence', desc: 'S&OP and IBP design, demand and supply integration, governance and drumbeat. We build planning processes that generate decisions — not just reports. Exception and priority management included.', tags: ['S&OP', 'IBP', 'Demand Planning', 'Exception Management'] },
  { title: 'Inventory Optimisation', desc: 'SKU segmentation (ABC/XYZ), safety stock redesign, replenishment logic and DRP. Free up working capital without degrading service levels — with measurable P&L impact.', tags: ['ABC/XYZ', 'Safety Stock', 'Working Capital', 'DRP'] },
  { title: 'Supply Risk & Resilience', desc: 'Tier 1 and 2 risk mapping, criticality scoring, dual-sourcing strategy and 90-day mitigation roadmap. Know your risks before they become disruptions.', tags: ['Risk Mapping', 'Dual Sourcing', 'Mitigation Plan'] },
  { title: 'Distribution & Shipment Planning', desc: 'Cost-to-serve modelling, network scenario analysis and shipment optimisation. Build a distribution network that fits your business today — and scales with it tomorrow.', tags: ['Network Design', 'Cost-to-serve', 'Shipment Optimisation'] },
]

const stats = [
  { num: '20+', label: 'Years EMEA & LATAM experience' },
  { num: 'MIT', label: 'Certified in supply chain & logistics' },
  { num: '4', label: 'Practice areas, one goal: margin impact' },
  { num: 'CHF 0', label: 'To start — free session' },
]

const steps = [
  { num: '1', title: 'Free diagnostic session', desc: 'A structured conversation about your supply chain reality. You walk away with clarity on your top priorities whether we work together or not.', price: 'Free — no commitment' },
  { num: '2', title: 'Rapid Assessment', desc: '2-week structured diagnostic. Your top 3 priorities ranked by P&L impact. A 90-day action plan ready to execute. Executive summary for your leadership team.', price: 'Starting at CHF 8,500 — fixed price' },
  { num: '3', title: 'Full engagement', desc: 'Senior-led implementation of the action plan. 4–12 weeks depending on scope. Your team owns the results. No dependency created.', price: 'CHF 22–80K depending on scope' },
]

const creds = [
  { title: 'MIT-certified · 20+ years EMEA & LATAM', desc: 'MIT Graduate Certificate in Supply Chain & Logistics. Senior leadership across EMEA and LATAM in agrochemical, crop science, and specialty manufacturing. Real environments, real constraints, real results.' },
  { title: 'Faster and leaner than big firms', desc: '6 weeks, not 6 months. Direct access to a senior practitioner from day one. Lower cost at the same strategic quality. No recycled slide decks — everything built for your context.' },
  { title: 'AI-native delivery', desc: 'Our AI decision engines power every engagement — from demand intelligence and predictive analytics to automated risk scoring and dynamic inventory optimisation. AI is not an add-on; it is how we deliver faster, sharper results.' },
]

export default function HomeEn() {
  return (
    <main>
      <Navbar lang="en" />

      <section className="bg-navy py-20 px-6 md:py-28 md:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-5">AI-powered supply chain advisory · Switzerland &amp; EMEA</p>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-white leading-tight mb-6">
            Smarter supply chains. <em className="text-teal not-italic">Built by people. Powered by AI.</em>
          </h1>
          <p className="text-lg text-teal-muted leading-relaxed mb-10 max-w-2xl">
            We combine 20+ years of hands-on EMEA experience with AI decision engines to unlock margin, cut inventory waste, and build resilient operations — in weeks, not months.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="bg-teal text-white px-9 py-4 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">Book a free session</a>
            <a href="/diagnostic" className="text-white border border-teal px-7 py-4 rounded text-sm font-semibold hover:bg-teal/10 transition-colors no-underline">Take the S&amp;OP Health Check</a>
          </div>
        </div>
      </section>

      <div className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.num} className="text-center">
              <div className="font-serif text-4xl text-teal">{s.num}</div>
              <div className="text-xs text-teal-muted mt-2 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section id="services" className="py-16 px-6 md:py-24 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">What we do</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">Four practice areas.<br />One goal: margin impact.</h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">We work where the biggest P&amp;L opportunities are — not where the noise is.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.title} className="border border-gray-200 rounded-lg p-9 hover:border-teal transition-colors">
                <h3 className="text-lg font-bold text-navy mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {s.tags.map((tag) => (<span key={tag} className="bg-teal-pale text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">{tag}</span>))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8"><a href="/en/services" className="text-teal font-semibold no-underline">See all services →</a></div>
        </div>
      </section>

      <section id="how" className="py-16 px-6 md:py-24 md:px-8 bg-teal-pale/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">How it works</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">From first conversation<br />to measurable results.</h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">Three steps. Fixed timelines. No open-ended engagements.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {steps.map((s) => (
              <div key={s.num}>
                <div className="w-14 h-14 rounded-full bg-teal flex items-center justify-center text-white text-2xl font-serif mb-6">{s.num}</div>
                <h3 className="text-lg font-bold text-navy mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                <p className="text-xs text-teal font-semibold mt-4">{s.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:py-24 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">One firm, two levels</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">The company level.<br />The team level.</h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">The same craft — simplifying how work runs and making teams autonomous — applied at two scales. Bring the problem; we&apos;ll point you to the right door.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-navy">
              <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">For leadership</p>
              <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Advisory</h3>
              <p className="text-sm text-gray-500 mb-5">Your company&apos;s planning and supply chain: S&amp;OP, inventory and working capital, supplier risk, network design.</p>
              <span className="mt-auto self-start bg-teal-pale text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">You are here ↑</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-teal">
              <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">For teams</p>
              <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Academy</h3>
              <p className="text-sm text-gray-500 mb-5">One specific process — onboarding, sales, a workflow that keeps jamming — simplified, and your team trained to run it without us.</p>
              <a href="/academy" className="mt-auto self-start bg-teal text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">Discover the Academy →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:py-24 md:px-8 bg-navy">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal-light uppercase mb-4">Why OpsFlow</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4 leading-tight">Senior expertise.<br />No junior consultants. No bait-and-switch.</h2>
          <p className="text-base text-teal-muted leading-relaxed max-w-xl mb-10 md:mb-14">What you see is what you get — the same person who diagnoses your problem leads the solution.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creds.map((c) => (
              <div key={c.title} className="bg-navy-mid rounded-lg p-9 border-t-4 border-teal">
                <h3 className="text-base font-bold text-white mb-3">{c.title}</h3>
                <p className="text-sm text-teal-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:py-24 md:px-8 bg-teal text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-5">Start with a free conversation.</h2>
          <p className="text-base md:text-lg text-emerald-50 leading-relaxed mb-8 md:mb-10">Structured thinking about your supply chain challenges. Honest perspectives on where the real value is.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-navy px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:opacity-90 transition-opacity no-underline">Book your free session</a>
            <a href="/diagnostic" className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:bg-white/10 transition-colors no-underline">Take the S&amp;OP Health Check</a>
          </div>
        </div>
      </section>

      <footer className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          <span className="text-base font-bold text-white">OpsFlow Advisory</span>
          <div className="flex flex-wrap justify-center gap-5 md:gap-7">
            <a href="/en/services" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Services</a>
            <a href="/en/#how" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">How it works</a>
            <a href="/en/ressources" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Resources</a>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Contact</a>
          </div>
          <span className="text-xs text-slate-500 text-center">2026 OpsFlow Advisory · Nyon, Switzerland</span>
        </div>
      </footer>
    </main>
  )
}
