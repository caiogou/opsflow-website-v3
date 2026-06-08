import { AtendeState, Conversation } from './types'
import { todayIso, addDaysIso } from './format'

// Dados iniciais de demonstração. Recriados sempre que não há nada salvo.
export function createSeed(): AtendeState {
  const today = todayIso()
  const now = Date.now()

  const professionals = [
    { id: 'p1', name: 'Carlos', color: '#1a9e8f' },
    { id: 'p2', name: 'Bruno', color: '#3b82f6' },
    { id: 'p3', name: 'Rafa', color: '#f59e0b' },
  ]

  const services = [
    { id: 's1', name: 'Corte de cabelo', durationMin: 30, priceBRL: 40, emoji: '✂️' },
    { id: 's2', name: 'Barba', durationMin: 30, priceBRL: 30, emoji: '🧔' },
    { id: 's3', name: 'Corte + Barba', durationMin: 60, priceBRL: 60, emoji: '💈' },
    { id: 's4', name: 'Cabelo infantil', durationMin: 30, priceBRL: 35, emoji: '🧒' },
    { id: 's5', name: 'Pézinho / acabamento', durationMin: 15, priceBRL: 20, emoji: '🪒' },
  ]

  const appointments = [
    {
      id: 'a1',
      serviceId: 's3',
      professionalId: 'p1',
      customerName: 'João Mendes',
      customerPhone: '+55 17 99876-1122',
      date: today,
      startMin: 9 * 60,
      status: 'concluido' as const,
      source: 'robo' as const,
      createdAt: now - 86400000,
    },
    {
      id: 'a2',
      serviceId: 's1',
      professionalId: 'p2',
      customerName: 'Pedro Alves',
      customerPhone: '+55 17 99811-3344',
      date: today,
      startMin: 10 * 60 + 30,
      status: 'confirmado' as const,
      source: 'manual' as const,
      createdAt: now - 7200000,
    },
    {
      id: 'a3',
      serviceId: 's2',
      professionalId: 'p1',
      customerName: 'Marcos Lima',
      customerPhone: '+55 17 99744-5566',
      date: today,
      startMin: 14 * 60,
      status: 'confirmado' as const,
      source: 'robo' as const,
      createdAt: now - 3600000,
    },
    {
      id: 'a4',
      serviceId: 's3',
      professionalId: 'p3',
      customerName: 'André Souza',
      customerPhone: '+55 17 99700-7788',
      date: addDaysIso(today, 1),
      startMin: 16 * 60,
      status: 'confirmado' as const,
      source: 'robo' as const,
      createdAt: now - 1800000,
    },
  ]

  const conversations: Conversation[] = [
    {
      id: 'c1',
      customerName: 'Marcos Lima',
      customerPhone: '+55 17 99744-5566',
      assignedTo: 'robo',
      botState: 'concluido',
      botCtx: {},
      unread: 0,
      lastActivity: now - 3600000,
      messages: [
        { id: 'm1', from: 'cliente', text: 'oi, queria marcar a barba', at: now - 3700000 },
        {
          id: 'm2',
          from: 'robo',
          text: 'Olá! 👋 Seja bem-vindo à *Barbearia Estilo*. Agendei sua *Barba* com o *Carlos* hoje às *14:00*. Até já! ✅',
          at: now - 3650000,
        },
      ],
    },
    {
      id: 'c2',
      customerName: 'Fernanda Rocha',
      customerPhone: '+55 17 99655-9900',
      assignedTo: 'negocio',
      botState: 'humano',
      botCtx: {},
      unread: 2,
      lastActivity: now - 600000,
      messages: [
        { id: 'm3', from: 'cliente', text: 'vocês fazem luzes?', at: now - 900000 },
        {
          id: 'm4',
          from: 'robo',
          text: 'Boa pergunta! Vou chamar um atendente pra te ajudar com isso. 😊 Um instante.',
          at: now - 880000,
        },
        { id: 'm5', from: 'cliente', text: 'tá bom, obrigada', at: now - 600000 },
      ],
    },
  ]

  return { professionals, services, appointments, conversations }
}
