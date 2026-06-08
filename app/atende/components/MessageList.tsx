'use client'

import { useEffect, useRef } from 'react'
import { Message } from '../lib/types'
import { clockTime } from '../lib/format'

// Renderiza texto com *negrito* (estilo WhatsApp) e quebras de linha.
function renderText(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) {
      return <strong key={i}>{p.slice(1, -1)}</strong>
    }
    return <span key={i}>{p}</span>
  })
}

export function MessageList({ messages }: { messages: Message[] }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-zap-bg">
      {messages.length === 0 && (
        <div className="text-center text-xs text-slate-500 mt-8">
          Comece a conversa enviando uma mensagem 👇
        </div>
      )}
      {messages.map((m) => {
        const isCustomer = m.from === 'cliente'
        return (
          <div
            key={m.id}
            className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm whitespace-pre-wrap leading-relaxed ${
                isCustomer
                  ? 'bg-zap-bubble text-navy rounded-br-none'
                  : m.from === 'negocio'
                  ? 'bg-white text-navy rounded-bl-none border border-slate-200'
                  : 'bg-white text-navy rounded-bl-none'
              }`}
            >
              {m.from === 'negocio' && (
                <div className="text-[10px] font-semibold text-zap-dark mb-0.5">
                  Atendente
                </div>
              )}
              <div>{renderText(m.text)}</div>
              <div className="text-[10px] text-slate-400 text-right mt-1">
                {clockTime(m.at)}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={endRef} />
    </div>
  )
}
