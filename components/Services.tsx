type Lang = 'fr' | 'de' | 'en'
type Card = { title: string; desc: string; tags: string[] }

const C: Record<Lang, { rubric: string; h2a: string; h2b: string; intro: string; cards: Card[] }> = {
  fr: {
    rubric: 'Ce que nous faisons', h2a: 'Quatre domaines.', h2b: 'Un objectif : la marge.',
    intro: 'Nous intervenons là où se trouvent les vraies opportunités de résultat — pas là où il y a du bruit.',
    cards: [
      { title: 'Excellence de planification', desc: 'Conception S&OP et IBP, intégration de la demande et de l’offre, gouvernance et cadence. Nous construisons des processus de planification qui produisent des décisions — pas seulement des rapports. Gestion des exceptions et des priorités incluse.', tags: ['S&OP', 'IBP', 'Prévision de la demande', 'Gestion des exceptions'] },
      { title: 'Optimisation des stocks', desc: 'Segmentation des SKU (ABC/XYZ), refonte du stock de sécurité, logique de réapprovisionnement et DRP. Libérez du fonds de roulement sans dégrader le niveau de service — avec un impact mesurable sur le résultat.', tags: ['ABC/XYZ', 'Stock de sécurité', 'Fonds de roulement', 'DRP'] },
      { title: 'Risques et résilience', desc: 'Cartographie des risques rang 1 et 2, scoring de criticité, stratégie de double sourcing et feuille de route de mitigation sur 90 jours. Connaissez vos risques avant qu’ils ne deviennent des ruptures.', tags: ['Cartographie des risques', 'Double sourcing', 'Plan de mitigation'] },
      { title: 'Distribution et transport', desc: 'Modélisation du coût de service, analyse de scénarios de réseau et optimisation du transport. Bâtissez un réseau de distribution adapté à votre activité aujourd’hui — et qui grandit avec elle demain.', tags: ['Design du réseau', 'Coût de service', 'Optimisation transport'] },
    ],
  },
  de: {
    rubric: 'Was wir tun', h2a: 'Vier Handlungsfelder.', h2b: 'Ein Ziel: die Marge.',
    intro: 'Wir setzen dort an, wo die echten Ergebnischancen liegen — nicht dort, wo es am lautesten ist.',
    cards: [
      { title: 'Planungsexzellenz', desc: 'Aufbau von S&OP und IBP, Zusammenführung von Nachfrage und Angebot, Governance und Taktung. Wir bauen Planungsprozesse, die Entscheidungen hervorbringen — nicht bloss Berichte. Ausnahme- und Prioritätensteuerung inbegriffen.', tags: ['S&OP', 'IBP', 'Nachfrageprognose', 'Ausnahmesteuerung'] },
      { title: 'Bestandsoptimierung', desc: 'SKU-Segmentierung (ABC/XYZ), Neugestaltung des Sicherheitsbestands, Nachschublogik und DRP. Setzen Sie Betriebskapital frei, ohne den Servicegrad zu schwächen — mit messbarer Wirkung auf das Ergebnis.', tags: ['ABC/XYZ', 'Sicherheitsbestand', 'Betriebskapital', 'DRP'] },
      { title: 'Risiken und Resilienz', desc: 'Risikokartierung der Ebenen 1 und 2, Kritikalitäts-Scoring, Dual-Sourcing-Strategie und Mitigationsfahrplan über 90 Tage. Kennen Sie Ihre Risiken, bevor sie zu Ausfällen werden.', tags: ['Risikokartierung', 'Dual Sourcing', 'Mitigationsplan'] },
      { title: 'Distribution und Transport', desc: 'Modellierung der Servicekosten, Analyse von Netzwerkszenarien und Transportoptimierung. Bauen Sie ein Distributionsnetz, das zu Ihrem heutigen Geschäft passt — und morgen mit ihm wächst.', tags: ['Netzwerkdesign', 'Servicekosten', 'Transportoptimierung'] },
    ],
  },
  en: {
    rubric: 'What we do', h2a: 'Four practice areas.', h2b: 'One goal: margin impact.',
    intro: 'We work where the biggest P&L opportunities are — not where the noise is.',
    cards: [
      { title: 'Planning Excellence', desc: 'S&OP and IBP design, demand and supply integration, governance and drumbeat. We build planning processes that generate decisions — not just reports. Exception and priority management included.', tags: ['S&OP', 'IBP', 'Demand Planning', 'Exception Management'] },
      { title: 'Inventory Optimisation', desc: 'SKU segmentation (ABC/XYZ), safety stock redesign, replenishment logic and DRP. Free up working capital without degrading service levels — with measurable P&L impact.', tags: ['ABC/XYZ', 'Safety Stock', 'Working Capital', 'DRP'] },
      { title: 'Risk & Resilience', desc: 'Tier 1 and 2 risk mapping, criticality scoring, dual-sourcing strategy and a 90-day mitigation roadmap. Know your risks before they become disruptions.', tags: ['Risk Mapping', 'Dual Sourcing', 'Mitigation Plan'] },
      { title: 'Distribution & Shipping', desc: 'Cost-to-serve modelling, network scenario analysis and shipment optimisation. Build a distribution network that fits your business today — and scales with it tomorrow.', tags: ['Network Design', 'Cost-to-serve', 'Shipment Optimisation'] },
    ],
  },
}

export function Services({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  return (
    <section id="services" className="py-16 px-6 md:py-24 md:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.rubric}</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
          {t.h2a}<br />{t.h2b}
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">{t.intro}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.cards.map((s) => (
            <div key={s.title} className="border border-gray-200 rounded-lg p-9 hover:border-teal transition-colors">
              <h3 className="text-lg font-bold text-navy mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {s.tags.map((tag) => (
                  <span key={tag} className="bg-teal-pale text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
