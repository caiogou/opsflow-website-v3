'use client'
/* Lead capture for the S&OP Health Check. Only the lead form (email/company) and summary scores are sent to /api/lead.
   05/oct/2026: the diagnostic engines (platform) were removed; this is what remains of lib/engine/io.ts. */
export async function captureLead(payload: Record<string, any>): Promise<{ ok: boolean; erro?: string }> {
  try {
    const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, pagina: typeof location !== 'undefined' ? location.pathname : '', idioma: typeof navigator !== 'undefined' ? navigator.language : '' }) })
    const j = await r.json().catch(() => ({ ok: false, erro: 'network' }))
    return j
  } catch { return { ok: false, erro: 'network' } }
}
export const isEmail = (s: string) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(s.trim())
