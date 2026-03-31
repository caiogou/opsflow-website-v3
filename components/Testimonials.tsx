const testimonials = [
  {
    text: 'The diagnostic session alone gave us more clarity than 6 months of internal discussions. The action plan was concrete, prioritised, and our team could execute it immediately.',
    initials: 'VP',
    name: 'VP Supply Chain',
    role: 'Industrial manufacturer · Switzerland',
  },
  {
    text: 'OpsFlow identified €800K in recoverable working capital in 2 weeks. The investment paid back in the first month. We are now on a retainer for ongoing advisory.',
    initials: 'CO',
    name: 'COO',
    role: 'Mid-market manufacturer · Germany',
  },
  {
    text: 'Senior-only delivery means no ramp-up time — they understood our business in the first session and delivered a full S&OP redesign in 6 weeks.',
    initials: 'SC',
    name: 'Supply Chain Director',
    role: 'FMCG company · France',
  },
]

export function Testimonials() {
  return (
    <section id="cases" className="py-24 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Cases</p>
        <h2 className="font-serif text-4xl font-normal text-navy mb-4 leading-tight">
          Results that speak<br />for themselves.
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-14">
          First client cases will be published after initial engagements.
        </p>
        <div className="grid grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-gray-200 rounded-lg p-8 border-t-4 border-t-teal-pale"
            >
              <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold tracking-widest px-2 py-1 rounded mb-4 uppercase">
                Coming soon
              </span>
              <p className="text-sm text-gray-500 leading-relaxed italic mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
