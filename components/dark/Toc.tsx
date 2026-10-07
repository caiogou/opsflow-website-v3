'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/prose'

/** "On this page" list; the current section follows the reader. */
export function Toc({ items, title = 'On this page' }: { items: TocItem[]; title?: string }) {
  const [cur, setCur] = useState(0)
  useEffect(() => {
    const heads = items.map((i) => document.getElementById(i.id))
    const on = () => {
      let c = 0
      heads.forEach((h, i) => { if (h && h.getBoundingClientRect().top < 140) c = i })
      setCur(c)
    }
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [items])
  return (
    <nav className="toc" aria-label={title}>
      <h5>{title}</h5>
      <ol>
        {items.map((i, n) => (
          <li key={i.id}><a href={`#${i.id}`} className={n === cur ? 'on' : undefined}>{i.label}</a></li>
        ))}
      </ol>
    </nav>
  )
}
