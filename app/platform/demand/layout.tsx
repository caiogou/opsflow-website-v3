import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demand & Forecast Diagnostic | OpsFlow Advisory',
  description: 'Diagnose forecast accuracy, demand pattern complexity, and planning challenges. Identify CHF 1.52M+ in recoverable value from improved demand forecasting and planning.',
  keywords: ['demand forecasting', 'forecast accuracy', 'demand planning', 'supply chain optimization', 'MAPE', 'forecast bias'],
}

export default function DemandLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
