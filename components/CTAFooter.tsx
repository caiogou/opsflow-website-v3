export function CTA() {
  return (
    <section className="py-24 px-8 bg-teal text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-4xl font-normal text-white mb-5">
          Start with a free conversation.
        </h2>
        <p className="text-lg text-emerald-50 leading-relaxed mb-10">
          90 minutes. Structured thinking about your supply chain challenges. Honest perspectives
          on where the real value is — whether we work together or not.
        </p>
        <a
          href="mailto:caio@opsflow-advisory.ch"
          className="inline-block bg-white text-navy px-10 py-5 rounded text-base font-bold hover:opacity-90 transition-opacity no-underline"
        >
          Book your free session → caio@opsflow-advisory.ch
        </a>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy-deep border-t border-navy-mid py-10 px-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <span className="text-base font-bold text-white">OpsFlow Advisory</span>
        <div className="flex gap-7">
          {[
            { label: 'Services', href: '#services' },
            { label: 'How it works', href: '#how' },
            { label: 'Why OpsFlow', href: '#why' },
            { label: 'Contact', href: 'mailto:caio@opsflow-advisory.ch' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-teal-muted text-sm hover:text-white transition-colors no-underline"
            >
              {l.label}
            </a>
          ))}
        </div>
        <span className="text-xs text-slate-500">
          © 2026 OpsFlow Advisory · Nyon, Switzerland
        </span>
      </div>
    </footer>
  )
}
