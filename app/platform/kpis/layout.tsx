import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planning KPIs Diagnostic — OpsFlow Advisory',
  description: 'Data-driven planning KPI diagnostic: OTIF, OTD, forecast accuracy, plan adherence, inventory turns, and supply chain cost analysis with prioritised recommendations.',
}

export default function KPIsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
