import { NextRequest, NextResponse } from 'next/server'

// Leads go to Supabase via the SECURITY DEFINER RPC `opsflow_capturar_lead` (validates e-mail, rate-limits).
// The table itself is not readable/writable by the public key.
const URL_ = process.env.SUPABASE_URL || 'https://szqsbqzctacwhoqgdzba.supabase.co'
const KEY = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_V0ZBb90GS2D798tHjBRvTA_B83lD7Kz'

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, erro: 'json' }, { status: 400 }) }
  if (!body || typeof body !== 'object') return NextResponse.json({ ok: false, erro: 'json' }, { status: 400 })
  if (body.website) return NextResponse.json({ ok: true }) // honeypot
  const p = { ...body, user_agent: req.headers.get('user-agent') || '' }
  try {
    const r = await fetch(`${URL_}/rest/v1/rpc/opsflow_capturar_lead`, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p }),
      cache: 'no-store',
    })
    const j = await r.json().catch(() => ({ ok: false, erro: 'upstream' }))
    return NextResponse.json(j, { status: r.ok ? 200 : 502 })
  } catch {
    return NextResponse.json({ ok: false, erro: 'upstream' }, { status: 502 })
  }
}
