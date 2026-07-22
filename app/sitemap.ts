import { MetadataRoute } from 'next'
import { ressources } from '@/lib/ressources'
import { services } from '@/lib/services'
import { ressourcesDe } from '@/lib/ressources_de'
import { servicesDe } from '@/lib/services_de'
import { ressourcesEn } from '@/lib/ressources_en'
import { servicesEn } from '@/lib/services_en'

const BASE = 'https://www.opsflow-advisory.ch'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const core: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/academy`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/diagnostic`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/platform`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/platform/demand`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/platform/inventory`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/platform/kpis`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/platform/supply-risk`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/ressources`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/de`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/de/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/de/ressources`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/en`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/en/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/en/ressources`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
  const fr: MetadataRoute.Sitemap = [
    ...services.map((r) => ({ url: `${BASE}/services/${r.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...ressources.map((r) => ({ url: `${BASE}/ressources/${r.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
  const de: MetadataRoute.Sitemap = [
    ...servicesDe.map((r) => ({ url: `${BASE}/de/services/${r.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...ressourcesDe.map((r) => ({ url: `${BASE}/de/ressources/${r.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
  const en: MetadataRoute.Sitemap = [
    ...servicesEn.map((r) => ({ url: `${BASE}/en/services/${r.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...ressourcesEn.map((r) => ({ url: `${BASE}/en/ressources/${r.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
  return [...core, ...fr, ...de, ...en]
}
