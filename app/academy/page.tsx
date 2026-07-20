import type { Metadata } from 'next'
import { AcademyContent } from '@/components/AcademyContent'

export const metadata: Metadata = {
  title: 'OpsFlow Academy — Processus & équipes performantes | Suisse romande',
  description:
    'OpsFlow Academy améliore un processus précis de votre entreprise — intégration, vente, coordination — et forme votre équipe à le faire tourner. Sur mesure, pour PME. Diagnostic gratuit de 45 minutes.',
  alternates: { canonical: '/academy' },
  openGraph: {
    title: 'OpsFlow Academy',
    description:
      'Nous simplifions un processus précis et formons votre équipe à le faire tourner. PME, Suisse romande.',
    url: 'https://opsflow-advisory.ch/academy',
    siteName: 'OpsFlow',
    type: 'website',
  },
}

export default function AcademyPage() {
  return <AcademyContent />
}
