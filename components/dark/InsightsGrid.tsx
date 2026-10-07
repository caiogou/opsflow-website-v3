'use client'

import { useState } from 'react'

export type InsightCard = { slug: string; title: string; description: string; topic: string; topicLabel: string; tile: string }

/** Insights index with topic filter chips. Every card is in the server HTML; filtering only hides cards. */
export function InsightsGrid({ cards, topics }: { cards: InsightCard[]; topics: { id: string; label: string }[] }) {
  const [f, setF] = useState('all')
  const shown = cards.filter((c) => f === 'all' || c.topic === f)
  const chips = [{ id: 'all', label: 'All' }, ...topics]
  return (
    <>
      <div className="chips" role="group" aria-label="Filter articles by topic">
        {chips.map((c) => (
          <button key={c.id} className="chip" type="button" aria-pressed={f === c.id} onClick={() => setF(c.id)}>{c.label}</button>
        ))}
      </div>
      <p className="empty" aria-live="polite">{shown.length} {shown.length === 1 ? 'article' : 'articles'}</p>
      <div className="cgrid g3">
        {cards.map((c) => {
          const on = f === 'all' || c.topic === f
          return (
            <a key={c.slug} className="card post" href={`/en/insights/${c.slug}`} hidden={!on} style={on ? undefined : { display: 'none' }}>
              <div className={`tile ${c.tile}`} aria-hidden="true" />
              <div className="in">
                <span className="tag">{c.topicLabel}</span>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <span className="more">Read the article <span aria-hidden="true">→</span></span>
              </div>
            </a>
          )
        })}
      </div>
    </>
  )
}
