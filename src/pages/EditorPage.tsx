import { useEffect, useState } from 'react'
import {
  Integraph,
  type GeneratePayload,
  type ContinuePayload,
  type ReviewPayload,
  type GenerateResponse,
  type ContinueResponse,
  type ReviewResponse,
} from '../lib/integraph'
import AdaptiveCardRenderer from '../components/AdaptiveCardRenderer'

export default function EditorPage() {
  const [log, setLog] = useState<string>('')
  const [lastCard, setLastCard] = useState<Record<string, unknown> | null>(null)
  const [prompt, setPrompt] = useState<string>('Welcome card')
  const [action, setAction] = useState<'expand' | 'analyze' | 'lateral' | 'temporal'>('expand')
  const [feedback, setFeedback] = useState<string>('')
  const [autoRun, setAutoRun] = useState<boolean>(false)
  const [busy, setBusy] = useState<boolean>(false)

  const appendLog = (label: string, payload: unknown) =>
    setLog((s) => s + `\n${label}: ` + JSON.stringify(payload))

  const onGenerate = async () => {
  if (!Integraph.isEnabled() || busy) return
    try {
      setBusy(true)
      const genPayload: GeneratePayload = { prompt, mode: 'no-code', draftLevel: 1 }
      const gen: GenerateResponse = await Integraph.generate(genPayload)
      appendLog('Generated', gen)
      const prior = gen.cardJson ?? { type: 'AdaptiveCard', version: '1.6', body: [] }
      setLastCard(prior)
      return gen
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      appendLog('Error', { step: 'generate', msg })
    } finally {
      setBusy(false)
    }
  }

  const onContinue = async () => {
  if (!Integraph.isEnabled() || busy) return
    try {
      setBusy(true)
      const prior = lastCard ?? { type: 'AdaptiveCard', version: '1.6', body: [] }
      const contPayload: ContinuePayload = { priorContent: prior, desiredAction: action }
      const cont: ContinueResponse = await Integraph.cont(contPayload)
      appendLog('Continued', cont)
      if (cont.updatedCardJson) setLastCard(cont.updatedCardJson)
      return cont
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      appendLog('Error', { step: 'continue', msg })
    } finally {
      setBusy(false)
    }
  }

  const onReview = async () => {
  if (!Integraph.isEnabled() || busy) return
    try {
      setBusy(true)
      const reviewPayload: ReviewPayload = { workflowId: 'local', step: 'editor', decision: 'approve', feedback }
      const rev: ReviewResponse = await Integraph.review(reviewPayload)
      appendLog('Reviewed', rev)
      return rev
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      appendLog('Error', { step: 'review', msg })
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
  if (!Integraph.isEnabled() || !autoRun) return
    ;(async () => {
      await onGenerate()
      await onContinue()
      await onReview()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun])

  if (!Integraph.isEnabled()) {
    return <div>Jott Editor - Coming Soon (Integraph adapter disabled)</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="font-semibold">Jott Editor - Integraph Harness</div>
      <div className="text-sm text-gray-500">Base URL: {Integraph.baseUrl || '(unset)'}</div>
      <div className="flex items-center gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Integraph.isEnabled()}
            onChange={(e) => Integraph.setEnabled(e.target.checked)}
          />
          Enable adapter
        </label>
        <input
          className="border rounded p-1"
          defaultValue={Integraph.baseUrl}
          onBlur={(e) => Integraph.setBaseUrl(e.target.value)}
          placeholder="http://localhost:8000"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm" htmlFor="prompt-textarea">Prompt</label>
        <textarea
          id="prompt-textarea"
          className="w-full border rounded p-2 text-sm"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the Jott you want to create"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm" htmlFor="action-select">Continue action</label>
        <select
          id="action-select"
          className="border rounded p-1 text-sm"
          value={action}
          onChange={(e) => setAction(e.target.value as typeof action)}
          title="Select continuation action"
        >
          <option value="expand">expand</option>
          <option value="analyze">analyze</option>
          <option value="lateral">lateral</option>
          <option value="temporal">temporal</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm" htmlFor="feedback-input">Feedback (optional)</label>
        <input
          id="feedback-input"
          className="w-full border rounded p-2 text-sm"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add any review notes"
        />
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-1 border rounded" onClick={onGenerate} disabled={busy}>
          Generate
        </button>
        <button className="px-3 py-1 border rounded" onClick={onContinue} disabled={busy}>
          Continue
        </button>
        <button className="px-3 py-1 border rounded" onClick={onReview} disabled={busy}>
          Review Approve
        </button>
        <label className="ml-4 text-sm flex items-center gap-2">
          <input type="checkbox" checked={autoRun} onChange={(e) => setAutoRun(e.target.checked)} />
          Auto-run
        </label>
        <button
          className="ml-2 px-3 py-1 border rounded"
          onClick={() => {
            setLog('')
            setLastCard(null)
          }}
          disabled={busy}
        >
          Clear
        </button>
      </div>

      <pre className="text-xs bg-gray-100 p-2 rounded max-h-80 overflow-auto">{log}</pre>
      {lastCard && (
        <div className="border rounded p-3">
          <div className="text-sm font-semibold mb-2">Preview</div>
          <AdaptiveCardRenderer card={lastCard} />
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Raw JSON</summary>
            <pre className="text-xs bg-gray-50 p-2 rounded max-h-80 overflow-auto">{JSON.stringify(lastCard, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  )
}
