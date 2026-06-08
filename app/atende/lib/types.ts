// Tipos centrais da plataforma de atendimento / agendamento.

export interface Professional {
  id: string
  name: string
  color: string // cor usada na agenda
}

export interface Service {
  id: string
  name: string
  durationMin: number
  priceBRL: number
  emoji?: string
}

export type AppointmentStatus = 'confirmado' | 'concluido' | 'cancelado'

export interface Appointment {
  id: string
  serviceId: string
  professionalId: string
  customerName: string
  customerPhone: string
  date: string // ISO yyyy-mm-dd
  startMin: number // minutos a partir de 00:00
  status: AppointmentStatus
  source: 'robo' | 'manual'
  createdAt: number
}

export type MessageFrom = 'cliente' | 'robo' | 'negocio'

export interface Message {
  id: string
  from: MessageFrom
  text: string
  at: number
}

// Estados da conversa conduzida pelo robô.
export type BotState =
  | 'novo'
  | 'menu'
  | 'servico'
  | 'profissional'
  | 'dia'
  | 'horario'
  | 'confirmar'
  | 'concluido'
  | 'humano'

export interface BotContext {
  serviceId?: string
  professionalId?: string // 'any' = qualquer profissional
  date?: string
  startMin?: number
  // opções numeradas mostradas na última mensagem (para mapear a resposta)
  options?: Array<{ key: string; value: string }>
}

export interface Conversation {
  id: string
  customerName: string
  customerPhone: string
  messages: Message[]
  botState: BotState
  botCtx: BotContext
  assignedTo: 'robo' | 'negocio'
  unread: number
  lastActivity: number
  pending?: boolean // robô "digitando" (aguardando resposta da IA)
}

export interface AtendeState {
  professionals: Professional[]
  services: Service[]
  appointments: Appointment[]
  conversations: Conversation[]
}

// Configuração do negócio (poderá virar editável no futuro).
export const BUSINESS = {
  name: 'Barbearia Estilo',
  city: 'Interior de São Paulo',
  openMin: 9 * 60, // 09:00
  closeMin: 19 * 60, // 19:00
  slotStepMin: 30,
  closedWeekdays: [0], // domingo fechado (0 = domingo)
}
