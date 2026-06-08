'use client'

import { useEffect, useState } from 'react'
import { Send, Phone, ArrowLeft, RotateCcw } from 'lucide-react'
import { Shell } from '../components/Shell'
import { MessageList } from '../components/MessageList'
import { useAtende, startConversation, sendCustomerMessage } from '../lib/store'
import { BUSINESS } from '../lib/types'

const SUGGESTIONS = ['Oi', 'Quero agendar um corte', '1', '2', '3', 'Sim', 'menu']

export default function SimuladorPage() {
  const state = useAtende()
  const [convId, setConvId] = useState<string | null>(null)
  const [text, setText] = useState('')

  // Inicia uma conversa nova ao abrir a tela.
  useEffect(() => {
    setConvId((prev) => prev ?? startConversation('Você (teste)', '+55 17 90000-0000'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const conv = state.conversations.find((c) => c.id === convId)

  function send(value: string) {
    const v = value.trim()
    if (!v || !convId) return
    sendCustomerMessage(convId, v)
    setText('')
  }

  function restart() {
    setConvId(startConversation('Você (teste)', '+55 17 90000-0000'))
  }

  return (
    <Shell>
      <div className="grid md:grid-cols-[380px_1fr] gap-8 items-start">
        {/* Telefone */}
        <div className="mx-auto w-full max-w-[380px]">
          <div className="rounded-[2rem] border-8 border-navy bg-navy shadow-2xl overflow-hidden">
            {/* Barra do WhatsApp */}
            <div className="bg-zap-deep px-4 py-3 flex items-center gap-3">
              <ArrowLeft size={18} className="text-white/80" />
              <div className="w-9 h-9 rounded-full bg-zap flex items-center justify-center text-white font-bold">
                {BUSINESS.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white leading-tight">
                  {BUSINESS.name}
                </div>
                <div className="text-[11px] text-white/70">
                  {conv?.assignedTo === 'negocio' ? 'atendente online' : 'responde na hora'}
                </div>
              </div>
              <Phone size={16} className="text-white/80" />
            </div>

            {/* Mensagens */}
            <div className="h-[460px] flex flex-col">
              <MessageList messages={conv?.messages ?? []} typing={conv?.pending} />

              {/* Sugestões rápidas */}
              <div className="flex gap-1.5 px-2 py-2 bg-zap-bg/60 overflow-x-auto border-t border-black/5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-2.5 py-1 rounded-full bg-white text-xs text-slate-600 border border-slate-200 whitespace-nowrap hover:bg-slate-50"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Caixa de envio */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  send(text)
                }}
                className="flex items-center gap-2 px-2 py-2 bg-zap-bg"
              >
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Digite como se fosse o cliente…"
                  className="flex-1 rounded-full px-4 py-2 text-sm bg-white border border-slate-200 outline-none focus:border-zap"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-zap flex items-center justify-center text-white shrink-0 hover:bg-zap-dark transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          <button
            onClick={restart}
            className="mt-3 mx-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-navy"
          >
            <RotateCcw size={13} /> Recomeçar conversa
          </button>
        </div>

        {/* Explicação */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-navy mb-2">
              Simulador do cliente
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Esta tela imita o WhatsApp do seu cliente. Converse com o robô como
              se você fosse a pessoa marcando um horário — ele faz o atendimento
              sozinho. Tudo o que acontecer aqui aparece em{' '}
              <strong>Conversas</strong> e os agendamentos vão direto para a{' '}
              <strong>Agenda</strong>.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              🤖 Com a IA ligada (chave da Anthropic configurada), o robô entende
              frases naturais como <em>"quero cortar o cabelo amanhã de tarde"</em>.
              Sem a chave, ele atende pelo menu de números — e tudo continua
              funcionando.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-navy mb-3">
              Experimente este roteiro:
            </div>
            <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
              <li>Digite <code className="bg-slate-100 px-1.5 py-0.5 rounded">Oi</code> para o robô te receber</li>
              <li>Digite <code className="bg-slate-100 px-1.5 py-0.5 rounded">1</code> para agendar</li>
              <li>Escolha o serviço, o profissional, o dia e o horário</li>
              <li>Confirme com <code className="bg-slate-100 px-1.5 py-0.5 rounded">SIM</code></li>
              <li>Abra a <strong>Agenda</strong> e veja o horário reservado ✨</li>
            </ol>
          </div>

          <div className="rounded-xl border border-zap/30 bg-zap/5 p-4 text-sm text-slate-600">
            💡 <strong>Dica:</strong> digite <code className="bg-white px-1.5 py-0.5 rounded border">3</code>{' '}
            no menu para simular o cliente pedindo um atendente humano — a conversa
            sai do robô e vai para você responder em <strong>Conversas</strong>.
          </div>
        </div>
      </div>
    </Shell>
  )
}
