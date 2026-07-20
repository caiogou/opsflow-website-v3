import { MetadataRoute } from 'next'

const BASE = 'https://www.opsflow-advisory.ch'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/academy`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/diagnostic`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/platform`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/platform/demand`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/platform/inventory`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/platform/kpis`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/platform/supply-risk`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
