const services = [
  {
    title: 'Planning Excellence',
    desc: 'S&OP and IBP design, demand and supply integration, governance and drumbeat. We build planning processes that generate decisions — not just reports. Exception and priority management included.',
    tags: ['S&OP', 'IBP', 'Demand Planning', 'Exception Management'],
  },
  {
    title: 'Inventory Optimisation',
    desc: 'SKU segmentation (ABC/XYZ), safety stock redesign, replenishment logic and DRP. Free up working capital without degrading service levels — with measurable P&L impact.',
    tags: ['ABC/XYZ', 'Safety Stock', 'Working Capital', 'DRP'],
  },
  {
    title: 'Supply Risk & Resilience',
    desc: 'Tier 1 and 2 risk mapping, criticality scoring, dual-sourcing strategy and 90-day mitigation roadmap. Know your risks before they become disruptions.',
    tags: ['Risk Mapping', 'Dual Sourcing', 'Mitigation Plan'],
  },
  {
    title: 'Distribution & Shipment Planning',
    desc: 'Cost-to-serve modelling, network scenario analysis and shipment optimisation. Build a distribution network that fits your business today — and scales with it tomorrow.',
    tags: ['Network Design', 'Cost-to-serve', 'Shipment Optimisation'],
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">What we do</p>
        <h2 className="font-serif text-4xl font-normal text-navy mb-4 leading-tight">
          Four practice areas.<br />One goal: margin impact.
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-14">
          We work where the biggest P&L opportunities are — not where the noise is.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="border border-gray-200 rounded-lg p-9 hover:border-teal transition-colors"
            >
              <h3 className="text-lg font-bold text-navy mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-teal-pale text-emerald-800 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
