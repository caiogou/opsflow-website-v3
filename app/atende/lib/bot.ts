import {
  AtendeState,
  Appointment,
  BUSINESS,
  Conversation,
  Service,
} from './types'
import {
  addDaysIso,
  brl,
  minToTime,
  relativeDayLabel,
  todayIso,
  weekday,
} from './format'

export interface BotResult {
  replies: string[]
  patch: Partial<Conversation>
  newAppointment?: Appointment
}

const uid = () => Math.random().toString(36).slice(2, 10)

// --- Disponibilidade de horários ---------------------------------------

function isClosed(iso: string): boolean {
  return BUSINESS.closedWeekdays.includes(weekday(iso))
}

function slotsForPro(
  state: AtendeState,
  proId: string,
  iso: string,
  durationMin: number
): number[] {
  const out: number[] = []
  const busy = state.appointments.filter(
    (a) =>
      a.professionalId === proId &&
      a.date === iso &&
      a.status !== 'cancelado'
  )
  for (
    let start = BUSINESS.openMin;
    start + durationMin <= BUSINESS.closeMin;
    start += BUSINESS.slotStepMin
  ) {
    const end = start + durationMin
    const overlap = busy.some((a) => {
      const aEnd = a.startMin + serviceDuration(state, a.serviceId)
      return start < aEnd && end > a.startMin
    })
    if (!overlap) out.push(start)
  }
  return out
}

function serviceDuration(state: AtendeState, serviceId: string): number {
  return state.services.find((s) => s.id === serviceId)?.durationMin ?? 30
}

// Horários livres considerando "qualquer profissional" (união) ou um específico.
export function availableSlots(
  state: AtendeState,
  proId: string,
  iso: string,
  durationMin: number
): number[] {
  if (isClosed(iso)) return []
  if (proId !== 'any') return slotsForPro(state, proId, iso, durationMin)
  const set = new Set<number>()
  for (const p of state.professionals) {
    for (const s of slotsForPro(state, p.id, iso, durationMin)) set.add(s)
  }
  return Array.from(set).sort((a, b) => a - b)
}

// Encontra um profissional livre num horário (para reservas "qualquer um").
function firstFreePro(
  state: AtendeState,
  iso: string,
  startMin: number,
  durationMin: number
): string | undefined {
  return state.professionals.find((p) =>
    slotsForPro(state, p.id, iso, durationMin).includes(startMin)
  )?.id
}

// Próximos dias abertos (até 6 opções).
function openDays(): string[] {
  const out: string[] = []
  let iso = todayIso()
  for (let i = 0; out.length < 6 && i < 14; i++) {
    if (!isClosed(iso)) out.push(iso)
    iso = addDaysIso(iso, 1)
  }
  return out
}

// --- Helpers de texto ---------------------------------------------------

function parseChoice(text: string, options: { key: string }[]): string | null {
  const t = text.trim().toLowerCase()
  const direct = options.find((o) => o.key === t)
  if (direct) return direct.key
  const num = t.match(/^\d+/)
  if (num && options.some((o) => o.key === num[0])) return num[0]
  return null
}

function serviceLine(s: Service): string {
  return `${s.emoji ?? '•'} ${s.name} — ${brl(s.priceBRL)} (${s.durationMin} min)`
}

function greeting(): string {
  return `Olá! 👋 Seja bem-vindo(a) à *${BUSINESS.name}*.\nSou o atendente virtual e te ajudo rapidinho. É só digitar o número da opção:\n\n1️⃣ Agendar horário\n2️⃣ Ver serviços e preços\n3️⃣ Falar com um atendente`
}

// --- Máquina de estados do robô ----------------------------------------

export function runBot(
  state: AtendeState,
  conv: Conversation,
  text: string
): BotResult {
  const ctx = { ...conv.botCtx }
  const replies: string[] = []

  // Atalhos globais
  const t = text.trim().toLowerCase()
  if (['menu', 'início', 'inicio', 'oi', 'olá', 'ola'].includes(t) && conv.botState !== 'novo') {
    replies.push(greeting())
    return { replies, patch: { botState: 'menu', botCtx: {} } }
  }

  switch (conv.botState) {
    case 'novo': {
      replies.push(greeting())
      return { replies, patch: { botState: 'menu', botCtx: {} } }
    }

    case 'menu': {
      const choice = parseChoice(text, [{ key: '1' }, { key: '2' }, { key: '3' }])
      if (choice === '1') {
        const opts = state.services.map((s, i) => ({ key: String(i + 1), value: s.id }))
        replies.push(
          'Perfeito! Qual serviço você deseja? 💈\n\n' +
            state.services.map((s, i) => `${i + 1}️⃣ ${serviceLine(s)}`).join('\n')
        )
        return { replies, patch: { botState: 'servico', botCtx: { options: opts } } }
      }
      if (choice === '2') {
        replies.push(
          '📋 *Nossos serviços:*\n\n' +
            state.services.map((s) => serviceLine(s)).join('\n') +
            '\n\nQuer agendar? Digite *1* para começar ou *menu* para voltar.'
        )
        return { replies, patch: { botState: 'menu', botCtx: {} } }
      }
      if (choice === '3') {
        replies.push(
          'Sem problema! 😊 Já estou chamando um atendente para falar com você. Aguarde só um instante por aqui.'
        )
        return { replies, patch: { botState: 'humano', assignedTo: 'negocio', botCtx: {} } }
      }
      replies.push('Não entendi 🤔. Digite *1*, *2* ou *3*.')
      return { replies, patch: {} }
    }

    case 'servico': {
      const opts = ctx.options ?? []
      const choice = parseChoice(text, opts)
      if (!choice) {
        replies.push('Hmm, não encontrei essa opção. Digite o *número* do serviço. 🙂')
        return { replies, patch: {} }
      }
      const serviceId = opts.find((o) => o.key === choice)!.value
      const proOpts = [
        { key: '1', value: 'any' },
        ...state.professionals.map((p, i) => ({ key: String(i + 2), value: p.id })),
      ]
      replies.push(
        'Ótima escolha! Com qual profissional? 💇\n\n1️⃣ Qualquer um (mais rápido)\n' +
          state.professionals.map((p, i) => `${i + 2}️⃣ ${p.name}`).join('\n')
      )
      return {
        replies,
        patch: { botState: 'profissional', botCtx: { serviceId, options: proOpts } },
      }
    }

    case 'profissional': {
      const opts = ctx.options ?? []
      const choice = parseChoice(text, opts)
      if (!choice) {
        replies.push('Não peguei 🤔. Digite o *número* do profissional.')
        return { replies, patch: {} }
      }
      const professionalId = opts.find((o) => o.key === choice)!.value
      const days = openDays()
      const dayOpts = days.map((d, i) => ({ key: String(i + 1), value: d }))
      replies.push(
        'Para quando? 📅 Escolha o dia:\n\n' +
          days.map((d, i) => `${i + 1}️⃣ ${relativeDayLabel(d)}`).join('\n')
      )
      return {
        replies,
        patch: {
          botState: 'dia',
          botCtx: { ...ctx, professionalId, options: dayOpts },
        },
      }
    }

    case 'dia': {
      const opts = ctx.options ?? []
      const choice = parseChoice(text, opts)
      if (!choice) {
        replies.push('Não entendi a data 🤔. Digite o *número* do dia.')
        return { replies, patch: {} }
      }
      const date = opts.find((o) => o.key === choice)!.value
      const dur = serviceDuration(state, ctx.serviceId!)
      const slots = availableSlots(state, ctx.professionalId!, date, dur)
      if (slots.length === 0) {
        replies.push(
          `Poxa, não há horários livres em *${relativeDayLabel(date)}* 😕. Escolha outro dia, por favor.`
        )
        return { replies, patch: {} }
      }
      // Mostra até 8 horários
      const shown = slots.slice(0, 8)
      const slotOpts = shown.map((m, i) => ({ key: String(i + 1), value: String(m) }))
      replies.push(
        `Horários livres em *${relativeDayLabel(date)}*: 🕐\n\n` +
          shown.map((m, i) => `${i + 1}️⃣ ${minToTime(m)}`).join('\n')
      )
      return {
        replies,
        patch: { botState: 'horario', botCtx: { ...ctx, date, options: slotOpts } },
      }
    }

    case 'horario': {
      const opts = ctx.options ?? []
      const choice = parseChoice(text, opts)
      if (!choice) {
        replies.push('Não peguei o horário 🤔. Digite o *número* da opção.')
        return { replies, patch: {} }
      }
      const startMin = Number(opts.find((o) => o.key === choice)!.value)
      const service = state.services.find((s) => s.id === ctx.serviceId)!
      const proName =
        ctx.professionalId === 'any'
          ? 'qualquer profissional'
          : state.professionals.find((p) => p.id === ctx.professionalId)?.name
      replies.push(
        `Confirmando o agendamento: ✨\n\n💈 *${service.name}*\n👤 ${proName}\n📅 ${relativeDayLabel(
          ctx.date!
        )}\n🕐 ${minToTime(startMin)}\n💵 ${brl(service.priceBRL)}\n\nDigite *SIM* para confirmar ou *NÃO* para recomeçar.`
      )
      return { replies, patch: { botState: 'confirmar', botCtx: { ...ctx, startMin } } }
    }

    case 'confirmar': {
      if (['sim', 's', 'confirmar', 'ok', 'isso'].includes(t)) {
        const dur = serviceDuration(state, ctx.serviceId!)
        let proId = ctx.professionalId!
        if (proId === 'any') {
          proId = firstFreePro(state, ctx.date!, ctx.startMin!, dur) ?? state.professionals[0].id
        }
        const service = state.services.find((s) => s.id === ctx.serviceId)!
        const proName = state.professionals.find((p) => p.id === proId)?.name
        const appt: Appointment = {
          id: uid(),
          serviceId: ctx.serviceId!,
          professionalId: proId,
          customerName: conv.customerName,
          customerPhone: conv.customerPhone,
          date: ctx.date!,
          startMin: ctx.startMin!,
          status: 'confirmado',
          source: 'robo',
          createdAt: Date.now(),
        }
        replies.push(
          `Prontinho! ✅ Seu horário está agendado:\n\n💈 *${service.name}* com *${proName}*\n📅 ${relativeDayLabel(
            ctx.date!
          )} às *${minToTime(ctx.startMin!)}*\n\nQualquer coisa é só chamar. Até logo! 👋`
        )
        return {
          replies,
          patch: { botState: 'concluido', botCtx: {} },
          newAppointment: appt,
        }
      }
      if (['nao', 'não', 'n'].includes(t)) {
        replies.push('Sem problema! Vamos recomeçar. ' + greeting())
        return { replies, patch: { botState: 'menu', botCtx: {} } }
      }
      replies.push('Só pra confirmar: digite *SIM* ou *NÃO*. 🙂')
      return { replies, patch: {} }
    }

    case 'concluido': {
      replies.push(
        'Quer agendar de novo ou tirar uma dúvida? Digite *menu* que eu te ajudo. 😉'
      )
      return { replies, patch: {} }
    }

    case 'humano':
    default:
      // Conversa em mãos humanas: o robô não responde mais.
      return { replies: [], patch: {} }
  }
}
