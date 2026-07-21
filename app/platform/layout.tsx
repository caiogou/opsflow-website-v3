import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plateforme de diagnostic — OpsFlow Advisory',
  description: 'Diagnostics supply chain pilotés par les données : stocks, demande & prévision, risques d’approvisionnement et KPIs de planification. Importez vos données, obtenez des recommandations concrètes.',
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
