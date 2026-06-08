'use client'

import { useState } from 'react'
import { Plus, Trash2, Scissors, Users } from 'lucide-react'
import { Shell } from '../components/Shell'
import {
  useAtende,
  addService,
  removeService,
  addProfessional,
  removeProfessional,
} from '../lib/store'
import { brl } from '../lib/format'

const COLORS = ['#1a9e8f', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444']

export default function ServicosPage() {
  const state = useAtende()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('30')
  const [emoji, setEmoji] = useState('')

  const [proName, setProName] = useState('')

  function handleAddService(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !price) return
    addService({
      name: name.trim(),
      priceBRL: Number(price),
      durationMin: Number(duration) || 30,
      emoji: emoji.trim() || '💈',
    })
    setName('')
    setPrice('')
    setDuration('30')
    setEmoji('')
  }

  function handleAddPro(e: React.FormEvent) {
    e.preventDefault()
    if (!proName.trim()) return
    const color = COLORS[state.professionals.length % COLORS.length]
    addProfessional(proName.trim(), color)
    setProName('')
  }

  return (
    <Shell>
      <h1 className="text-2xl font-bold text-navy mb-1">Serviços & profissionais</h1>
      <p className="text-sm text-slate-500 mb-6">
        O robô usa exatamente esta lista no atendimento. Mexa aqui e teste no
        Simulador.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Serviços */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
            <Scissors size={16} className="text-zap-dark" />
            <span className="text-sm font-bold text-navy">Serviços</span>
          </div>
          <div className="divide-y divide-slate-100">
            {state.services.map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-lg w-7 text-center">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-navy truncate">
                    {s.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {s.durationMin} min
                  </div>
                </div>
                <div className="text-sm font-semibold text-navy">
                  {brl(s.priceBRL)}
                </div>
                <button
                  onClick={() => removeService(s.id)}
                  className="text-slate-300 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddService} className="p-4 border-t border-slate-200 space-y-2 bg-slate-50">
            <div className="flex gap-2">
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="💈"
                className="w-12 text-center rounded-lg px-2 py-2 text-sm border border-slate-200 outline-none focus:border-zap"
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do serviço"
                className="flex-1 rounded-lg px-3 py-2 text-sm border border-slate-200 outline-none focus:border-zap"
              />
            </div>
            <div className="flex gap-2">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Preço (R$)"
                className="flex-1 rounded-lg px-3 py-2 text-sm border border-slate-200 outline-none focus:border-zap"
              />
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                type="number"
                step={15}
                placeholder="min"
                className="w-24 rounded-lg px-3 py-2 text-sm border border-slate-200 outline-none focus:border-zap"
              />
              <button
                type="submit"
                className="px-3 rounded-lg bg-zap text-white flex items-center gap-1 text-sm hover:bg-zap-dark"
              >
                <Plus size={15} /> Add
              </button>
            </div>
          </form>
        </div>

        {/* Profissionais */}
        <div className="rounded-xl border border-slate-200 bg-white h-fit">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
            <Users size={16} className="text-zap-dark" />
            <span className="text-sm font-bold text-navy">Profissionais</span>
          </div>
          <div className="divide-y divide-slate-100">
            {state.professionals.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <div className="flex-1 text-sm font-medium text-navy">
                  {p.name}
                </div>
                <button
                  onClick={() => removeProfessional(p.id)}
                  className="text-slate-300 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddPro} className="p-4 border-t border-slate-200 flex gap-2 bg-slate-50">
            <input
              value={proName}
              onChange={(e) => setProName(e.target.value)}
              placeholder="Nome do profissional"
              className="flex-1 rounded-lg px-3 py-2 text-sm border border-slate-200 outline-none focus:border-zap"
            />
            <button
              type="submit"
              className="px-3 rounded-lg bg-zap text-white flex items-center gap-1 text-sm hover:bg-zap-dark"
            >
              <Plus size={15} /> Add
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        <strong className="text-navy">Horário de funcionamento:</strong> 09:00 às
        19:00, fechado aos domingos. (Em breve dá pra configurar por aqui também.)
      </div>
    </Shell>
  )
}
