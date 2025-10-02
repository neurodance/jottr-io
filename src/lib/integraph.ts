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

async function post<T>(path: string, body: unknown): Promise<T> {
  if (!_enabled) throw new Error('Integraph adapter disabled (VITE_ENABLE_INTEGRAPH_ADAPTER=false)')
  if (!_base) throw new Error('Missing VITE_INTEGRAPH_BASE_URL')
  const res = await fetch(`${_base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
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
