import { MetadataRoute } from 'next'
import { ressources } from '@/lib/ressources'
import { services } from '@/lib/services'

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
  ]
  const svc: MetadataRoute.Sitemap = services.map((r) => ({
    url: `${BASE}/services/${r.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8,
  }))
  const res: MetadataRoute.Sitemap = ressources.map((r) => ({
    url: `${BASE}/ressources/${r.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7,
  }))
  return [...core, ...svc, ...res]
}
