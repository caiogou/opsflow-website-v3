export function CTA() {
  return (
    <section className="py-16 px-6 md:py-24 md:px-8 bg-teal text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-5">
          Start with a free conversation.
        </h2>
        <p className="text-base md:text-lg text-emerald-50 leading-relaxed mb-8 md:mb-10">
          90 minutes. Structured thinking about your supply chain challenges. Honest perspectives on where the real value is.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://calendly.com/caio-opsflow-advisory/30min" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-navy px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:opacity-90 transition-opacity no-underline">
            Book your free 90-min session
          </a>
          <a href="/diagnostic" className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:bg-white/10 transition-colors no-underline">
            Take the S&OP Health Check
          </a>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        <span className="text-base font-bold text-white">OpsFlow Advisory</span>
        <div className="flex flex-wrap justify-center gap-5 md:gap-7">
          <a href="#services" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Services</a>
          <a href="#how" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">How it works</a>
          <a href="#why" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Why OpsFlow</a>
          <a href="https://calendly.com/caio-opsflow-advisory/30min" target="_blank" rel="noopener noreferrer" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Contact</a>
        </div>
        <span className="text-xs text-slate-500 text-center">
          2026 OpsFlow Advisory · Nyon, Switzerland
        </span>
      </div>
    </footer>
  )
}
