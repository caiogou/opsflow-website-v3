import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Supply Risk & Resilience Diagnostic — OpsFlow Advisory',
  description: 'Data-driven supply chain risk diagnostic: supplier concentration analysis, single-source exposure mapping, geographic diversification strategy, disruption history, and prioritised resilience recommendations.',
}

export default function SupplyRiskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
