import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diagnostic Platform — OpsFlow Advisory',
  description: 'Data-driven supply chain diagnostics: Inventory, Demand & Forecast, Supply Risk, and Planning KPIs. Upload your data, get actionable insights.',
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
