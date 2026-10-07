/** FAQ list as native <details> (works without JavaScript). */
export function Faqs({ items, className = 'faqs' }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={className}>
      {items.map((f) => (
        <details key={f.q} className="faq">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}
