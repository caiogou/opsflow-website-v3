'use client'
import { useState } from 'react'

type Lang = 'fr' | 'de' | 'en'
type NodeKey = 'top' | 'right' | 'bottom' | 'left'
type Info = { title: string; text: string; link: string; cta: string }

// Interactive practice-area diagram (23/set/2026 · Caio: "make it interactive on hover").
const INFO: Record<Lang, Record<NodeKey, Info>> = {
  en: {
    top: { title: 'Planning Excellence', text: 'S&OP / IBP design, demand–supply balance and a monthly cycle that produces decisions — we run it with you and keep it on track.', link: '/en/services/s-op-consulting', cta: 'S&OP consulting' },
    right: { title: 'Inventory Optimisation', text: 'ABC/XYZ segmentation, safety stock and reorder policy, excess and obsolete stock — release working capital without hurting service.', link: '/platform/inventory', cta: 'Run the inventory diagnostic' },
    bottom: { title: 'Risk & Resilience', text: 'Single-source exposure, supplier concentration and geographic risk, with a 90-day mitigation and dual-sourcing roadmap.', link: '/platform/supply-risk', cta: 'Run the supply-risk diagnostic' },
    left: { title: 'Distribution & Shipping', text: 'Cost-to-serve, network scenarios and shipment optimisation — a distribution network that fits today and scales tomorrow.', link: '/en/services/distribution-planning', cta: 'Distribution planning' },
  },
  fr: {
    top: { title: 'Excellence de planification', text: 'Conception S&OP / IBP, équilibre demande–offre et un cycle mensuel qui produit des décisions — nous le pilotons avec vous et le gardons sur les rails.', link: '/services/conseil-sop', cta: 'Conseil S&OP' },
    right: { title: 'Optimisation des stocks', text: 'Segmentation ABC/XYZ, stock de sécurité et point de commande, surstocks et obsolètes — libérez du fonds de roulement sans dégrader le service.', link: '/platform/inventory', cta: 'Lancer le diagnostic stocks' },
    bottom: { title: 'Gestion des risques', text: 'Exposition mono-source, concentration fournisseurs et risque géographique, avec une feuille de route de mitigation sur 90 jours.', link: '/platform/supply-risk', cta: 'Lancer le diagnostic risques' },
    left: { title: 'Distribution & transport', text: 'Coût de service, scénarios de réseau et optimisation du transport — un réseau adapté à aujourd’hui, prêt pour demain.', link: '/services/planification-distribution', cta: 'Planification de la distribution' },
  },
  de: {
    top: { title: 'Planungsexzellenz', text: 'S&OP-/IBP-Aufbau, Ausgleich von Nachfrage und Angebot und ein Monatszyklus, der Entscheidungen hervorbringt — wir führen ihn mit Ihnen und halten ihn auf Kurs.', link: '/de/services/sop-beratung', cta: 'S&OP-Beratung' },
    right: { title: 'Bestandsoptimierung', text: 'ABC/XYZ-Segmentierung, Sicherheitsbestand und Bestellpunkt, Über- und Altbestände — Betriebskapital freisetzen, ohne den Service zu schwächen.', link: '/platform/inventory', cta: 'Bestandsdiagnose starten' },
    bottom: { title: 'Risikomanagement', text: 'Single-Source-Risiken, Lieferantenkonzentration und geografische Risiken, mit einem 90-Tage-Mitigationsplan.', link: '/platform/supply-risk', cta: 'Risikodiagnose starten' },
    left: { title: 'Distribution & Transport', text: 'Servicekosten, Netzwerkszenarien und Transportoptimierung — ein Netz, das heute passt und morgen mitwächst.', link: '/de/services/distributionsplanung', cta: 'Distributionsplanung' },
  },
}

export function HeroDiagram({ lang, labels }: { lang: Lang; labels: { top: string; right1: string; right2: string; bottom: string; left1: string; left2: string } }) {
  const [active, setActive] = useState<NodeKey | null>(null)
  const info = active ? INFO[lang][active] : null
  const node = (k: NodeKey) => ({
    onMouseEnter: () => setActive(k),
    onFocus: () => setActive(k),
    onClick: () => setActive(active === k ? null : k),
    tabIndex: 0,
    role: 'button',
    'aria-label': INFO[lang][k].title,
    style: { cursor: 'pointer', outline: 'none' } as React.CSSProperties,
  })
  const on = (k: NodeKey) => active === k
  const fill = (k: NodeKey) => (on(k) ? '#1a9e8f' : '#1a3a5c')
  const txt = (k: NodeKey) => (on(k) ? '#ffffff' : '#9fd8d0')
  const line = (k: NodeKey) => (on(k) ? 3 : 1.5)

  return (
    <div className="flex flex-col items-center" onMouseLeave={() => setActive(null)}>
      <svg width="400" height="380" viewBox="0 0 340 320" xmlns="http://www.w3.org/2000/svg">
        <circle cx="170" cy="160" r="130" fill="none" stroke="#1a3a5c" strokeWidth="1" />
        <circle cx="170" cy="160" r="88" fill="none" stroke="#1a3a5c" strokeWidth="1" className={active ? 'animate-pulse' : ''} />
        <line x1="170" y1="50" x2="170" y2="112" stroke="#1a9e8f" strokeWidth={line('top')} />
        <line x1="244" y1="138" x2="218" y2="150" stroke="#1a9e8f" strokeWidth={line('right')} />
        <line x1="170" y1="208" x2="170" y2="270" stroke="#1a9e8f" strokeWidth={line('bottom')} />
        <line x1="96" y1="138" x2="122" y2="150" stroke="#1a9e8f" strokeWidth={line('left')} />
        <circle cx="170" cy="160" r={active ? 52 : 48} fill="#1a9e8f" style={{ transition: 'r 200ms' }} />
        <text x="170" y="155" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Supply</text>
        <text x="170" y="172" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Chain</text>
        <g {...node('top')}>
          <rect x="86" y="14" width="168" height="36" rx="18" fill={fill('top')} stroke="#1a9e8f" strokeWidth="1" style={{ transition: 'fill 150ms' }} />
          <text x="170" y="37" textAnchor="middle" fill={txt('top')} fontSize="11">{labels.top}</text>
        </g>
        <g {...node('right')}>
          <rect x="240" y="120" width="96" height="36" rx="18" fill={fill('right')} stroke="#1a9e8f" strokeWidth="1" style={{ transition: 'fill 150ms' }} />
          <text x="288" y="138" textAnchor="middle" fill={txt('right')} fontSize="10">{labels.right1}</text>
          <text x="288" y="151" textAnchor="middle" fill={txt('right')} fontSize="10">{labels.right2}</text>
        </g>
        <g {...node('bottom')}>
          <rect x="94" y="270" width="152" height="36" rx="18" fill={fill('bottom')} stroke="#1a9e8f" strokeWidth="1" style={{ transition: 'fill 150ms' }} />
          <text x="170" y="293" textAnchor="middle" fill={txt('bottom')} fontSize="11">{labels.bottom}</text>
        </g>
        <g {...node('left')}>
          <rect x="4" y="120" width="96" height="36" rx="18" fill={fill('left')} stroke="#1a9e8f" strokeWidth="1" style={{ transition: 'fill 150ms' }} />
          <text x="52" y="135" textAnchor="middle" fill={txt('left')} fontSize="10">{labels.left1}</text>
          <text x="52" y="149" textAnchor="middle" fill={txt('left')} fontSize="10">{labels.left2}</text>
        </g>
      </svg>
      <div className="w-full max-w-sm min-h-[128px] mt-2">
        {info ? (
          <div className="rounded-xl border border-teal/40 bg-navy-deep/80 p-4">
            <div className="text-sm font-bold text-white mb-1">{info.title}</div>
            <p className="text-xs text-teal-muted leading-relaxed mb-3">{info.text}</p>
            <a href={info.link} className="text-xs font-semibold text-teal no-underline hover:text-white">{info.cta} →</a>
          </div>
        ) : (
          <p className="text-xs text-teal-muted/50 text-center pt-10">
            {lang === 'fr' ? 'Survolez un domaine pour en savoir plus' : lang === 'de' ? 'Bewegen Sie die Maus über ein Handlungsfeld' : 'Hover over an area to explore'}
          </p>
        )}
      </div>
    </div>
  )
}
