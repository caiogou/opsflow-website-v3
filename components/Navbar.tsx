'use client'

import { LogoIcon } from './LogoIcon'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how' },
  { label: 'Why OpsFlow', href: '#why' },
  { label: 'Cases', href: '#cases' },
]

export function Navbar() {
  return (
    <nav className="bg-navy sticky top-0 z-50 border-b border-navy-mid">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 no-underline">
          <LogoIcon size={34} />
          <span className="text-lg font-bold text-white tracking-tight">OpsFlow Advisory</span>
        </a>
        <div className="flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-teal-muted text-sm hover:text-white transition-colors no-underline"
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:caio@opsflow-advisory.ch"
            className="bg-teal text-white px-5 py-2 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline"
          >
            Book a session
          </a>
        </div>
      </div>
    </nav>
  )
}
