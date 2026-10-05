import { TEAM } from '@/lib/team'
type Lang = 'fr' | 'de' | 'en'
const T = {
  en: { rubric: 'Team', h2: 'The people on your calls.', li: 'LinkedIn profile' },
  fr: { rubric: 'Équipe', h2: 'Les personnes à vos côtés.', li: 'Profil LinkedIn' },
  de: { rubric: 'Team', h2: 'Die Menschen in Ihren Calls.', li: 'LinkedIn-Profil' },
}
export function Team({ lang = 'fr' }: { lang?: Lang }) {
  const people = TEAM.filter((m) => m.photo && m.bio[lang])
  if (!people.length) return null
  const t = T[lang]
  return (
    <section id="team" className="py-16 px-6 md:py-24 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.rubric}</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-10 leading-tight">{t.h2}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {people.map((m) => (
            <div key={m.name} className="flex gap-6 items-start rounded-lg border border-gray-200 p-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.photo} alt={m.name} width={120} height={120} className="w-28 h-28 rounded-full object-cover flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-navy">{m.name}</h3>
                <p className="text-sm text-teal font-semibold mb-3">{m.role[lang]}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{m.bio[lang]}</p>
                {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-teal no-underline hover:underline">{t.li} →</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
