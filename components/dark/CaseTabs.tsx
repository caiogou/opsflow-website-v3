'use client'

import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from 'react'

type Panel = { id: string; label: string; content: ReactNode }

/** Sticky tab bar; one panel visible at a time; follows and updates the URL hash. All panels stay in the HTML. */
export function CaseTabs({ panels }: { panels: Panel[] }) {
  const [cur, setCur] = useState(panels[0].id)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1)
      if (panels.some((p) => p.id === h)) setCur(h)
    }
    fromHash()
    addEventListener('hashchange', fromHash)
    return () => removeEventListener('hashchange', fromHash)
  }, [panels])

  useEffect(() => {
    const c = bar.current
    const t = c?.querySelector<HTMLAnchorElement>(`a[href="#${cur}"]`)
    if (c && t && c.scrollWidth > c.clientWidth) c.scrollLeft = Math.max(0, t.offsetLeft - c.offsetLeft - 16)
  }, [cur])

  const select = (id: string) => {
    setCur(id)
    history.replaceState(null, '', `#${id}`)
  }
  const onKey = (e: KeyboardEvent<HTMLAnchorElement>, i: number) => {
    const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!k) return
    e.preventDefault()
    const n = panels[(i + k + panels.length) % panels.length]
    select(n.id)
    bar.current?.querySelector<HTMLAnchorElement>(`a[href="#${n.id}"]`)?.focus()
  }

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Case study sections" ref={bar}>
        {panels.map((p, i) => (
          <a
            key={p.id}
            href={`#${p.id}`}
            role="tab"
            id={`tab-${p.id}`}
            aria-controls={p.id}
            aria-selected={cur === p.id}
            tabIndex={cur === p.id ? 0 : -1}
            onClick={(e) => { e.preventDefault(); select(p.id) }}
            onKeyDown={(e) => onKey(e, i)}
          >
            {p.label}
          </a>
        ))}
      </div>
      {panels.map((p) => (
        <div key={p.id} className="panel" id={p.id} role="tabpanel" aria-labelledby={`tab-${p.id}`} hidden={cur !== p.id} style={{ paddingTop: 36 }}>
          {p.content}
        </div>
      ))}
    </>
  )
}
