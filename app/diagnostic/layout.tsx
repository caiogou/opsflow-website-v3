import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'S&OP Health Check — OpsFlow Advisory',
  description:
    'Free S&OP maturity assessment. 32 questions across 8 dimensions — get a personalised maturity profile with actionable recommendations for your supply chain. Takes 12 minutes.',
  openGraph: {
    title: 'S&OP Health Check — OpsFlow Advisory',
    description:
      'How mature is your S&OP process? Take our free 12-minute assessment and get a personalised maturity report.',
    url: 'https://opsflow-advisory.ch/diagnostic',
    siteName: 'OpsFlow Advisory',
    type: 'website',
  },
}

export default function DiagnosticLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
