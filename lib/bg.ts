// Header background per page (images generated in Canva, approved by Cassio on 07/10/2026). Files in /public/img/bg/.
import { INSIGHT_TOPIC } from '@/lib/insights_meta'

export type Bg = 'solutions' | 'sop' | 'inventory' | 'risk' | 'distribution' | 'audit' | 'how' | 'cases' | 'who' | 'about' | 'insights' | 'contact'

const SERVICE_BG: Record<string, Bg> = {
  's-op-consulting': 'sop', 'conseil-sop': 'sop', 'sop-beratung': 'sop',
  'inventory-optimization': 'inventory', 'optimisation-des-stocks': 'inventory', 'bestandsoptimierung': 'inventory',
  'supply-chain-risk-management': 'risk', 'gestion-des-risques': 'risk', 'risikomanagement': 'risk',
  'distribution-planning': 'distribution', 'planification-distribution': 'distribution', 'distributionsplanung': 'distribution',
  'supply-chain-audit': 'audit', 'rapid-assessment': 'audit',
}
const TOPIC_BG: Record<string, Bg> = { sop: 'sop', planning: 'sop', inventory: 'inventory', suppliers: 'risk', operations: 'distribution' }

export const serviceBg = (slug: string): Bg => SERVICE_BG[slug] || 'solutions'
export const insightBg = (slug: string): Bg => TOPIC_BG[INSIGHT_TOPIC[slug] as string] || 'insights'
export const bgUrl = (bg: Bg) => `/img/bg/${bg}.webp`
