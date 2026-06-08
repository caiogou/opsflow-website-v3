// Helpers de formatação de data, hora e dinheiro (pt-BR).

export function brl(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function minToTime(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function todayIso(): string {
  return toIso(new Date())
}

export function toIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDaysIso(iso: string, days: number): string {
  const d = fromIso(iso)
  d.setDate(d.getDate() + days)
  return toIso(d)
}

export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const WEEKDAYS_LONG = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
]

export function weekday(iso: string): number {
  return fromIso(iso).getDay()
}

export function dayLabelShort(iso: string): string {
  const d = fromIso(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${dd}/${mm}`
}

export function dayLabelLong(iso: string): string {
  const d = fromIso(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${WEEKDAYS_LONG[d.getDay()]}, ${dd}/${mm}`
}

export function relativeDayLabel(iso: string): string {
  const t = todayIso()
  if (iso === t) return 'Hoje'
  if (iso === addDaysIso(t, 1)) return 'Amanhã'
  return dayLabelShort(iso)
}

export function clockTime(at: number): string {
  return new Date(at).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
