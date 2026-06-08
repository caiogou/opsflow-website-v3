'use client'

import { useEffect, useState } from 'react'
import { Send, Bot, User, ArrowLeft } from 'lucide-react'
import { Shell } from '../components/Shell'
import { MessageList } from '../components/MessageList'
import {
  useAtende,
  sendBusinessMessage,
  takeOver,
  giveBackToBot,
  markRead,
} from '../lib/store'
import { clockTime } from '../lib/format'

export default function InboxPage() {
  const state = useAtende()
  const sorted = [...state.conversations].sort(
    (a, b) => b.lastActivity - a.lastActivity
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [text, setText] = useState('')

  // Seleciona a primeira conversa por padrão.
  useEffect(() => {
    if (!selectedId && sorted.length) setSelectedId(sorted[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted.length])

  useEffect(() => {
    if (selectedId) markRead(selectedId)
  }, [selectedId])

  const conv = state.conversations.find((c) => c.id === selectedId)

  function lastText(messages: typeof sorted[number]['messages']) {
    const m = messages[messages.length - 1]
    if (!m) return 'Sem mensagens'
    const prefix = m.from === 'cliente' ? '' : m.from === 'negocio' ? 'Você: ' : '🤖 '
    return prefix + m.text.replace(/\*/g, '').replace(/\n/g, ' ')
  }

  return (
    <Shell>
      <div className="grid md:grid-cols-[320px_1fr] gap-0 border border-slate-200 rounded-xl overflow-hidden bg-white h-[600px]">
        {/* Lista de conversas */}
        <div className={`border-r border-slate-200 overflow-y-auto ${conv ? 'hidden md:block' : ''}`}>
          <div className="px-4 py-3 border-b border-slate-200">
            <div className="text-sm font-bold text-navy">Conversas</div>
            <div className="text-[11px] text-slate-400">
              {sorted.length} conversas
            </div>
          </div>
          {sorted.map((c) => {
            const active = c.id === selectedId
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  active ? 'bg-zap/5' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold shrink-0">
                      {c.customerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy truncate">
                        {c.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {lastText(c.messages)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-slate-400">
                      {clockTime(c.lastActivity)}
                    </span>
                    {c.unread > 0 && (
                      <span className="bg-zap text-white text-[10px] rounded-full px-1.5 min-w-[18px] text-center">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-1.5">
                  {c.assignedTo === 'robo' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-zap-dark bg-zap/10 px-1.5 py-0.5 rounded">
                      <Bot size={10} /> Robô
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      <User size={10} /> Você
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Painel da conversa */}
        {conv ? (
          <div className="flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  className="md:hidden text-slate-400"
                  onClick={() => setSelectedId(null)}
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold">
                  {conv.customerName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-navy truncate">
                    {conv.customerName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {conv.customerPhone}
                  </div>
                </div>
              </div>
              {conv.assignedTo === 'robo' ? (
                <button
                  onClick={() => takeOver(conv.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-navy text-white hover:bg-navy-mid transition-colors whitespace-nowrap"
                >
                  Assumir conversa
                </button>
              ) : (
                <button
                  onClick={() => giveBackToBot(conv.id)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-zap text-white hover:bg-zap-dark transition-colors whitespace-nowrap"
                >
                  Devolver ao robô
                </button>
              )}
            </div>

            <MessageList messages={conv.messages} />

            {conv.assignedTo === 'negocio' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!text.trim()) return
                  sendBusinessMessage(conv.id, text.trim())
                  setText('')
                }}
                className="flex items-center gap-2 px-3 py-3 bg-white border-t border-slate-200"
              >
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Responder ao cliente…"
                  className="flex-1 rounded-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 outline-none focus:border-zap"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-zap flex items-center justify-center text-white shrink-0 hover:bg-zap-dark transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            ) : (
              <div className="px-4 py-3 bg-zap/5 border-t border-slate-200 text-center text-xs text-slate-500">
                🤖 O robô está cuidando desta conversa. Clique em{' '}
                <strong>Assumir conversa</strong> para responder você mesmo.
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-center text-slate-400 text-sm">
            Selecione uma conversa
          </div>
        )}
      </div>
    </Shell>
  )
}
