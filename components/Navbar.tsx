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
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 no-underline">
          <LogoIcon size={34} />
          <span className="text-base md:text-lg font-bold text-white tracking-tight">OpsFlow Advisory</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-teal-muted text-sm hover:text-white transition-colors no-underline">{l.label}</a>
          ))}
          <a href="https://calendly.com/caio-opsflow-advisory/30min" target="_blank" rel="noopener noreferrer" className="bg-teal text-white px-5 py-2 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">Book a session</a>
        </div>
        <a href="https://calendly.com/caio-opsflow-advisory/30min" target="_blank" rel="noopener noreferrer" className="md:hidden bg-teal text-white px-4 py-2 rounded text-xs font-semibold hover:bg-teal-light transition-colors no-underline">Book session</a>
      </div>
    </nav>
  )
}

export function Hero() {
  return (
    <section className="bg-navy py-16 px-6 md:py-24 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-5">Supply chain advisory · EMEA</p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-white leading-tight mb-6">
            Supply chain excellence for{' '}
            <em className="text-teal not-italic">companies across EMEA</em>
          </h1>
          <p className="text-lg text-teal-muted leading-relaxed mb-10 max-w-lg">
            We design and implement supply chain processes that deliver real margin and working capital impact — structured planning, leaner inventory, stronger operations.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="https://calendly.com/caio-opsflow-advisory/30min" target="_blank" rel="noopener noreferrer" className="bg-teal text-white px-9 py-4 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">Book free 90-min session</a>
            <a href="#how" className="text-teal-muted border border-navy-mid px-7 py-4 rounded text-sm hover:border-teal-muted transition-colors no-underline">See how it works</a>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <svg width="320" height="300" viewBox="0 0 340 320" xmlns="http://www.w3.org/2000/svg">
            <circle cx="170" cy="160" r="130" fill="none" stroke="#1a3a5c" strokeWidth="1" />
            <circle cx="170" cy="160" r="88" fill="none" stroke="#1a3a5c" strokeWidth="1" />
            <circle cx="170" cy="160" r="48" fill="#1a9e8f" />
            <text x="170" y="155" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Supply</text>
            <text x="170" y="172" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Chain</text>
            <rect x="94" y="14" width="152" height="36" rx="18" fill="#1a3a5c" stroke="#1a9e8f" strokeWidth="1" />
            <text x="170" y="37" textAnchor="middle" fill="#9fd8d0" fontSiz
