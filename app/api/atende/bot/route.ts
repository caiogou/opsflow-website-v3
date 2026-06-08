import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { AtendeState, Appointment, BUSINESS } from '@/app/atende/lib/types'
import { availableSlots } from '@/app/atende/lib/bot'
import { brl, minToTime, dayLabelLong } from '@/app/atende/lib/format'

// Modelo padrão: Claude Opus 4.8 (configurável via ATENDE_MODEL — ex.: claude-haiku-4-5 para respostas mais baratas/rápidas).
const MODEL = process.env.ATENDE_MODEL || 'claude-opus-4-8'

type Snapshot = Pick<AtendeState, 'services' | 'professionals' | 'appointments'>

interface BotRequest extends Snapshot {
  messages: { from: 'cliente' | 'robo' | 'negocio'; text: string }[]
  customer: { name: string; phone: string }
}

const uid = () => Math.random().toString(36).slice(2, 10)

function timeToMin(t: string): number | null {
  const m = t.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

// Ferramentas que o robô pode usar — garantem que ele só ofereça/agende horários reais.
const TOOLS: Anthropic.Tool[] = [
  {
    name: 'verificar_horarios',
    description:
      'Consulta os horários LIVRES de verdade em uma data. Use SEMPRE antes de propor ou confirmar um horário — nunca invente disponibilidade.',
    input_schema: {
      type: 'object',
      properties: {
        data: { type: 'string', description: 'Data no formato AAAA-MM-DD' },
        servicoId: { type: 'string', description: 'ID do serviço escolhido' },
        profissionalId: {
          type: 'string',
          description: 'ID do profissional, ou "any" para qualquer um',
        },
      },
      required: ['data', 'servicoId', 'profissionalId'],
    },
  },
  {
    name: 'agendar',
    description:
      'Cria o agendamento. Só chame DEPOIS de o cliente confirmar serviço, profissional, dia e horário. Valida o horário antes de reservar.',
    input_schema: {
      type: 'object',
      properties: {
        servicoId: { type: 'string' },
        profissionalId: { type: 'string', description: 'ID do profissional ou "any"' },
        data: { type: 'string', description: 'AAAA-MM-DD' },
        horario: { type: 'string', description: 'HH:MM' },
      },
      required: ['servicoId', 'profissionalId', 'data', 'horario'],
    },
  },
  {
    name: 'chamar_atendente',
    description:
      'Transfere a conversa para um atendente humano. Use quando o cliente pedir para falar com uma pessoa ou tiver uma questão que você não resolve (reclamação, serviço fora da lista, etc.).',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
]

function systemPrompt(snap: Snapshot): string {
  const now = new Date()
  const hoje = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const servicos = snap.services
    .map((s) => `- ${s.name} (id: ${s.id}) — ${brl(s.priceBRL)}, ${s.durationMin} min`)
    .join('\n')
  const profs = snap.professionals
    .map((p) => `- ${p.name} (id: ${p.id})`)
    .join('\n')

  return `Você é o atendente virtual da *${BUSINESS.name}*, uma barbearia no interior de São Paulo. Atende clientes pelo WhatsApp.

Sua missão: atender bem e agendar horários de forma rápida e simpática.

REGRAS DE ESTILO:
- Responda em português do Brasil, com tom amigável e informal, como uma conversa de WhatsApp.
- Seja BREVE: mensagens curtas, no máximo 2 ou 3 frases. Pode usar emojis com moderação.
- Use *asteriscos* para negrito (estilo WhatsApp), não use markdown como ## ou listas longas.
- Pergunte uma coisa de cada vez. Não despeje várias perguntas juntas.

REGRAS DE AGENDAMENTO:
- Funcionamos de segunda a sábado, das ${minToTime(BUSINESS.openMin)} às ${minToTime(BUSINESS.closeMin)}. Domingo é fechado.
- Hoje é ${dayLabelLong(hoje)} (${hoje}).
- NUNCA invente horários disponíveis. Use a ferramenta verificar_horarios antes de propor ou confirmar qualquer horário.
- Antes de agendar, confirme com o cliente: serviço, profissional, dia e horário. Só então use a ferramenta agendar.
- Se o cliente não tem preferência de profissional, use "any".
- Não ofereça serviços ou preços que não estejam na lista abaixo.

SERVIÇOS DISPONÍVEIS:
${servicos}

PROFISSIONAIS:
${profs}

Se o cliente pedir algo fora do agendamento (reclamação, dúvida que você não sabe, serviço que não existe), use a ferramenta chamar_atendente.`
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ aiUnavailable: true })
  }

  let body: BotRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ aiUnavailable: true })
  }

  const { services, professionals, customer } = body
  // Cópia de trabalho dos agendamentos — reservas feitas neste turno ficam visíveis para as próximas verificações.
  const appointments: Appointment[] = [...body.appointments]
  const snap: AtendeState = { services, professionals, appointments, conversations: [] }

  const created: Appointment[] = []
  let handoff = false

  const serviceById = (id: string) => services.find((s) => s.id === id)

  function runTool(name: string, input: Record<string, unknown>): string {
    if (name === 'chamar_atendente') {
      handoff = true
      return 'OK: conversa transferida para um atendente humano. Avise o cliente que alguém vai responder em instantes.'
    }

    if (name === 'verificar_horarios') {
      const { data, servicoId, profissionalId } = input as Record<string, string>
      const svc = serviceById(servicoId)
      if (!svc) return 'ERRO: serviço não encontrado. Confirme o serviço com o cliente.'
      const slots = availableSlots(snap, profissionalId || 'any', data, svc.durationMin)
      if (slots.length === 0)
        return `Nenhum horário livre em ${data} para esse serviço. Sugira outro dia.`
      return `Horários livres em ${data}: ${slots.map(minToTime).join(', ')}`
    }

    if (name === 'agendar') {
      const { servicoId, profissionalId, data, horario } = input as Record<string, string>
      const svc = serviceById(servicoId)
      if (!svc) return 'ERRO: serviço inválido.'
      const startMin = timeToMin(horario)
      if (startMin === null) return 'ERRO: horário inválido. Use o formato HH:MM.'

      // Resolve "qualquer profissional" para um que esteja realmente livre.
      let proId = profissionalId
      if (proId === 'any') {
        proId =
          professionals.find((p) =>
            availableSlots(snap, p.id, data, svc.durationMin).includes(startMin)
          )?.id || ''
      }
      if (!proId) return 'ERRO: profissional não encontrado.'

      const free = availableSlots(snap, proId, data, svc.durationMin).includes(startMin)
      if (!free)
        return 'ERRO: esse horário não está mais livre. Use verificar_horarios e ofereça outro.'

      const appt: Appointment = {
        id: uid(),
        serviceId: svc.id,
        professionalId: proId,
        customerName: customer.name,
        customerPhone: customer.phone,
        date: data,
        startMin,
        status: 'confirmado',
        source: 'robo',
        createdAt: Date.now(),
      }
      appointments.push(appt)
      created.push(appt)
      const proName = professionals.find((p) => p.id === proId)?.name
      return `OK: agendado ${svc.name} com ${proName} em ${data} às ${horario}. Confirme para o cliente de forma simpática.`
    }

    return 'ERRO: ferramenta desconhecida.'
  }

  try {
    const client = new Anthropic()

    const messages: Anthropic.MessageParam[] = body.messages.map((m) => ({
      role: m.from === 'cliente' ? 'user' : 'assistant',
      content: m.text,
    }))
    if (messages.length === 0 || messages[0].role !== 'user') {
      messages.unshift({ role: 'user', content: 'Oi' })
    }

    let reply = ''
    // Loop de tool use: o robô pode consultar horários e agendar antes de responder.
    for (let i = 0; i < 6; i++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'low' },
        system: systemPrompt(snap),
        tools: TOOLS,
        messages,
      })

      reply = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
        .trim()

      if (response.stop_reason !== 'tool_use') break

      const toolUses = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
      )
      messages.push({ role: 'assistant', content: response.content })
      messages.push({
        role: 'user',
        content: toolUses.map((t) => ({
          type: 'tool_result' as const,
          tool_use_id: t.id,
          content: runTool(t.name, t.input as Record<string, unknown>),
        })),
      })
    }

    if (!reply) reply = 'Desculpe, pode repetir? 🙂'

    return NextResponse.json({
      reply,
      appointment: created[0] ?? null,
      handoff,
    })
  } catch (err) {
    console.error('[atende/bot] erro na IA, usando fallback:', err)
    return NextResponse.json({ aiUnavailable: true })
  }
}
