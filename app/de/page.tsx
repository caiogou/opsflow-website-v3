import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { LogoIcon } from '@/components/LogoIcon'

const CALENDLY = 'https://calendly.com/caio-opsflow-advisory/30min'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Supply Chain Beratung & S&OP · Schweiz',
  description:
    'Supply-Chain-Beratung für KMU in der Schweiz und EMEA: S&OP, Bestandsoptimierung, Risikomanagement und Distributionsplanung. MIT-zertifiziert. Kostenlose Standortbestimmung.',
  alternates: {
    canonical: 'https://www.opsflow-advisory.ch/de',
    languages: { fr: 'https://www.opsflow-advisory.ch/', de: 'https://www.opsflow-advisory.ch/de', 'x-default': 'https://www.opsflow-advisory.ch/' },
  },
  openGraph: { title: 'OpsFlow Advisory', description: 'Supply-Chain-Beratung, verstärkt durch KI — Schweiz & EMEA.', url: 'https://www.opsflow-advisory.ch/de', type: 'website' },
}

const services = [
  { title: 'Planungsexzellenz', desc: 'Aufbau von S&OP und IBP, Zusammenführung von Nachfrage und Angebot, Governance und Taktung. Wir bauen Planungsprozesse, die Entscheidungen hervorbringen — nicht bloss Berichte. Ausnahme- und Prioritätensteuerung inbegriffen.', tags: ['S&OP', 'IBP', 'Nachfrageprognose', 'Ausnahmesteuerung'] },
  { title: 'Bestandsoptimierung', desc: 'SKU-Segmentierung (ABC/XYZ), Neugestaltung des Sicherheitsbestands, Nachschublogik und DRP. Setzen Sie Betriebskapital frei, ohne den Servicegrad zu schwächen — mit messbarer Wirkung auf das Ergebnis.', tags: ['ABC/XYZ', 'Sicherheitsbestand', 'Betriebskapital', 'DRP'] },
  { title: 'Risiken und Resilienz', desc: 'Risikokartierung der Ebenen 1 und 2, Kritikalitäts-Scoring, Dual-Sourcing-Strategie und Mitigationsfahrplan über 90 Tage. Kennen Sie Ihre Risiken, bevor sie zu Ausfällen werden.', tags: ['Risikokartierung', 'Dual Sourcing', 'Mitigationsplan'] },
  { title: 'Distribution und Transport', desc: 'Modellierung der Servicekosten, Analyse von Netzwerkszenarien und Transportoptimierung. Bauen Sie ein Distributionsnetz, das zu Ihrem heutigen Geschäft passt — und morgen mit ihm wächst.', tags: ['Netzwerkdesign', 'Servicekosten', 'Transportoptimierung'] },
]

const stats = [
  { num: '20+', label: 'Jahre Erfahrung in EMEA & LATAM' },
  { num: 'MIT', label: 'Zertifiziert in Supply Chain & Logistik' },
  { num: '4', label: 'Handlungsfelder, ein Ziel: die Marge' },
  { num: 'CHF 0', label: 'Für den Anfang — kostenlose Session' },
]

const steps = [
  { num: '1', title: 'Kostenlose Standortbestimmung', desc: 'Ein strukturiertes Gespräch über die Realität Ihrer Supply Chain. Sie gehen mit einem klaren Bild Ihrer Prioritäten heraus — ob wir zusammenarbeiten oder nicht.', price: 'Kostenlos — unverbindlich' },
  { num: '2', title: 'Rapid Assessment', desc: 'Strukturierte Diagnose in 2 Wochen. Ihre 3 Prioritäten, nach Ergebniswirkung geordnet. Ein umsetzungsbereiter 90-Tage-Aktionsplan. Eine Zusammenfassung für Ihre Geschäftsleitung.', price: 'Ab CHF 8 500 — Festpreis' },
  { num: '3', title: 'Vollständiges Mandat', desc: 'Umsetzung des Aktionsplans, geführt von einer erfahrenen Person. 4 bis 12 Wochen je nach Umfang. Ihre Teams eignen sich die Ergebnisse an. Keine Abhängigkeit.', price: 'CHF 22–80K je nach Umfang' },
]

const creds = [
  { title: 'MIT-zertifiziert · 20+ Jahre EMEA & LATAM', desc: 'MIT Graduate Certificate in Supply Chain & Logistics. Senior-Führungsrollen in EMEA und LATAM in Agrochemie, Pflanzenwissenschaften und Spezialindustrie. Reale Umgebungen, reale Zwänge, reale Ergebnisse.' },
  { title: 'Schneller und schlanker als grosse Beratungshäuser', desc: '6 Wochen statt 6 Monate. Direkter Zugang zu einer erfahrenen Fachperson ab dem ersten Tag. Geringere Kosten bei gleicher strategischer Qualität. Keine wiederverwendeten Folien — alles auf Ihren Kontext gebaut.' },
  { title: 'KI-native Umsetzung', desc: 'Unsere KI-Entscheidungsmodelle unterstützen jedes Mandat — von der Nachfrageintelligenz bis zur prädiktiven Analytik, vom automatisierten Risiko-Scoring bis zur dynamischen Bestandsoptimierung. KI ist keine Option; sie ist unsere Art, schneller und treffsicherer zu liefern.' },
]

export default function HomeDe() {
  return (
    <main>
      <Navbar lang="de" />

      <section className="bg-navy py-20 px-6 md:py-28 md:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-5">Supply-Chain-Beratung, verstärkt durch KI · Schweiz &amp; EMEA</p>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-white leading-tight mb-6">
            Klügere Supply Chains. <em className="text-teal not-italic">Vom Menschen geführt. Durch KI verstärkt.</em>
          </h1>
          <p className="text-lg text-teal-muted leading-relaxed mb-10 max-w-2xl">
            Wir verbinden über 20 Jahre Praxiserfahrung in EMEA mit KI-gestützten Entscheidungsmodellen, um Marge freizusetzen, Bestandsverschwendung zu senken und widerstandsfähige Abläufe aufzubauen — in Wochen, nicht in Monaten.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="bg-teal text-white px-9 py-4 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">Kostenlose Session buchen</a>
            <a href="/diagnostic" className="text-white border border-teal px-7 py-4 rounded text-sm font-semibold hover:bg-teal/10 transition-colors no-underline">S&amp;OP-Standortbestimmung starten</a>
          </div>
        </div>
      </section>

      <div className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.num} className="text-center">
              <div className="font-serif text-4xl text-teal">{s.num}</div>
              <div className="text-xs text-teal-muted mt-2 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section id="services" className="py-16 px-6 md:py-24 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Was wir tun</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">Vier Handlungsfelder.<br />Ein Ziel: die Marge.</h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">Wir setzen dort an, wo die echten Ergebnischancen liegen — nicht dort, wo es am lautesten ist.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.title} className="border border-gray-200 rounded-lg p-9 hover:border-teal transition-colors">
                <h3 className="text-lg font-bold text-navy mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {s.tags.map((tag) => (<span key={tag} className="bg-teal-pale text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">{tag}</span>))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8"><a href="/de/services" className="text-teal font-semibold no-underline">Alle Leistungen ansehen →</a></div>
        </div>
      </section>

      <section id="how" className="py-16 px-6 md:py-24 md:px-8 bg-teal-pale/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Unser Ansatz</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">Vom ersten Gespräch<br />zu messbaren Ergebnissen.</h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">Drei Schritte. Feste Fristen. Keine Mandate mit offenem Ende.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {steps.map((s) => (
              <div key={s.num}>
                <div className="w-14 h-14 rounded-full bg-teal flex items-center justify-center text-white text-2xl font-serif mb-6">{s.num}</div>
                <h3 className="text-lg font-bold text-navy mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                <p className="text-xs text-teal font-semibold mt-4">{s.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:py-24 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Ein Haus, zwei Ebenen</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">Die Unternehmensebene.<br />Die Teamebene.</h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">Dasselbe Handwerk — die Funktionsweise der Arbeit vereinfachen und Teams befähigen — auf zwei Ebenen angewendet. Bringen Sie das Problem; wir zeigen Ihnen die richtige Tür.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-navy">
              <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">Für die Geschäftsleitung</p>
              <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Advisory</h3>
              <p className="text-sm text-gray-500 mb-5">Die Planung und Supply Chain Ihres Unternehmens: S&amp;OP, Bestände und Betriebskapital, Lieferantenrisiko, Netzwerkdesign.</p>
              <span className="mt-auto self-start bg-teal-pale text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">Sie sind hier ↑</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-teal">
              <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">Für die Teams</p>
              <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Academy</h3>
              <p className="text-sm text-gray-500 mb-5">Ein konkreter Prozess — Einarbeitung, Verkauf, ein stockender Ablauf — vereinfacht, und Ihr Team geschult, um ihn ohne uns am Laufen zu halten.</p>
              <a href="/academy" className="mt-auto self-start bg-teal text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">Die Academy entdecken →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:py-24 md:px-8 bg-navy">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal-light uppercase mb-4">Warum OpsFlow</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4 leading-tight">Seniorität und Erfahrung.<br />Keine Junioren. Kein Schein.</h2>
          <p className="text-base text-teal-muted leading-relaxed max-w-xl mb-10 md:mb-14">Was Sie sehen, ist, was Sie bekommen — die Person, die Ihr Problem diagnostiziert, führt die Lösung.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creds.map((c) => (
              <div key={c.title} className="bg-navy-mid rounded-lg p-9 border-t-4 border-teal">
                <h3 className="text-base font-bold text-white mb-3">{c.title}</h3>
                <p className="text-sm text-teal-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:py-24 md:px-8 bg-teal text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-5">Beginnen wir mit einem Gespräch.</h2>
          <p className="text-base md:text-lg text-emerald-50 leading-relaxed mb-8 md:mb-10">Ein strukturiertes Gespräch über Ihre Supply-Chain-Themen. Ein ehrlicher Blick darauf, wo der echte Wert liegt.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-navy px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:opacity-90 transition-opacity no-underline">Kostenlose Session buchen</a>
            <a href="/diagnostic" className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:bg-white/10 transition-colors no-underline">S&amp;OP-Standortbestimmung starten</a>
          </div>
        </div>
      </section>

      <footer className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          <span className="text-base font-bold text-white">OpsFlow Advisory</span>
          <div className="flex flex-wrap justify-center gap-5 md:gap-7">
            <a href="/de/services" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Dienstleistungen</a>
            <a href="/de/#how" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Unser Ansatz</a>
            <a href="/de/ressources" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Ressourcen</a>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">Kontakt</a>
          </div>
          <span className="text-xs text-slate-500 text-center">2026 OpsFlow Advisory · Nyon, Schweiz</span>
        </div>
      </footer>
    </main>
  )
}
