export function Hero() {
  return (
    <section className="bg-navy py-20 px-6 md:py-32 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-center">
        <div>
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-5">AI-powered supply chain advisory · EMEA</p>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-white leading-tight mb-6">
            Smarter supply chains.{' '}
            <em className="text-teal not-italic">Built by people. Powered by AI.</em>
          </h1>
          <p className="text-lg text-teal-muted leading-relaxed mb-10 max-w-lg">
            We combine 20+ years of hands-on EMEA experience with AI decision engines to unlock margin, cut inventory waste, and build resilient operations — in weeks, not months.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="https://calendly.com/caio-opsflow-advisory/30min" target="_blank" rel="noopener noreferrer" className="bg-teal text-white px-9 py-4 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">Book free 90-min session</a>
            <a href="/diagnostic" className="text-white border border-teal px-7 py-4 rounded text-sm font-semibold hover:bg-teal/10 transition-colors no-underline">Take the S&OP Health Check</a>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <svg width="400" height="380" viewBox="0 0 340 320" xmlns="http://www.w3.org/2000/svg">
            <circle cx="170" cy="160" r="130" fill="none" stroke="#1a3a5c" strokeWidth="1" />
            <circle cx="170" cy="160" r="88" fill="none" stroke="#1a3a5c" strokeWidth="1" />
            <circle cx="170" cy="160" r="48" fill="#1a9e8f" />
            <text x="170" y="155" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Supply</text>
            <text x="170" y="172" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Chain</text>
            <rect x="94" y="14" width="152" height="36" rx="18" fill="#1a3a5c" stroke="#1a9e8f" strokeWidth="1" />
            <text x="170" y="37" textAnchor="middle" fill="#9fd8d0" fontSize="12">Planning Excellence</text>
            <rect x="244" y="120" width="88" height="36" rx="18" fill="#1a3a5c" stroke="#1a9e8f" strokeWidth="1" />
            <text x="288" y="138" textAnchor="middle" fill="#9fd8d0" fontSize="11">Inventory</text>
            <text x="288" y="151" textAnchor="middle" fill="#9fd8d0" fontSize="11">Optimisation</text>
            <rect x="94" y="270" width="152" height="36" rx="18" fill="#1a3a5c" stroke="#1a9e8f" strokeWidth="1" />
            <text x="170" y="293" textAnchor="middle" fill="#9fd8d0" fontSize="12">Supply Risk</text>
            <rect x="8" y="120" width="88" height="36" rx="18" fill="#1a3a5c" stroke="#1a9e8f" strokeWidth="1" />
            <text x="52" y="135" textAnchor="middle" fill="#9fd8d0" fontSize="10">Distribution &amp;</text>
            <text x="52" y="149" textAnchor="middle" fill="#9fd8d0" fontSize="10">Shipment</text>
            <line x1="170" y1="50" x2="170" y2="112" stroke="#1a9e8f" strokeWidth="1.5" />
            <line x1="244" y1="138" x2="218" y2="150" stroke="#1a9e8f" strokeWidth="1.5" />
            <line x1="170" y1="208" x2="170" y2="270" stroke="#1a9e8f" strokeWidth="1.5" />
            <line x1="96" y1="138" x2="122" y2="150" stroke="#1a9e8f" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </section>
  )
}
