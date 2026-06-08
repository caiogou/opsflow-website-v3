import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpsFlow Atende — Atendimento e agendamento no WhatsApp',
  description:
    'Plataforma de atendimento automático e agendamento via WhatsApp para pequenos negócios: barbearias, salões, padarias e açougues.',
}

export default function AtendeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
