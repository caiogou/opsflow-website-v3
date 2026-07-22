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
  alternates: {
    canonical: 'https://www.opsflow-advisory.ch/',
    languages: { fr: 'https://www.opsflow-advisory.ch/', de: 'https://www.opsflow-advisory.ch/de', 'x-default': 'https://www.opsflow-advisory.ch/' },
  },
}

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <AcademyBridge />
      <Credentials />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
