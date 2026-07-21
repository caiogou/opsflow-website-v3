'use client'

import { LogoIcon } from '@/components/LogoIcon'
import { Package, TrendingUp, Shield, BarChart3, ArrowRight, Target } from 'lucide-react'

const MODULES = [
  {
    id: 'inventory',
    name: 'Stocks & fonds de roulement',
    icon: Package,
    practice: 'Domaine 1 — Excellence de planification',
    price: 'CHF 22–32K',
    description: 'Segmentation ABC/XYZ, identification des surstocks et obsolètes, optimisation du stock de sécurité, quantification du fonds de roulement libérable.',
    metrics: ['Jours de stock', 'Rotation des stocks', 'Valeur en excès', 'Coût des ruptures'],
    href: '/platform/inventory',
    recoverable: '1.83M',
  },
  {
    id: 'demand',
    name: 'Demande & prévision',
    icon: TrendingUp,
    practice: 'Domaine 1 — Excellence de planification',
    price: 'CHF 22–32K',
    description: 'Analyse de la fiabilité des prévisions, détection de biais, segmentation de la demande, recommandations de méthode par cluster de SKU.',
    metrics: ['MAPE', 'Biais de prévision', 'Volatilité de la demande', 'Fiabilité par famille'],
    href: '/platform/demand',
    recoverable: '1.52M',
  },
  {
    id: 'supply-risk',
    name: 'Risques & résilience',
    icon: Shield,
    practice: 'Domaine 2 — Résilience de l’approvisionnement',
    price: 'CHF 22–30K',
    description: 'Exposition mono-source, concentration fournisseurs, risque géographique, quantification du coût de rupture, feuille de route de double sourcing.',
    metrics: ['% mono-source', 'Risque de concentration', 'Coût de rupture', 'Répartition géographique'],
    href: '/platform/supply-risk',
    recoverable: '1.22M',
  },
  {
    id: 'kpis',
    name: 'KPIs & performance de planification',
    icon: BarChart3,
    practice: 'Domaine 1 — Excellence de planification',
    price: 'CHF 14–18K',
    description: 'Benchmark de tableau de bord équilibré, évaluation du rythme opérationnel, analyse des causes racines, quantification des écarts de KPI.',
    metrics: ['OTIF', 'Fiabilité des prévisions', 'Respect du plan', '% coût SC'],
    href: '/platform/kpis',
    recoverable: '1.06M',
  },
]

export default function PlatformIndex() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <div className="border-b border-navy-mid px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon size={32} />
            <div>
              <div className="text-base font-bold text-white">Plateforme de diagnostic OpsFlow</div>
              <div className="text-[11px] text-teal-muted/50">Diagnostics supply chain pilotés par les données</div>
            </div>
          </div>
          <a
            href="/"
            className="text-teal-muted text-xs hover:text-white transition-colors no-underline"
          >
            Retour au site
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold mb-4">
            <Target size={14} /> 4 modules de diagnostic
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-4">
            Quantifiez les écarts de votre supply chain.<br />
            <em className="text-teal not-italic">Voyez le coût de l’inaction.</em>
          </h1>
          <p className="text-teal-muted text-sm leading-relaxed max-w-xl mx-auto">
            Importez vos données, obtenez un bilan automatisé et recevez un tableau de bord de diagnostic complet, avec recommandations priorisées et quantification du ROI. Chaque module correspond à une mission OpsFlow précise.
          </p>
        </div>

        {/* Total recoverable */}
        <div className="rounded-2xl border-2 border-teal/20 bg-gradient-to-r from-teal/5 to-navy-deep/60 p-6 mb-8 text-center">
          <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-1">Valeur récupérable combinée (client type)</div>
          <div className="text-4xl font-extrabold text-white">CHF 5.63M</div>
          <div className="text-sm text-teal-muted mt-1">sur les 4 modules — industriel moyen, chiffre d’affaires CHF 50-200M</div>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {MODULES.map((mod) => (
            <a
              key={mod.id}
              href={mod.href}
              className="group rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 hover:border-teal/30 transition-all no-underline block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                  <mod.icon size={22} className="text-teal" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-navy-mid/40 text-teal-muted/50 text-[10px] border border-navy-mid/60">
                  {mod.price}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-teal transition-colors">{mod.name}</h3>
              <div className="text-[11px] text-teal/70 mb-3">{mod.practice}</div>
              <p className="text-xs text-teal-muted/50 leading-relaxed mb-4">{mod.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {mod.metrics.map((m) => (
                  <span key={m} className="px-2 py-0.5 rounded bg-navy-mid/30 text-teal-muted/40 text-[10px]">
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-navy-mid/40">
                <div>
                  <div className="text-[10px] text-teal-muted/30 uppercase tracking-wider">Valeur récupérable type</div>
                  <div className="text-lg font-extrabold text-teal">CHF {mod.recoverable}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                  <ArrowRight size={14} className="text-teal" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-8">
          <div className="text-sm font-semibold text-white mb-5 text-center">Comment ça marche</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            {[
              { step: '1', title: 'Importer les données', desc: 'Nos modèles ou vos propres exports' },
              { step: '2', title: 'Bilan', desc: 'Évaluation automatisée de la qualité des données' },
              { step: '3', title: 'Analyse', desc: 'Segmentation, benchmarks, tendances' },
              { step: '4', title: 'Tableau de bord', desc: 'Résultats visuels avec quantification du ROI' },
              { step: '5', title: 'Recommandations', desc: 'Actions priorisées + feuille de route 90 jours' },
            ].map((s) => (
              <div key={s.step} className="p-3">
                <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-2 text-teal text-sm font-bold">
                  {s.step}
                </div>
                <div className="text-xs font-semibold text-white mb-1">{s.title}</div>
                <div className="text-[10px] text-teal-muted/40">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://calendly.com/caio-opsflow-advisory/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-colors no-underline"
          >
            Réserver une session gratuite
          </a>
          <div className="text-xs text-teal-muted/30 mt-3">
            Vous ne savez pas quel module choisir ? Commençons par un échange.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-navy-mid/40">
        <div className="text-xs text-teal-muted/40">OpsFlow Advisory — Des supply chains plus intelligentes. Portées par l’humain. Augmentées par l’IA.</div>
        <div className="text-[10px] text-teal-muted/20 mt-1">opsflow-advisory.ch &middot; Nyon, Canton de Vaud, Suisse</div>
      </div>
    </div>
  )
}
