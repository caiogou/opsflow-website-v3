'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'AI Solutions', href: '/#ai-solutions' },
  { label: 'How it works', href: '/#how' },
  { label: 'Why Now', href: '/#why-now' },
  { label: 'S&OP Assessment', href: '/diagnostic' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[#0A1A2F] sticky top-0 z-50 border-b border-[#132D4A]">
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center">
            <span className="text-white font-bold text-sm">OF</span>
          </div>
          <span className="text-base md:text-lg font-bold text-white tracking-tight">OpsFlow Advisory</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-[#5EEAD4] text-sm hover:text-white transition-colors no-underline">{l.label}</a>
          ))}
          <a
            href="https://calendly.com/caio-opsflow-advisory/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0D9488] text-white px-5 py-2 rounded text-sm font-semibold hover:bg-[#14B8A6] transition-colors no-underline"
          >
            Book a session
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0A1A2F] border-t border-[#132D4A] px-6 py-4 space-y-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block text-[#5EEAD4] text-sm hover:text-white transition-colors no-underline py-2">{l.label}</a>
          ))}
          <a
            href="https://calendly.com/caio-opsflow-advisory/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#0D9488] text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-[#14B8A6] transition-colors no-underline mt-2"
          >
            Book a session
          </a>
        </div>
      )}
    </nav>
  )
}
