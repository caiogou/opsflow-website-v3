import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Stats } from '@/components/Stats'
import { Services } from '@/components/Services'
import { HowItWorks } from '@/components/HowItWorks'
import { Credentials } from '@/components/Credentials'
import { Testimonials } from '@/components/Testimonials'
import { CTA, Footer } from '@/components/CTAFooter'

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Credentials />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
