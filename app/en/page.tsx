import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Stats } from '@/components/Stats'
import { Services } from '@/components/Services'
import { HowItWorks } from '@/components/HowItWorks'
import { AcademyBridge } from '@/components/AcademyBridge'
import { Credentials } from '@/components/Credentials'
import { Approach } from '@/components/Approach'
import { Team } from '@/components/Team'
import { CTA, Footer } from '@/components/CTAFooter'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Supply Chain Strategy with Senior Follow-Through',
  description:
    'We build your supply chain strategy — S&OP, inventory, risk and distribution — and a senior professional follows the plan with your team until results land. MIT-certified. Free diagnostics.',
  alternates: {
    canonical: 'https://www.opsflow-advisory.ch/en',
    languages: { fr: 'https://www.opsflow-advisory.ch/', de: 'https://www.opsflow-advisory.ch/de', en: 'https://www.opsflow-advisory.ch/en', 'x-default': 'https://www.opsflow-advisory.ch/en' },
  },
  openGraph: { title: 'OpsFlow Advisory', description: 'Supply chain strategy with senior follow-through.', url: 'https://www.opsflow-advisory.ch/en', type: 'website' },
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
      <AcademyBridge lang="en" />
      <Credentials lang="en" />
      <Team lang="en" />
      <CTA lang="en" />
      <Footer lang="en" />
    </main>
  )
}
