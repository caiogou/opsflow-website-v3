import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Stats } from '@/components/Stats'
import { Services } from '@/components/Services'
import { HowItWorks } from '@/components/HowItWorks'
import { AcademyBridge } from '@/components/AcademyBridge'
import { Credentials } from '@/components/Credentials'
import { Testimonials } from '@/components/Testimonials'
import { CTA, Footer } from '@/components/CTAFooter'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Supply Chain Consulting & S&OP · Switzerland',
  description:
    'Supply chain consulting for SMEs in Switzerland and EMEA: S&OP, inventory optimization, supply risk and distribution planning. MIT-certified. Free diagnostic session.',
  alternates: {
    canonical: 'https://www.opsflow-advisory.ch/en',
    languages: { fr: 'https://www.opsflow-advisory.ch/', de: 'https://www.opsflow-advisory.ch/de', en: 'https://www.opsflow-advisory.ch/en', 'x-default': 'https://www.opsflow-advisory.ch/' },
  },
  openGraph: { title: 'OpsFlow Advisory', description: 'AI-powered supply chain advisory — Switzerland & EMEA.', url: 'https://www.opsflow-advisory.ch/en', type: 'website' },
}

export default function Page() {
  return (
    <main>
      <Navbar lang="en" />
      <Hero lang="en" />
      <Stats lang="en" />
      <Services lang="en" />
      <HowItWorks lang="en" />
      <AcademyBridge lang="en" />
      <Credentials lang="en" />
      <Testimonials lang="en" />
      <CTA lang="en" />
      <Footer lang="en" />
    </main>
  )
}
