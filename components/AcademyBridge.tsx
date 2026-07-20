export function AcademyBridge() {
  return (
    <section className="py-16 px-6 md:py-24 md:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">One firm, two levels</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
          The company level.<br />The team level.
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">
          The same craft — simplifying how work runs and making teams autonomous — applied at two
          scales. Bring the problem; we&apos;ll point you to the right door.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-navy">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">For leadership</p>
            <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Advisory</h3>
            <p className="text-sm text-gray-500 mb-5">
              Your company&apos;s planning and supply chain: S&amp;OP, inventory and working capital,
              supplier risk, network design.
            </p>
            <span className="mt-auto self-start bg-teal-pale text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">
              You are here ↑
            </span>
          </div>
          <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-teal">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">For teams</p>
            <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Academy</h3>
            <p className="text-sm text-gray-500 mb-5">
              One specific process — onboarding, sales, a workflow that keeps jamming — simplified,
              and your team trained to run it without us.
            </p>
            <a
              href="/academy"
              className="mt-auto self-start bg-teal text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline"
            >
              Discover the Academy →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
