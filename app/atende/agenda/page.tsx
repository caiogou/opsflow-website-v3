'use client'

import { useState } from 'react'
import { Check, X, Bot, Clock } from 'lucide-react'
import { Shell } from '../components/Shell'
import { useAtende, setAppointmentStatus } from '../lib/store'
import {
  addDaysIso,
  brl,
  minToTime,
  relativeDayLabel,
  todayIso,
  weekday,
} from '../lib/format'
import { BUSINESS } from '../lib/types'

const STATUS_STYLE: Record<string, string> = {
  confirmado: 'border-zap/40 bg-zap/5',
  concluido: 'border-slate-200 bg-slate-50 opacity-70',
  cancelado: 'border-red-200 bg-red-50 opacity-60 line-through',
}

export default function AgendaPage() {
  const state = useAtende()
  const [date, setDate] = useState(todayIso())

  const days = Array.from({ length: 7 }, (_, i) => addDaysIso(todayIso(), i))
  const closed = BUSINESS.closedWeekdays.includes(weekday(date))

  const dayAppts = state.appointments
    .filter((a) => a.date === date)
    .sort((a, b) => a.startMin - b.startMin)

  const service = (id: string) => state.services.find((s) => s.id === id)
  const pro = (id: string) => state.professionals.find((p) => p.id === id)

  const faturado = dayAppts
    .filter((a) => a.status !== 'cancelado')
    .reduce((sum, a) => sum + (service(a.serviceId)?.priceBRL ?? 0), 0)

  return (
    <Shell>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-navy">Agenda</h1>
        <div className="text-sm text-slate-500">
          {dayAppts.filter((a) => a.status !== 'cancelado').length} agendamento(s) ·{' '}
          <span className="font-semibold text-navy">{brl(faturado)}</span> previstos
        </div>
      </div>

      {/* Seletor de dias */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {days.map((d) => {
          const active = d === date
          const isClosed = BUSINESS.closedWeekdays.includes(weekday(d))
          const count = state.appointments.filter(
            (a) => a.date === d && a.status !== 'cancelado'
          ).length
          return (
            <button
              key={d}
              onClick={() => setDate(d)}
              className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap border transition-colors ${
                active
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-navy/40'
              }`}
            >
              {relativeDayLabel(d)}
              {isClosed ? (
                <span className="ml-1 text-[10px] opacity-60">(fechado)</span>
              ) : count > 0 ? (
                <span
                  className={`ml-1.5 text-[10px] rounded-full px-1.5 ${
                    active ? 'bg-white/20' : 'bg-zap/10 text-zap-dark'
                  }`}
                >
                  {count}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {closed ? (
        <div className="text-center py-16 text-slate-400">
          Fechado neste dia. 😴
        </div>
      ) : dayAppts.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Clock size={32} className="mx-auto mb-2 opacity-40" />
          Nenhum agendamento para {relativeDayLabel(date)}.
          <div className="text-xs mt-1">
            Faça um teste no <strong>Simulador</strong> que ele aparece aqui.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {dayAppts.map((a) => {
            const s = service(a.serviceId)
            const p = pro(a.professionalId)
            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${STATUS_STYLE[a.status]}`}
              >
                <div className="text-center w-16 shrink-0">
                  <div className="text-lg font-bold text-navy">
                    {minToTime(a.startMin)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {s?.durationMin} min
                  </div>
                </div>
                <div
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: p?.color ?? '#cbd5e1' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy flex items-center gap-2">
                    {s?.emoji} {s?.name}
                    {a.source === 'robo' && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-zap-dark bg-zap/10 px-1.5 py-0.5 rounded">
                        <Bot size={10} /> robô
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {a.customerName} · {p?.name} · {brl(s?.priceBRL ?? 0)}
                  </div>
                </div>
                {a.status === 'confirmado' && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setAppointmentStatus(a.id, 'concluido')}
                      title="Marcar como concluído"
                      className="w-8 h-8 rounded-lg bg-zap/10 text-zap-dark flex items-center justify-center hover:bg-zap/20"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      onClick={() => setAppointmentStatus(a.id, 'cancelado')}
                      title="Cancelar"
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
                {a.status !== 'confirmado' && (
                  <span className="text-[11px] text-slate-400 shrink-0 capitalize no-underline">
                    {a.status}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Shell>
  )
}
