import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inventory & Working Capital Diagnostic — OpsFlow Advisory',
  description: 'Data-driven inventory diagnostic: ABC/XYZ segmentation, excess & obsolete identification, working capital optimization, and prioritised recommendations.',
}

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
