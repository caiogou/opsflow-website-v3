type Lang = 'fr' | 'de' | 'en'
type Card = { title: string; desc: string; tags: string[] }

const C: Record<Lang, { rubric: string; h2a: string; h2b: string; intro: string; cards: Card[] }> = {
  fr: {
    rubric: 'Ce que nous faisons', h2a: 'Là où nous intervenons.', h2b: 'Un objectif : la marge.',
    intro: 'Quatre domaines, un seul fil : des décisions qui se prennent et un plan qui tient. Analyses assistées par l’IA, jugement senior.',
    cards: [
      { title: 'S&OP / IBP', desc: 'Conception du cycle S&OP et IBP, intégration de la demande et de l’offre, gouvernance et cadence. Nous construisons un processus mensuel qui produit des décisions — pas seulement des rapports — et nous le faisons vivre avec vous.', tags: ['S&OP', 'IBP', 'Prévision de la demande', 'Revue mensuelle'] },
      { title: 'Planification des approvisionnements', desc: 'Plans d’approvisionnement, politique de stocks (stock de sécurité, règles de réapprovisionnement, segmentation ABC/XYZ), DRP et capacité. Le bon stock au bon endroit, sans immobiliser le fonds de roulement.', tags: ['Supply planning', 'Stock de sécurité', 'ABC/XYZ', 'DRP'] },
      { title: 'Gestion des commandes', desc: 'Du bon de commande à la livraison : règles d’allocation, carnet de commandes, dates promises, blocages et exceptions. Moins d’urgences, plus de commandes livrées à temps et complètes.', tags: ['Order-to-delivery', 'Allocation', 'OTIF', 'Exceptions'] },
      { title: 'Logistique et distribution', desc: 'Coût de service, scénarios de réseau, transport et entreposage. Un dispositif logistique adapté à votre activité aujourd’hui — et qui grandit avec elle demain.', tags: ['Design du réseau', 'Coût de service', 'Transport', 'Entreposage'] },
    ],
  },
  de: {
    rubric: 'Was wir tun', h2a: 'Wo wir ansetzen.', h2b: 'Ein Ziel: die Marge.',
    intro: 'Vier Felder, ein roter Faden: Entscheidungen, die getroffen werden, und ein Plan, der hält. KI-gestützte Analysen, Senior-Urteil.',
    cards: [
      { title: 'S&OP / IBP', desc: 'Aufbau des S&OP- und IBP-Zyklus, Zusammenführung von Nachfrage und Angebot, Governance und Taktung. Wir bauen einen Monatsprozess, der Entscheidungen hervorbringt — nicht bloss Berichte — und halten ihn mit Ihnen lebendig.', tags: ['S&OP', 'IBP', 'Nachfrageprognose', 'Monatsreview'] },
      { title: 'Supply Planning', desc: 'Versorgungspläne, Bestandspolitik (Sicherheitsbestand, Nachschubregeln, ABC/XYZ-Segmentierung), DRP und Kapazität. Der richtige Bestand am richtigen Ort, ohne Betriebskapital zu binden.', tags: ['Supply Planning', 'Sicherheitsbestand', 'ABC/XYZ', 'DRP'] },
      { title: 'Order Management', desc: 'Von der Bestellung bis zur Lieferung: Zuteilungsregeln, Auftragsbestand, Liefertermine, Sperren und Ausnahmen. Weniger Feuerwehr, mehr pünktlich und vollständig gelieferte Aufträge.', tags: ['Order-to-Delivery', 'Zuteilung', 'OTIF', 'Ausnahmen'] },
      { title: 'Logistik und Distribution', desc: 'Servicekosten, Netzwerkszenarien, Transport und Lagerung. Eine Logistik, die zu Ihrem heutigen Geschäft passt — und morgen mit ihm wächst.', tags: ['Netzwerkdesign', 'Servicekosten', 'Transport', 'Lagerung'] },
    ],
  },
  en: {
    rubric: 'What we do', h2a: 'Where we work.', h2b: 'One goal: margin impact.',
    intro: 'Four areas, one thread: decisions that get made and a plan that holds. AI-assisted analysis, senior judgement.',
    cards: [
      { title: 'S&OP / IBP', desc: 'S&OP and IBP cycle design, demand and supply integration, governance and drumbeat. We build a monthly process that produces decisions — not just reports — and keep it alive with you.', tags: ['S&OP', 'IBP', 'Demand Planning', 'Monthly Review'] },
      { title: 'Supply Planning', desc: 'Supply plans, inventory policy (safety stock, replenishment rules, ABC/XYZ segmentation), DRP and capacity. The right stock in the right place, without tying up working capital.', tags: ['Supply Planning', 'Safety Stock', 'ABC/XYZ', 'DRP'] },
      { title: 'Order Management', desc: 'From purchase order to delivery: allocation rules, backlog, promise dates, blocks and exceptions. Fewer firefights, more orders shipped on time and in full.', tags: ['Order-to-Delivery', 'Allocation', 'OTIF', 'Exceptions'] },
      { title: 'Logistics & Distribution', desc: 'Cost-to-serve, network scenarios, transport and warehousing. A logistics set-up that fits your business today — and scales with it tomorrow.', tags: ['Network Design', 'Cost-to-serve', 'Transport', 'Warehousing'] },
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
