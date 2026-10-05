import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Stats } from '@/components/Stats'
import { Services } from '@/components/Services'
import { HowItWorks } from '@/components/HowItWorks'
import { Credentials } from '@/components/Credentials'
import { Approach } from '@/components/Approach'
import { Team } from '@/components/Team'
import { CTA, Footer } from '@/components/CTAFooter'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Supply Chain Strategy with Embedded Senior Leadership',
  description:
    'We build your supply chain strategy — S&OP/IBP, supply planning, order management and logistics — and a senior leader stays with your team to make it happen. AI-assisted analysis, senior judgement. Free diagnostic session.',
  alternates: {
    canonical: 'https://www.opsflow-advisory.ch/en',
    languages: { fr: 'https://www.opsflow-advisory.ch/', de: 'https://www.opsflow-advisory.ch/de', en: 'https://www.opsflow-advisory.ch/en', 'x-default': 'https://www.opsflow-advisory.ch/en' },
  },
  openGraph: { title: 'OpsFlow Advisory', description: 'Supply chain strategy with embedded senior leadership. S&OP/IBP, supply planning, order management and logistics.', url: 'https://www.opsflow-advisory.ch/en', type: 'website' },
}

export default function Page() {
  return (
    <main>
      <Navbar lang="en" />
      <Hero lang="en" />
      <Stats lang="en" />
      <Approach lang="en" />
      <Services lang="en" />
      <HowItWorks lang="en" />
      <Credentials lang="en" />
      <Team lang="en" />
      <CTA lang="en" />
      <Footer lang="en" />
    </main>
  )
}
