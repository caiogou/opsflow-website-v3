// Topic of each EN insight (filter chips on /en/insights and tags on cards), as in the approved prototype (07/10/2026).
export type Topic = 'planning' | 'inventory' | 'sop' | 'suppliers' | 'operations'

export const TOPICS: { id: Topic; label: string; tile: string }[] = [
  { id: 'planning', label: 'Planning', tile: 't-plan' },
  { id: 'inventory', label: 'Inventory', tile: 't-inv' },
  { id: 'sop', label: 'S&OP/IBP', tile: 't-sop' },
  { id: 'suppliers', label: 'Suppliers', tile: 't-sup' },
  { id: 'operations', label: 'Operations', tile: 't-ops' },
]

export const INSIGHT_TOPIC: Record<string, Topic> = {
  'what-is-sop': 'sop',
  'aggregate-planning': 'sop',
  'supply-chain-kpis-dashboard': 'sop',
  'demand-forecasting': 'planning',
  'mrp-net-requirements-calculation': 'planning',
  'safety-stock': 'inventory',
  'reorder-point-economic-order-quantity': 'inventory',
  'inventory-turnover': 'inventory',
  'dual-sourcing': 'suppliers',
  'otif': 'operations',
  'cost-to-serve': 'operations',
  'process-improvement': 'operations',
  'supply-chain-consultant': 'operations',
  'supply-chain-training': 'operations',
  'onboarding-process': 'operations',
}

// Display order of the index (prototype order: S&OP/IBP, Planning, Inventory, Suppliers, Operations).
export const TOPIC_ORDER: Topic[] = ['sop', 'planning', 'inventory', 'suppliers', 'operations']

export const topicOf = (slug: string) => TOPICS.find((t) => t.id === (INSIGHT_TOPIC[slug] || 'operations'))!
