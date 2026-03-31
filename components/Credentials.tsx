const creds = [
  {
    title: 'MIT-certified · 17 years EMEA & LATAM',
    desc: 'MIT Graduate Certificate in Supply Chain & Logistics. Senior leadership roles across EMEA and LATAM at FMC, Bayer, and UPL. Real environments, real constraints, real results.',
  },
  {
    title: 'Faster and leaner than big firms',
    desc: '6 weeks, not 6 months. Direct access to a senior practitioner from day one. Lower cost at the same strategic quality. No recycled slide decks — everything built for your context.',
  },
  {
    title: 'AI-powered delivery',
    desc: 'We leverage the latest AI tools for demand sensing, intelligent exception prioritisation, and dynamic inventory optimisation — embedded into your process as a practical accelerator.',
  },
]

export function Credentials() {
  return (
    <section id="why" className="py-24 px-8 bg-navy">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal-light uppercase mb-4">
          Why OpsFlow
        </p>
        <h2 className="font-serif text-4xl font-normal text-white mb-4 leading-tight">
          Senior expertise.<br />No junior consultants. No bait-and-switch.
        </h2>
        <p className="text-base text-teal-muted leading-relaxed max-w-xl mb-14">
          What you see is what you get — the same person who diagnoses your problem leads the solution.
        </p>
        <div className="grid grid-cols-3 gap-6">
          {creds.map((c) => (
            <div key={c.title} className="bg-navy-mid rounded-lg p-9 border-t-4 border-teal">
              <h3 className="text-base font-bold text-white mb-3">{c.title}</h3>
              <p className="text-sm text-teal-muted leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
