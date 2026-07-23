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
  title: 'OpsFlow Advisory — Supply-Chain-Beratung & S&OP · Schweiz',
  description:
    'Supply-Chain-Beratung für KMU in der Schweiz und EMEA: S&OP, Bestandsoptimierung, Risikomanagement und Distributionsplanung. MIT-zertifiziert. Kostenlose Session.',
  alternates: {
    canonical: 'https://www.opsflow-advisory.ch/de',
    languages: { fr: 'https://www.opsflow-advisory.ch/', de: 'https://www.opsflow-advisory.ch/de', en: 'https://www.opsflow-advisory.ch/en', 'x-default': 'https://www.opsflow-advisory.ch/' },
  },
  openGraph: { title: 'OpsFlow Advisory', description: 'Supply-Chain-Beratung, verstärkt durch KI — Schweiz & EMEA.', url: 'https://www.opsflow-advisory.ch/de', type: 'website' },
}

export default function Page() {
  return (
    <main>
      <Navbar lang="de" />
      <Hero lang="de" />
      <Stats lang="de" />
      <Services lang="de" />
      <HowItWorks lang="de" />
      <AcademyBridge lang="de" />
      <Credentials lang="de" />
      <Testimonials lang="de" />
      <CTA lang="de" />
      <Footer lang="de" />
    </main>
  )
}
