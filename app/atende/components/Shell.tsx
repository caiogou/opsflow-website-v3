'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageCircle,
  Inbox,
  CalendarDays,
  Scissors,
  LayoutDashboard,
  RotateCcw,
} from 'lucide-react'
import { resetData } from '../lib/store'
import { BUSINESS } from '../lib/types'

const NAV = [
  { href: '/atende', label: 'Painel', icon: LayoutDashboard, exact: true },
  { href: '/atende/simulador', label: 'Simulador (cliente)', icon: MessageCircle },
  { href: '/atende/inbox', label: 'Conversas', icon: Inbox },
  { href: '/atende/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/atende/servicos', label: 'Serviços', icon: Scissors },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      {/* Topo */}
      <header className="bg-navy border-b border-navy-mid">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zap flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">
                OpsFlow Atende
              </div>
              <div className="text-[11px] text-teal-muted/70">
                {BUSINESS.name} · {BUSINESS.city}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm('Recarregar os dados de demonstração? Isso apaga o que você criou no teste.')) {
                resetData()
              }
            }}
            className="flex items-center gap-1.5 text-[11px] text-teal-muted/70 hover:text-white transition-colors"
          >
            <RotateCcw size={13} /> Reiniciar demo
          </button>
        </div>
      </header>

      {/* Navegação */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-2 flex gap-1 overflow-x-auto">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-3 text-sm whitespace-nowrap border-b-2 transition-colors no-underline ${
                  active
                    ? 'border-zap text-navy font-semibold'
                    : 'border-transparent text-slate-500 hover:text-navy'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
