import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free S&OP Self-Assessment | OpsFlow Advisory',
  description:
    'Free S&OP Self-Assessment: 32 questions across 8 dimensions, about 12 minutes. Get a personalized maturity profile with practical recommendations.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/diagnostic' },
  openGraph: {
    title: 'Free S&OP Self-Assessment | OpsFlow Advisory',
    description:
      'How mature is your S&OP process? Take the free S&OP Self-Assessment (about 12 minutes) and get a personalized maturity report.',
    url: 'https://www.opsflow-advisory.ch/diagnostic',
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
