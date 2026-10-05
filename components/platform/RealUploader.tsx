'use client'
import { useRef, useState, type ComponentType } from 'react'
import { Upload, FileSpreadsheet, X, Lock, Download } from 'lucide-react'
import { LogoIcon } from '@/components/LogoIcon'
import { readFiles, captureLead, isEmail, downloadCSV, type Table } from '@/lib/engine/io'

export type TemplateSpec = {
  name: string
  desc: string
  icon?: ComponentType<{ size?: number; className?: string }>
  filename: string
  headers: string[]
  sample: (string | number)[][]
}

type Props = {
  engine: string            // e.g. 'platform/demand'
  eyebrow: string           // e.g. 'Demand & Forecast Diagnostic'
  title: string
  intro: string
  templates: TemplateSpec[]
  /** Compute the dataset from parsed tables. Throw an Error with a human message if data is insufficient. */
  onAnalyze: (tables: Table[]) => { summary?: Record<string, any> } | void
  onDemo: () => void
}

export function RealUploader({ engine, eyebrow, title, intro, templates, onAnalyze, onDemo }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [hp, setHp] = useState('')

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const ok = Array.from(list).filter((f) => /\.(xlsx|xls|csv)$/i.test(f.name) && f.size <= 50 * 1024 * 1024)
    if (ok.length < list.length) setError('Only .xlsx, .xls or .csv files up to 50 MB are accepted.')
    else setError(null)
    setFiles((prev) => [...prev, ...ok].slice(0, 6))
  }

  const run = async () => {
    setError(null)
    if (!files.length) { setError('Add at least one file (use the templates above).'); return }
    if (!isEmail(email)) { setError('Enter a valid work e-mail to receive and keep your diagnostic.'); return }
    setBusy(true)
    try {
      const tables = await readFiles(files)
      if (!tables.length) throw new Error('The files look empty. Check that the first row has column headers.')
      const res = onAnalyze(tables) || {}
      captureLead({ origem: engine, email, empresa: company, website: hp, extra: { files: files.map((f) => f.name), ...(res.summary || {}) } })
    } catch (e: any) {
      setError(e?.message || 'We could not read these files. Please use the templates.')
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-5">
      <div className="max-w-xl w-full bg-navy-deep/50 rounded-2xl border border-navy-mid p-10">
        <div className="flex items-center gap-3 mb-8">
          <LogoIcon size={38} />
          <div>
            <div className="text-lg font-bold text-white tracking-tight">OpsFlow Advisory</div>
            <div className="text-[11px] text-teal-muted tracking-widest uppercase">{eyebrow}</div>
          </div>
        </div>
        <h1 className="text-2xl font-serif text-white mb-3">{title}</h1>
        <p className="text-teal-muted text-sm leading-relaxed mb-8">{intro}</p>

        <div className="space-y-3 mb-6">
          {templates.map((t) => {
            const Icon = t.icon || FileSpreadsheet
            return (
              <div key={t.name} className="flex items-center gap-4 p-4 rounded-xl border border-navy-mid bg-navy/40">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center"><Icon size={18} className="text-teal" /></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-teal-muted/50">{t.desc}</div>
                </div>
                <button type="button" onClick={() => downloadCSV(t.filename, t.headers, t.sample)}
                  className="px-3 py-1.5 rounded border border-navy-mid text-teal-muted text-xs hover:border-teal transition-colors inline-flex items-center gap-1">
                  <Download size={12} /> Template
                </button>
              </div>
            )
          })}
        </div>

        <input ref={inputRef} type="file" multiple accept=".xlsx,.xls,.csv" className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
        <div
          role="button" tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click() }}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-4 transition-colors cursor-pointer ${drag ? 'border-teal bg-teal/5' : 'border-navy-mid hover:border-teal/40'}`}
        >
          <Upload size={32} className="text-teal-muted/30 mx-auto mb-3" />
          <div className="text-sm text-teal-muted mb-1">Drop files here or click to upload</div>
          <div className="text-xs text-teal-muted/30">.xlsx, .csv — max 50MB per file</div>
        </div>

        {files.length > 0 && (
          <ul className="mb-4 space-y-1">
            {files.map((f, i) => (
              <li key={f.name + i} className="flex items-center justify-between text-xs text-teal-muted bg-navy/40 rounded px-3 py-2">
                <span className="truncate">{f.name} · {(f.size / 1024).toFixed(0)} KB</span>
                <button type="button" aria-label="Remove file" onClick={() => setFiles(files.filter((_, j) => j !== i))}><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work e-mail *"
            className="px-3 py-3 rounded-lg border border-navy-mid bg-navy/60 text-white text-sm placeholder:text-teal-muted/40 focus:border-teal focus:outline-none" />
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company"
            className="px-3 py-3 rounded-lg border border-navy-mid bg-navy/60 text-white text-sm placeholder:text-teal-muted/40 focus:border-teal focus:outline-none" />
          <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" name="website" />
        </div>

        {error && <div className="mb-3 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">{error}</div>}

        <button type="button" onClick={run} disabled={busy}
          className="w-full py-3.5 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-colors mb-3 disabled:opacity-60">
          {busy ? 'Analysing your data…' : 'Run my diagnostic'}
        </button>
        <p className="text-[11px] text-teal-muted/40 mb-6 flex items-center gap-1.5">
          <Lock size={11} /> Your files are processed in your browser and are never uploaded to our servers.
        </p>

        <button type="button" onClick={onDemo}
          className="w-full py-3 rounded-lg bg-teal/10 text-teal text-sm font-semibold hover:bg-teal/20 transition-colors border border-teal/30">
          Or preview a sample diagnostic (fictional company)
        </button>
      </div>
    </div>
  )
}
