'use client'

import { useEffect } from 'react'
import { useSyncExternalStore } from 'react'
import { AtendeState, Conversation, Message, Appointment } from './types'
import { createSeed } from './seed'
import { runBot } from './bot'

const STORAGE_KEY = 'atende_state_v1'
const uid = () => Math.random().toString(36).slice(2, 10)

let state: AtendeState = createSeed()
let loaded = false
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) state = JSON.parse(raw)
  } catch {
    /* ignore */
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): AtendeState {
  return state
}

function ensureLoaded() {
  if (loaded) return
  loaded = true
  load()
  // Sincroniza entre abas/janelas.
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      load()
      emit()
    }
  })
  emit()
}

// --- Hook React ---------------------------------------------------------

export function useAtende(): AtendeState {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  useEffect(() => {
    ensureLoaded()
  }, [])
  return snap
}

// --- Mutações ----------------------------------------------------------

function commit(next: AtendeState) {
  state = next
  persist()
  emit()
}

export function resetData() {
  loaded = true
  state = createSeed()
  persist()
  emit()
}

function upsertConversation(conv: Conversation) {
  const exists = state.conversations.some((c) => c.id === conv.id)
  const conversations = exists
    ? state.conversations.map((c) => (c.id === conv.id ? conv : c))
    : [conv, ...state.conversations]
  return conversations
}

// Cria (ou recupera) a conversa do simulador para um cliente.
export function startConversation(name: string, phone: string): string {
  const id = 'sim-' + uid()
  const conv: Conversation = {
    id,
    customerName: name || 'Cliente (teste)',
    customerPhone: phone || '+55 17 90000-0000',
    messages: [],
    botState: 'novo',
    botCtx: {},
    assignedTo: 'robo',
    unread: 0,
    lastActivity: Date.now(),
  }
  commit({ ...state, conversations: [conv, ...state.conversations] })
  return id
}

// Cliente envia mensagem -> robô processa (se a conversa estiver com o robô).
export function sendCustomerMessage(convId: string, text: string) {
  const conv = state.conversations.find((c) => c.id === convId)
  if (!conv) return
  const now = Date.now()
  const customerMsg: Message = { id: uid(), from: 'cliente', text, at: now }

  let updated: Conversation = {
    ...conv,
    messages: [...conv.messages, customerMsg],
    lastActivity: now,
  }

  let newAppointment: Appointment | undefined

  if (conv.assignedTo === 'robo') {
    const result = runBot(state, updated, text)
    const botMsgs: Message[] = result.replies.map((text, i) => ({
      id: uid(),
      from: 'robo',
      text,
      at: now + i + 1,
    }))
    updated = {
      ...updated,
      ...result.patch,
      botCtx: result.patch.botCtx ?? updated.botCtx,
      messages: [...updated.messages, ...botMsgs],
    }
    newAppointment = result.newAppointment
  } else {
    // Conversa com o dono: marca como não lida.
    updated = { ...updated, unread: conv.unread + 1 }
  }

  commit({
    ...state,
    conversations: upsertConversation(updated),
    appointments: newAppointment
      ? [...state.appointments, newAppointment]
      : state.appointments,
  })
}

// Dono assume a conversa (sai do robô).
export function takeOver(convId: string) {
  const conv = state.conversations.find((c) => c.id === convId)
  if (!conv) return
  commit({
    ...state,
    conversations: upsertConversation({
      ...conv,
      assignedTo: 'negocio',
      botState: 'humano',
    }),
  })
}

// Dono devolve a conversa ao robô.
export function giveBackToBot(convId: string) {
  const conv = state.conversations.find((c) => c.id === convId)
  if (!conv) return
  commit({
    ...state,
    conversations: upsertConversation({
      ...conv,
      assignedTo: 'robo',
      botState: 'menu',
    }),
  })
}

// Dono envia mensagem manual.
export function sendBusinessMessage(convId: string, text: string) {
  const conv = state.conversations.find((c) => c.id === convId)
  if (!conv) return
  const now = Date.now()
  const msg: Message = { id: uid(), from: 'negocio', text, at: now }
  commit({
    ...state,
    conversations: upsertConversation({
      ...conv,
      messages: [...conv.messages, msg],
      assignedTo: 'negocio',
      botState: 'humano',
      lastActivity: now,
    }),
  })
}

export function markRead(convId: string) {
  const conv = state.conversations.find((c) => c.id === convId)
  if (!conv || conv.unread === 0) return
  commit({
    ...state,
    conversations: upsertConversation({ ...conv, unread: 0 }),
  })
}

// --- Agenda / serviços --------------------------------------------------

export function setAppointmentStatus(id: string, status: Appointment['status']) {
  commit({
    ...state,
    appointments: state.appointments.map((a) =>
      a.id === id ? { ...a, status } : a
    ),
  })
}

export function addManualAppointment(appt: Omit<Appointment, 'id' | 'createdAt'>) {
  commit({
    ...state,
    appointments: [
      ...state.appointments,
      { ...appt, id: uid(), createdAt: Date.now() },
    ],
  })
}

export function addService(s: Omit<AtendeState['services'][number], 'id'>) {
  commit({
    ...state,
    services: [...state.services, { ...s, id: uid() }],
  })
}

export function removeService(id: string) {
  commit({ ...state, services: state.services.filter((s) => s.id !== id) })
}

export function addProfessional(name: string, color: string) {
  commit({
    ...state,
    professionals: [...state.professionals, { id: uid(), name, color }],
  })
}

export function removeProfessional(id: string) {
  commit({
    ...state,
    professionals: state.professionals.filter((p) => p.id !== id),
  })
}
