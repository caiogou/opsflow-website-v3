export function CTA() {
  return (
    <section className="py-16 px-6 md:py-24 md:px-8 bg-teal text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-5">
          Start with a free conversation.
        </h2>
        <p className="text-base md:text-lg text-emerald-50 leading-relaxed mb-8 md:mb-10">
          90 minutes. Structured thinking about your supply chain challenges. Honest perspectives
          on where the real value is — whether we work together or not.
        </p>
        
          href="https://calendly.com/caio-opsflow-advisory/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-navy px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:opacity-90 transition-opacity no-underline"
        >
          Book your free 90-min session →
        </a>
      </div>
    </section>
  )
}

const footerLinks = [
  { label: 'Services', href: '#services', external: false },
  { label: 'How it works', href: '#how', external: false },
  { label: 'Why OpsFlow', href: '#why', external: false },
  { label: 'Contact', href: 'https://calendly.com/caio-opsflow-advisory/30min', external: true },
]

export function Footer() {
  return (
    <footer className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        <span className="text-base font-bold text-white">OpsFlow Advisory</span>
        <div className="flex flex-wrap justify-center gap-5 md:gap-7">
          {footerLinks.map((l) => (
            
              key={l.label}
              href={l.href}
              target={l.external ? '_blank' : '_self'}
              rel={l.external ? 'noopener noreferrer' : ''}
              className="text-teal-muted text-sm hover:text-white transition-colors no-underline"
            >
              {l.label}
            </a>
          ))}
        </div>
        <span className="text-xs text-slate-500 text-center">
          © 2026 OpsFlow Advisory · Nyon, Switzerland
        </span>
      </div>
    </footer>
  )
}
