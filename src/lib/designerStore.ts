import { useSyncExternalStore } from 'react'

export type DesignerState = {
  session: {
    correlationId?: string
    jottId?: string
    runId?: string
    mode: 'no-code' | 'pro-code'
  }
  document: {
    cardJson: Record<string, unknown> | null
    assets: Array<{ type: string; url: string; meta?: unknown }>
  }
  ui: {
    selectedNodeId?: string
    panel: { composerOpen: boolean; layersOpen: boolean; sidecarOpen: boolean }
  }
  suggestions: string[]
  validation?: {
    schema: '1.5' | '1.6'
    errors: Array<{ path: string; message: string }>
    warnings: Array<{ path: string; message: string }>
  }
}

const defaultState: DesignerState = {
  session: { mode: 'no-code' },
  document: { cardJson: null, assets: [] },
  ui: { panel: { composerOpen: true, layersOpen: true, sidecarOpen: true } },
  suggestions: [],
}

let state: DesignerState = (() => {
  try {
    const raw = localStorage.getItem('designer.state')
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return defaultState
})()

const listeners = new Set<() => void>()

function emit() {
  try {
    localStorage.setItem('designer.state', JSON.stringify(state))
  } catch {
    // ignore
  }
  listeners.forEach((l) => l())
}

export function getState() {
  return state
}

export function setState(next: DesignerState) {
  state = next
  emit()
}

export function update(patch: Partial<DesignerState>) {
  state = { ...state, ...patch, session: { ...state.session, ...(patch.session || {}) }, document: { ...state.document, ...(patch.document || {}) }, ui: { ...state.ui, ...(patch.ui || {}) } }
  emit()
}

export function setCard(cardJson: Record<string, unknown> | null) {
  update({ document: { ...state.document, cardJson } })
}

export function setSuggestions(suggestions: string[]) {
  update({ suggestions })
}

export function resetSession() {
  update({ session: { ...state.session, runId: undefined, jottId: undefined, correlationId: undefined } })
}

export function resumeSession(runId?: string, jottId?: string) {
  update({ session: { ...state.session, runId, jottId } })
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useDesigner(): DesignerState {
  return useSyncExternalStore(subscribe, getState, getState)
}
