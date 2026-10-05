'use client'

import { useState } from 'react'
import { LogoIcon } from './LogoIcon'

type Lang = 'fr' | 'en' | 'de'

// Métricas + témoignage du cas restent masqués tant que le client n'a pas confirmé chiffres/citation.
const SHOW_CASE_METRICS = false

const DICT: Record<Lang, Record<string, string>> = {
  fr: {
    cta: 'Diagnostic gratuit (45 min)',
    brandTag: 'Une division d’OpsFlow',
    heroH1: 'Des processus plus simples.',
    heroH1em: 'Une équipe capable de les faire tourner.',
    heroSub:
      'OpsFlow Academy prend un processus précis de votre entreprise : l’intégration des nouveaux collaborateurs, la vente, la coordination entre services. Nous le simplifions, puis nous construisons le programme qui rend votre équipe autonome. En quelques semaines.',
    heroCta: 'Réserver le diagnostic',
    heroNote: 'PME · Suisse romande · sur site ou à distance',
    chKick: 'Vous cherchez quoi ?',
    chTitle: 'Le niveau de l’entreprise, ou celui de l’équipe ?',
    ch1who: 'Pour la direction',
    ch1desc: 'Supply chain, S&OP, planification de l’entreprise entière.',
    ch1btn: 'Voir Advisory →',
    ch2who: 'Pour les équipes',
    ch2desc: 'Un processus précis, simplifié — et l’équipe formée pour le faire tourner.',
    ch2here: 'Vous êtes ici ↓',
    familiarKick: 'Points de départ',
    familiarTitle: 'Trois situations que nous rencontrons souvent.',
    p1t: 'L’intégration prend des mois',
    p1d: 'Les nouveaux collaborateurs dépendent longtemps de leurs collègues avant de travailler de manière autonome.',
    p2t: 'La vente repose sur une ou deux personnes',
    p2d: 'Chacun vend à sa manière ; les résultats varient d’un mois à l’autre.',
    p3t: 'Un processus vit dans une seule tête',
    p3d: 'Le savoir-faire n’est ni documenté ni transmis. Une absence suffit à tout ralentir.',
    diffKick: 'Notre approche',
    diffTitle: 'Le programme est construit pour durer sans nous.',
    diffBody:
      'Nous améliorons le processus, nous construisons le programme de formation correspondant, et nous formons vos responsables à le transmettre. À la fin du mandat, le fonctionnement vous appartient : les supports, la méthode et la capacité de le maintenir.',
    methodKick: 'La méthode',
    methodTitle: 'Quatre étapes, toujours les mêmes.',
    s1t: 'Diagnostiquer',
    s1d: 'Comprendre le processus actuel et identifier où l’équipe perd du temps.',
    s2t: 'Simplifier',
    s2d: 'Redéfinir le processus : clair, documenté, réaliste.',
    s3t: 'Former',
    s3d: 'Construire le programme qui apprend à l’équipe à travailler selon le nouveau processus.',
    s4t: 'Transmettre',
    s4d: 'Former vos responsables à faire vivre le programme. Sans dépendance externe.',
    areasKick: 'Domaines d’application',
    areasTitle: 'Le même travail, appliqué à quatre domaines.',
    a1t: 'Intégration des nouveaux collaborateurs',
    a1d: 'Réduire le temps entre l’arrivée et l’autonomie.',
    a2t: 'Processus de vente',
    a2d: 'Une méthode commune pour toute l’équipe commerciale.',
    a3t: 'Coordination entre services',
    a3d: 'Vente, opérations et finances sur un rythme partagé.',
    a4t: 'Processus internes',
    a4d: 'Un flux de travail repensé, documenté, et une équipe formée.',
    ladderKick: 'Déroulement',
    ladderTitle: 'Du premier échange au programme en place',
    l1t: 'Diagnostic',
    l1d: '45 minutes, gratuit. Un échange structuré sur le processus concerné ; vous repartez avec notre lecture de la situation.',
    l2t: 'Process & Capability Sprint©',
    l2d: 'La construction et la mise en place du programme, en quelques semaines.',
    l3t: 'Suivi',
    l3d: 'Un accompagnement léger, optionnel, pour ancrer le fonctionnement dans la durée.',
    proofKick: 'Référence',
    proofTitle: 'Une PME de l’ameublement',
    caseIntro:
      'Pour une PME du secteur de l’ameublement, nous avons construit le programme d’intégration et de vente de l’équipe commerciale. Il a été mis en place par les responsables de l’entreprise eux-mêmes et fonctionne depuis sans intervention externe.',
    ctaTitle: 'Parlons de votre processus.',
    ctaBody:
      'Le diagnostic dure 45 minutes et n’engage à rien. Vous repartez avec une lecture claire de la situation, que nous travaillions ensemble par la suite ou non.',
    ctaBtn: 'Réserver le diagnostic',
    footer: 'OpsFlow Academy · EkoPolymers Europe Sàrl · Canton de Vaud, Suisse',
  },
  en: {
    cta: 'Free diagnostic (45 min)',
    brandTag: 'An OpsFlow division',
    heroH1: 'Simpler processes.',
    heroH1em: 'A team able to run them.',
    heroSub:
      'OpsFlow Academy takes one specific process in your company: new-hire onboarding, sales, coordination between departments. We simplify it, then build the program that makes your team autonomous. Within weeks.',
    heroCta: 'Book the diagnostic',
    heroNote: 'SMEs · French-speaking Switzerland · on site or remote',
    chKick: 'What are you looking for?',
    chTitle: 'The company level, or the team level?',
    ch1who: 'For leadership',
    ch1desc: 'Supply chain, S&OP, planning for the whole company.',
    ch1btn: 'See Advisory →',
    ch2who: 'For teams',
    ch2desc: 'One specific process, simplified — and the team trained to run it.',
    ch2here: 'You are here ↓',
    familiarKick: 'Starting points',
    familiarTitle: 'Three situations we come across often.',
    p1t: 'Onboarding takes months',
    p1d: 'New hires depend on colleagues for a long time before working autonomously.',
    p2t: 'Sales rest on one or two people',
    p2d: 'Everyone sells their own way; results vary from month to month.',
    p3t: 'A process lives in a single head',
    p3d: 'The know-how is neither documented nor passed on. One absence is enough to slow everything down.',
    diffKick: 'Our approach',
    diffTitle: 'The program is built to last without us.',
    diffBody:
      'We improve the process, build the corresponding training program, and train your managers to pass it on. At the end of the engagement, the operation belongs to you: the materials, the method, and the ability to maintain it.',
    methodKick: 'The method',
    methodTitle: 'Four steps, always the same.',
    s1t: 'Diagnose',
    s1d: 'Understand the current process and identify where the team loses time.',
    s2t: 'Simplify',
    s2d: 'Redesign the process: clear, documented, realistic.',
    s3t: 'Train',
    s3d: 'Build the program that teaches the team to work with the new process.',
    s4t: 'Hand over',
    s4d: 'Train your managers to keep the program alive. No external dependency.',
    areasKick: 'Fields of application',
    areasTitle: 'The same work, applied to four areas.',
    a1t: 'New-hire onboarding',
    a1d: 'Shorten the time between arrival and autonomy.',
    a2t: 'Sales process',
    a2d: 'One shared method for the whole sales team.',
    a3t: 'Coordination between departments',
    a3d: 'Sales, operations and finance on one shared rhythm.',
    a4t: 'Internal processes',
    a4d: 'A workflow redesigned, documented, and a team trained in it.',
    ladderKick: 'How it works',
    ladderTitle: 'From first conversation to a running program',
    l1t: 'Diagnostic',
    l1d: '45 minutes, free of charge. A structured conversation about the process at hand; you leave with our reading of the situation.',
    l2t: 'Process & Capability Sprint©',
    l2d: 'Building and implementing the program, within weeks.',
    l3t: 'Follow-up',
    l3d: 'Light, optional support to consolidate the way of working over time.',
    proofKick: 'Reference',
    proofTitle: 'A home-furnishing SME',
    caseIntro:
      'For an SME in the home-furnishing sector, we built the sales team’s onboarding and sales program. It was put in place by the company’s own managers and has run without external involvement since.',
    ctaTitle: 'Let’s talk about your process.',
    ctaBody:
      'The diagnostic takes 45 minutes and comes with no obligation. You leave with a clear reading of the situation, whether we work together afterwards or not.',
    ctaBtn: 'Book the diagnostic',
    footer: 'OpsFlow Academy · EkoPolymers Europe Sàrl · Canton of Vaud, Switzerland',
  },
  de: {
    cta: 'Kostenlose Diagnose (45 Min.)',
    brandTag: 'Ein Bereich von OpsFlow',
    heroH1: 'Einfachere Prozesse.',
    heroH1em: 'Ein Team, das sie selbst führt.',
    heroSub:
      'Die OpsFlow Academy nimmt einen konkreten Prozess in Ihrem Unternehmen: das Onboarding neuer Mitarbeitender, den Vertrieb, die Abstimmung zwischen Abteilungen. Wir vereinfachen ihn und bauen das Programm, das Ihr Team eigenständig macht. In wenigen Wochen.',
    heroCta: 'Diagnose buchen',
    heroNote: 'KMU · Schweiz · vor Ort oder aus der Ferne',
    chKick: 'Wonach suchen Sie?',
    chTitle: 'Die Unternehmensebene oder die Teamebene?',
    ch1who: 'Für die Geschäftsleitung',
    ch1desc: 'Supply Chain, S&OP, Planung des gesamten Unternehmens.',
    ch1btn: 'Advisory ansehen →',
    ch2who: 'Für die Teams',
    ch2desc: 'Ein konkreter Prozess, vereinfacht – und das Team geschult, um ihn zu führen.',
    ch2here: 'Sie sind hier ↓',
    familiarKick: 'Ausgangslagen',
    familiarTitle: 'Drei Situationen, die uns oft begegnen.',
    p1t: 'Das Onboarding dauert Monate',
    p1d: 'Neue Mitarbeitende sind lange auf ihre Kolleginnen und Kollegen angewiesen, bevor sie eigenständig arbeiten.',
    p2t: 'Der Vertrieb hängt an ein, zwei Personen',
    p2d: 'Jeder verkauft auf seine Art; die Ergebnisse schwanken von Monat zu Monat.',
    p3t: 'Ein Prozess lebt in einem einzigen Kopf',
    p3d: 'Das Know-how ist weder dokumentiert noch weitergegeben. Eine Abwesenheit genügt, um alles zu verlangsamen.',
    diffKick: 'Unser Ansatz',
    diffTitle: 'Das Programm ist gebaut, um ohne uns zu bestehen.',
    diffBody:
      'Wir verbessern den Prozess, bauen das passende Schulungsprogramm und befähigen Ihre Führungskräfte, es weiterzugeben. Am Ende des Mandats gehört Ihnen das Ganze: die Unterlagen, die Methode und die Fähigkeit, es aufrechtzuerhalten.',
    methodKick: 'Die Methode',
    methodTitle: 'Vier Schritte, immer dieselben.',
    s1t: 'Diagnostizieren',
    s1d: 'Den aktuellen Prozess verstehen und erkennen, wo das Team Zeit verliert.',
    s2t: 'Vereinfachen',
    s2d: 'Den Prozess neu definieren: klar, dokumentiert, realistisch.',
    s3t: 'Schulen',
    s3d: 'Das Programm bauen, das dem Team beibringt, nach dem neuen Prozess zu arbeiten.',
    s4t: 'Übergeben',
    s4d: 'Ihre Führungskräfte befähigen, das Programm am Leben zu halten. Ohne externe Abhängigkeit.',
    areasKick: 'Anwendungsbereiche',
    areasTitle: 'Dieselbe Arbeit, angewandt auf vier Bereiche.',
    a1t: 'Onboarding neuer Mitarbeitender',
    a1d: 'Die Zeit zwischen Eintritt und Eigenständigkeit verkürzen.',
    a2t: 'Vertriebsprozess',
    a2d: 'Eine gemeinsame Methode für das ganze Vertriebsteam.',
    a3t: 'Abstimmung zwischen Abteilungen',
    a3d: 'Vertrieb, Betrieb und Finanzen im gleichen Takt.',
    a4t: 'Interne Prozesse',
    a4d: 'Ein neu gedachter, dokumentierter Arbeitsablauf und ein geschultes Team.',
    ladderKick: 'Ablauf',
    ladderTitle: 'Vom ersten Gespräch zum laufenden Programm',
    l1t: 'Diagnose',
    l1d: '45 Minuten, kostenlos. Ein strukturiertes Gespräch über den betreffenden Prozess; Sie gehen mit unserer Einschätzung der Lage.',
    l2t: 'Process & Capability Sprint©',
    l2d: 'Der Aufbau und die Einführung des Programms, in wenigen Wochen.',
    l3t: 'Begleitung',
    l3d: 'Eine leichte, optionale Begleitung, um das Funktionieren dauerhaft zu verankern.',
    proofKick: 'Referenz',
    proofTitle: 'Ein KMU aus der Möbelbranche',
    caseIntro:
      'Für ein KMU aus der Möbelbranche haben wir das Onboarding- und Vertriebsprogramm des Verkaufsteams aufgebaut. Es wurde von den Führungskräften des Unternehmens selbst eingeführt und läuft seither ohne externes Zutun.',
    ctaTitle: 'Sprechen wir über Ihren Prozess.',
    ctaBody:
      'Die Diagnose dauert 45 Minuten und ist unverbindlich. Sie gehen mit einer klaren Einschätzung der Lage – ob wir danach zusammenarbeiten oder nicht.',
    ctaBtn: 'Diagnose buchen',
    footer: 'OpsFlow Academy · EkoPolymers Europe Sàrl · Kanton Waadt, Schweiz',
  },
}

// TODO: remplacer par le lien Calendly « Diagnostic 45 min » lorsqu'il sera créé.
const BOOK_HREF = 'https://calendly.com/caio-opsflow-advisory/30min'

const LANGS: Lang[] = ['fr', 'en', 'de']

export function AcademyContent() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = DICT[lang]

  return (
    <div lang={lang}>
      {/* Header */}
      <nav className="bg-navy sticky top-0 z-50 border-b border-navy-mid">
        <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 no-underline">
            <LogoIcon size={34} />
            <span className="text-base md:text-lg font-bold text-white tracking-tight">
              OpsFlow <span className="text-teal">Academy</span>
            </span>
          </a>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 border border-navy-mid rounded-full p-1">
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full transition-colors ${
                    lang === l ? 'bg-teal text-white' : 'text-teal-muted hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <a
              href={BOOK_HREF}
              className="hidden md:inline-block bg-teal text-white px-5 py-2 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy py-16 px-6 md:py-24 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-5">{t.brandTag}</p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-white leading-tight max-w-3xl">
            {t.heroH1} <span className="text-teal">{t.heroH1em}</span>
          </h1>
          <p className="text-lg text-teal-muted leading-relaxed mt-6 max-w-2xl">{t.heroSub}</p>
          <div className="mt-9 flex items-center gap-5 flex-wrap">
            <a
              href={BOOK_HREF}
              className="bg-teal text-white px-9 py-4 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline"
            >
              {t.heroCta}
            </a>
            <span className="text-sm text-teal-muted tracking-wide">{t.heroNote}</span>
          </div>
        </div>
      </section>

      {/* Chooser — Academy vs Advisory */}
      <section className="py-16 px-6 md:py-20 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-3">{t.chKick}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy leading-tight">
            {t.chTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            <div className="border border-gray-200 rounded-2xl p-7 flex flex-col border-t-4 border-t-navy">
              <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">{t.ch1who}</p>
              <h3 className="text-xl font-bold text-navy mb-2">OpsFlow Advisory</h3>
              <p className="text-sm text-gray-500 mb-5">{t.ch1desc}</p>
              <a
                href="/"
                className="mt-auto self-start bg-navy text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-navy-mid transition-colors no-underline"
              >
                {t.ch1btn}
              </a>
            </div>
            <div className="border border-gray-200 rounded-2xl p-7 flex flex-col border-t-4 border-t-teal bg-teal-pale/40">
              <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">{t.ch2who}</p>
              <h3 className="text-xl font-bold text-navy mb-2">OpsFlow Academy</h3>
              <p className="text-sm text-gray-500 mb-5">{t.ch2desc}</p>
              <span className="mt-auto self-start bg-white border border-gray-200 text-gray-500 px-4 py-2.5 rounded-full text-sm font-semibold">
                {t.ch2here}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pains */}
      <section className="py-16 px-6 md:py-20 md:px-8 bg-teal-pale/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.familiarKick}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy leading-tight mb-10">
            {t.familiarTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              [t.p1t, t.p1d],
              [t.p2t, t.p2d],
              [t.p3t, t.p3d],
            ].map(([title, desc], i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-7 border-t-4 border-t-teal">
                <h3 className="text-base font-bold text-navy mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-16 px-6 md:py-20 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.diffKick}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy leading-tight mb-4">
            {t.diffTitle}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{t.diffBody}</p>
        </div>
      </section>

      {/* Method */}
      <section className="pb-16 px-6 md:pb-24 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.methodKick}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy leading-tight mb-10">
            {t.methodTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              [t.s1t, t.s1d],
              [t.s2t, t.s2d],
              [t.s3t, t.s3d],
              [t.s4t, t.s4d],
            ].map(([title, desc], i) => (
              <div key={i}>
                <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center text-white text-xl font-serif mb-4">
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-navy mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16 px-6 md:py-24 md:px-8 bg-navy-deep">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal-light uppercase mb-4">{t.areasKick}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-white leading-tight mb-10">
            {t.areasTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ['01', t.a1t, t.a1d],
              ['02', t.a2t, t.a2d],
              ['03', t.a3t, t.a3d],
              ['04', t.a4t, t.a4d],
            ].map(([num, title, desc], i) => (
              <div key={i} className="border border-navy-mid rounded-2xl p-7 bg-white/[0.03]">
                <h3 className="text-lg text-white mb-2">
                  <span className="text-teal-muted font-bold mr-2">{num}</span>
                  {title}
                </h3>
                <p className="text-sm text-teal-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ladder */}
      <section className="py-16 px-6 md:py-24 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.ladderKick}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy leading-tight mb-10">
            {t.ladderTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[
              [t.l1t, t.l1d],
              [t.l2t, t.l2d],
              [t.l3t, t.l3d],
            ].map(([title, desc], i, arr) => (
              <div key={i} className="relative">
                {i < arr.length - 1 && (
                  <div className="hidden md:flex absolute top-4 left-full w-12 items-center justify-center text-teal text-2xl -translate-x-6">
                    →
                  </div>
                )}
                <div className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center text-sm font-bold mb-3">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case */}
      <section className="py-16 px-6 md:py-24 md:px-8 bg-teal-pale/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-3">{t.proofKick}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy leading-tight mb-4">
            {t.proofTitle}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{t.caseIntro}</p>
          {SHOW_CASE_METRICS && (
            <div className="mt-6 text-sm text-gray-400 italic">{/* chiffres à activer */}</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 md:py-24 md:px-8 bg-teal text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-5">{t.ctaTitle}</h2>
          <p className="text-base md:text-lg text-emerald-50 leading-relaxed mb-8 md:mb-10">{t.ctaBody}</p>
          <a
            href={BOOK_HREF}
            className="inline-block bg-white text-navy px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:opacity-90 transition-opacity no-underline"
          >
            {t.ctaBtn}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <span className="text-base font-bold text-white">
            OpsFlow <span className="text-teal">Academy</span>
          </span>
          <span className="text-xs text-slate-500 text-center">{t.footer}</span>
        </div>
      </footer>
    </div>
  )
}

