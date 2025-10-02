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
import { useDesigner, setCard, setSuggestions, update, resetSession, resumeSession } from '../lib/designerStore'
import { validateAdaptiveCard } from '../lib/validateCard'

export default function EditorPage() {
  const [log, setLog] = useState<string>('')
  const designer = useDesigner()
  const lastCard = designer.document.cardJson
  const [userPrompt, setPrompt] = useState<string>('Welcome card')
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
  const genPayload: GeneratePayload = { prompt: userPrompt, mode: 'no-code', draftLevel: 1 }
  const gen: GenerateResponse = await Integraph.generate(genPayload)
      appendLog('Generated', gen)
      const prior = gen.cardJson ?? { type: 'AdaptiveCard', version: '1.6', body: [] }
  setCard(prior)
  update({ validation: validateAdaptiveCard(prior) })
  // persist IDs if provided
  if (gen.run_id) update({ session: { ...designer.session, runId: gen.run_id, correlationId: gen.correlationId, jottId: gen.jott_id ?? designer.session.jottId } })
  if (Array.isArray(gen.continuationSuggestions)) setSuggestions(gen.continuationSuggestions)
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
      const contPayload: ContinuePayload = { priorContent: prior, desiredAction: action, jottId: designer.session.jottId }
  const cont: ContinueResponse = await Integraph.cont(contPayload)
      appendLog('Continued', cont)
      if (cont.updatedCardJson) {
        setCard(cont.updatedCardJson)
        update({ validation: validateAdaptiveCard(cont.updatedCardJson) })
      }
  if (cont.run_id) update({ session: { ...designer.session, runId: cont.run_id, correlationId: cont.correlationId, jottId: cont.jott_id ?? designer.session.jottId } })
  if (Array.isArray(cont.suggestions)) setSuggestions(cont.suggestions)
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
  const reviewPayload: ReviewPayload = { workflowId: designer.session.runId || 'local', step: 'editor', decision: 'approve', feedback }
      const rev: ReviewResponse = await Integraph.review(reviewPayload)
      appendLog('Reviewed', rev)
  if (rev.run_id) update({ session: { ...designer.session, runId: rev.run_id, correlationId: rev.correlationId, jottId: rev.jott_id ?? designer.session.jottId } })
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
      <div className="text-xs text-gray-600">
        Session: runId={designer.session.runId ?? '(none)'} jottId={designer.session.jottId ?? '(none)'} correlationId={designer.session.correlationId ?? '(none)'}
      </div>
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

      <div className="flex items-center gap-2 text-sm">
        <button className="px-2 py-1 border rounded" onClick={() => resetSession()} disabled={busy}>Reset session</button>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => {
            const next = window.prompt('Enter runId to resume (optional)') || undefined
            resumeSession(next, designer.session.jottId)
          }}
          disabled={busy}
        >
          Resume by runId
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm" htmlFor="prompt-textarea">Prompt</label>
        <textarea
          id="prompt-textarea"
          className="w-full border rounded p-2 text-sm"
          rows={3}
          value={userPrompt}
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
            setCard(null)
            setSuggestions([])
            update({ validation: undefined })
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
          {designer.validation && (designer.validation.errors.length > 0 || designer.validation.warnings.length > 0) && (
            <div className="mt-2 text-xs">
              {designer.validation.errors.length > 0 && (
                <div className="text-red-600">
                  <div className="font-semibold">Errors</div>
                  <ul className="list-disc ml-4">
                    {designer.validation.errors.map((e, i) => (
                      <li key={i}>{e.path ? `${e.path}: ` : ''}{e.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              {designer.validation.warnings.length > 0 && (
                <div className="text-yellow-700 mt-1">
                  <div className="font-semibold">Warnings</div>
                  <ul className="list-disc ml-4">
                    {designer.validation.warnings.map((w, i) => (
                      <li key={i}>{w.path ? `${w.path}: ` : ''}{w.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Raw JSON</summary>
            <pre className="text-xs bg-gray-50 p-2 rounded max-h-80 overflow-auto">{JSON.stringify(lastCard, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  )
}
