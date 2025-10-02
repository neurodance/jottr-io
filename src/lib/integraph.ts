export type GeneratePayload = {
  prompt: string
  context?: Record<string, unknown>
  constraints?: Record<string, unknown>
  mode?: 'no-code' | 'pro-code'
  draftLevel?: number
}

export type CardJson = Record<string, unknown>

export type ContinuePayload = {
  jottId?: string
  priorContent: CardJson
  desiredAction: 'expand' | 'analyze' | 'lateral' | 'temporal'
  context?: Record<string, unknown>
}

export type ReviewPayload = {
  workflowId: string
  step: string
  decision: 'approve' | 'revise'
  feedback?: string
}

let _enabled = import.meta.env.VITE_ENABLE_INTEGRAPH_ADAPTER === 'true'
let _base = (import.meta.env.VITE_INTEGRAPH_BASE_URL as string | undefined) || ''

export class HttpError extends Error {
  status: number
  correlationId?: string
  constructor(message: string, status: number, correlationId?: string) {
    super(message)
    this.status = status
    this.correlationId = correlationId
  }
}

type Telemetry = {
  onRequest?: (info: { path: string; startedAt: number }) => void
  onResponse?: (info: { path: string; startedAt: number; endedAt: number; ok: boolean; status: number; correlationId?: string }) => void
}

let _telemetry: Telemetry = {}

async function post<T>(path: string, body: unknown): Promise<T> {
  if (!_enabled) throw new HttpError('Integraph adapter disabled (VITE_ENABLE_INTEGRAPH_ADAPTER=false)', 0)
  if (!_base) throw new HttpError('Missing VITE_INTEGRAPH_BASE_URL', 0)
  const url = `${_base}${path}`
  const startedAt = Date.now()
  _telemetry.onRequest?.({ path, startedAt })
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const endedAt = Date.now()
  const correlationId = res.headers.get('x-correlation-id') ?? undefined
  _telemetry.onResponse?.({ path, startedAt, endedAt, ok: res.ok, status: res.status, correlationId })
  if (!res.ok) throw new HttpError(`HTTP ${res.status}`, res.status, correlationId)
  return (await res.json()) as T
}

export type GenerateResponse = {
  correlationId?: string
  status: 'ok' | 'error' | 'pending'
  run_id?: string
  jott_id?: string
  cardJson?: CardJson
  assets?: Array<Record<string, unknown>>
  continuationSuggestions?: string[]
  trace?: Array<Record<string, unknown>>
}

export type ContinueResponse = {
  correlationId?: string
  status: 'ok' | 'error' | 'pending'
  run_id?: string
  jott_id?: string
  updatedCardJson?: CardJson
  nextJott?: Record<string, unknown>
  suggestions?: string[]
  trace?: Array<Record<string, unknown>>
}

export type ReviewResponse = {
  correlationId?: string
  status: 'ok' | 'error' | 'pending'
  run_id?: string
  jott_id?: string
  nextStep?: 'publish' | 'revise' | string
  links?: Record<string, unknown>
}

export const Integraph = {
  isEnabled: () => _enabled,
  setEnabled: (v: boolean) => {
    _enabled = v
    try {
      localStorage.setItem('integraph.enabled', String(v))
    } catch {
      // ignore storage failures
    }
  },
  baseUrl: _base,
  setBaseUrl: (v: string) => {
    _base = v
    try {
      localStorage.setItem('integraph.baseUrl', v)
    } catch {
      // ignore storage failures
    }
  },
  setTelemetry: (t: Telemetry) => {
    _telemetry = t
  },
  generate: (p: GeneratePayload) => post<GenerateResponse>('/workflows/jott-generate', p),
  cont: (p: ContinuePayload) => post<ContinueResponse>('/workflows/jott-continue', p),
  review: (p: ReviewPayload) => post<ReviewResponse>('/workflows/review-approve', p),
}

// Initialize from localStorage overrides if present
try {
  const s = localStorage.getItem('integraph.enabled')
  if (s != null) _enabled = s === 'true'
  const b = localStorage.getItem('integraph.baseUrl')
  if (b) _base = b
} catch {
  // ignore storage failures
}
