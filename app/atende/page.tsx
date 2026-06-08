'use client'

import Link from 'next/link'
import {
  MessageCircle,
  CalendarDays,
  Inbox,
  Scissors,
  Bot,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Shell } from './components/Shell'
import { useAtende } from './lib/store'
import { brl, relativeDayLabel, minToTime, todayIso } from './lib/format'

export default function PainelPage() {
  const state = useAtende()
  const today = todayIso()

  const todayAppts = state.appointments
    .filter((a) => a.date === today && a.status !== 'cancelado')
    .sort((a, b) => a.startMin - b.startMin)

  const upcoming = state.appointments
    .filter((a) => a.date >= today && a.status === 'confirmado')
    .sort((a, b) => (a.date + a.startMin).localeCompare(b.date + b.startMin))
    .slice(0, 5)

  const faturadoHoje = todayAppts.reduce(
    (sum, a) => sum + (state.services.find((s) => s.id === a.serviceId)?.priceBRL ?? 0),
    0
  )
  const roboCount = state.appointments.filter((a) => a.source === 'robo').length
  const naoLidas = state.conversations.reduce((s, c) => s + c.unread, 0)

  const service = (id: string) => state.services.find((s) => s.id === id)
  const pro = (id: string) => state.professionals.find((p) => p.id === id)

  const KPIS = [
    {
      label: 'Agendamentos hoje',
      value: String(todayAppts.length),
      icon: CalendarDays,
    },
    { label: 'Previsto hoje', value: brl(faturadoHoje), icon: TrendingUp },
    {
      label: 'Marcados pelo robô',
      value: String(roboCount),
      icon: Bot,
    },
    {
      label: 'Conversas não lidas',
      value: String(naoLidas),
      icon: Inbox,
    },
  ]

  const ACTIONS = [
    {
      href: '/atende/simulador',
      title: 'Testar o atendimento',
      desc: 'Converse com o robô como se fosse um cliente.',
      icon: MessageCircle,
      accent: true,
    },
    {
      href: '/atende/inbox',
      title: 'Ver conversas',
      desc: 'Acompanhe e assuma conversas quando precisar.',
      icon: Inbox,
    },
    {
      href: '/atende/agenda',
      title: 'Abrir agenda',
      desc: 'Veja os horários marcados por dia.',
      icon: CalendarDays,
    },
    {
      href: '/atende/servicos',
      title: 'Configurar serviços',
      desc: 'Ajuste serviços, preços e profissionais.',
      icon: Scissors,
    },
  ]

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Bom dia! 👋</h1>
        <p className="text-sm text-slate-500">
          Aqui está um resumo do seu atendimento automático.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wide">
                {k.label}
              </span>
              <k.icon size={16} className="text-zap-dark" />
            </div>
            <div className="text-2xl font-bold text-navy">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Próximos agendamentos */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-sm font-bold text-navy">Próximos agendamentos</span>
            <Link
              href="/atende/agenda"
              className="text-xs text-zap-dark hover:underline no-underline"
            >
              Ver agenda
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              <Clock size={28} className="mx-auto mb-2 opacity-40" />
              Nenhum agendamento ainda. Faça um teste no Simulador.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {upcoming.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-1.5 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: pro(a.professionalId)?.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-navy truncate">
                      {service(a.serviceId)?.emoji} {service(a.serviceId)?.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {a.customerName} · {pro(a.professionalId)?.name}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-navy">
                      {relativeDayLabel(a.date)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {minToTime(a.startMin)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-1 gap-3 content-start">
          {ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`group flex items-center gap-3 rounded-xl border p-4 no-underline transition-colors ${
                a.accent
                  ? 'border-zap/40 bg-zap/5 hover:bg-zap/10'
                  : 'border-slate-200 bg-white hover:border-navy/30'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  a.accent ? 'bg-zap text-white' : 'bg-slate-100 text-navy'
                }`}
              >
                <a.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-navy">{a.title}</div>
                <div className="text-xs text-slate-500 truncate">{a.desc}</div>
              </div>
              <ArrowRight
                size={16}
                className="text-slate-300 group-hover:text-navy transition-colors shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  )
}
