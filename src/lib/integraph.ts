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

const ENABLE = import.meta.env.VITE_ENABLE_INTEGRAPH_ADAPTER === 'true'
const BASE = (import.meta.env.VITE_INTEGRAPH_BASE_URL as string | undefined) || ''

async function post<T>(path: string, body: unknown): Promise<T> {
  if (!ENABLE) throw new Error('Integraph adapter disabled (VITE_ENABLE_INTEGRAPH_ADAPTER=false)')
  if (!BASE) throw new Error('Missing VITE_INTEGRAPH_BASE_URL')
  const res = await fetch(`${BASE}${path}`, {
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
  cardJson?: CardJson
  assets?: Array<Record<string, unknown>>
  continuationSuggestions?: string[]
  trace?: Array<Record<string, unknown>>
}

export type ContinueResponse = {
  correlationId?: string
  status: 'ok' | 'error' | 'pending'
  updatedCardJson?: CardJson
  nextJott?: Record<string, unknown>
  suggestions?: string[]
  trace?: Array<Record<string, unknown>>
}

export type ReviewResponse = {
  correlationId?: string
  status: 'ok' | 'error' | 'pending'
  nextStep?: 'publish' | 'revise' | string
  links?: Record<string, unknown>
}

export const Integraph = {
  enabled: ENABLE,
  baseUrl: BASE,
  generate: (p: GeneratePayload) => post<GenerateResponse>('/workflows/jott-generate', p),
  cont: (p: ContinuePayload) => post<ContinueResponse>('/workflows/jott-continue', p),
  review: (p: ReviewPayload) => post<ReviewResponse>('/workflows/review-approve', p),
}
