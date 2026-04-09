const stats = [
  { num: '20+', label: 'Years EMEA & LATAM experience' },
  { num: 'MIT', label: 'Certified in supply chain & logistics' },
  { num: '4', label: 'Practice areas, one goal: margin impact' },
  { num: 'CHF 0', label: 'To start — free 90-min session' },
]

export function Stats() {
  return (
    <div className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
