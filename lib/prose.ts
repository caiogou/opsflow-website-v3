// Turns the generated article/service HTML (lib/services*.ts, lib/ressources*.ts) into the dark reading layout:
// the in-body <h1> is dropped (the page header carries the single H1), every <h2> gets an id for the table of
// contents, and the trailing FAQ block is cut off so the page can render it as <details> from the `faq` array.
import { CALENDLY } from './booking'

export type TocItem = { id: string; label: string }

const FAQ_HEADINGS = ['Frequently asked questions', 'Questions fréquentes', 'Häufige Fragen']

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&amp;|&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')

export function prepareBody(html: string, opts: { lang: 'en' | 'fr' | 'de'; model?: { decision: string; execution: string } }) {
  let body = html.replace(/<h1>[\s\S]*?<\/h1>\s*/i, '')
  // Cut the FAQ block (rendered separately as <details>).
  for (const h of FAQ_HEADINGS) {
    const i = body.indexOf(`<h2>${h}</h2>`)
    if (i >= 0) { body = body.slice(0, i); break }
  }
  // EN: the free 45-minute session is booked in Calendly; /diagnostic is the self-assessment questionnaire.
  if (opts.lang === 'en') {
    body = body
      .replace(/<a href="\/diagnostic">free 45-minute session<\/a>/g, `<a href="${CALENDLY}" target="_blank" rel="noopener">free 45-minute session</a>`)
      .replace(/<a href="\/diagnostic">free diagnostic session<\/a>/g, `<a href="${CALENDLY}" target="_blank" rel="noopener">free 45-minute session</a>`)
  }
  const toc: TocItem[] = []
  const seen = new Set<string>()
  body = body.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const label = decode(inner.replace(/<[^>]+>/g, '').trim())
    let id = slugify(label) || 'section'
    while (seen.has(id)) id += '-2'
    seen.add(id)
    toc.push({ id, label })
    return `<h2 id="${id}">${inner}</h2>`
  })
  // Two-Layer Model cards before the deliverables (service pages).
  if (opts.model) {
    const card = `<div class="model" aria-label="The Two-Layer Model"><div><b>Decision layer</b><span>${opts.model.decision}</span></div><div><b>Execution layer</b><span>${opts.model.execution}</span></div></div>`
    const at = body.search(/<h2 id="[^"]*">(The deliverables|Les livrables|Die Leistungen)<\/h2>/)
    body = at >= 0 ? body.slice(0, at) + card + body.slice(at) : body + card
  }
  return { body: body.trim(), toc }
}
