const stats = [
  { num: '17+', label: 'Years EMEA & LATAM experience' },
  { num: 'MIT', label: 'Certified in supply chain & logistics' },
  { num: '4', label: 'Practice areas, one goal: margin impact' },
  { num: 'CHF 0', label: 'To start — free 90-min session' },
]

export function Stats() {
  return (
    <div className="bg-navy-deep border-t border-navy-mid py-10 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.num} className="text-center">
            <div className="font-serif text-4xl text-teal">{s.num}</div>
            <div className="text-xs text-teal-muted mt-2 leading-snug">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
