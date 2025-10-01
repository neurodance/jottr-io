import { useEffect, useState } from 'react'
import {
  Integraph,
  type GeneratePayload,
  type ContinuePayload,
  type ReviewPayload,
  type GenerateResponse,
} from '../lib/integraph'

export default function EditorPage() {
  const [log, setLog] = useState<string>('')
  const [lastCard, setLastCard] = useState<object | null>(null)

  useEffect(() => {
    if (!Integraph.enabled) return
    const run = async () => {
      try {
        const genPayload: GeneratePayload = { prompt: 'Welcome card', mode: 'no-code', draftLevel: 1 }
        const gen: GenerateResponse = await Integraph.generate(genPayload)
        setLog((s) => s + `\nGenerated: ` + JSON.stringify(gen))
        const prior = gen.cardJson ?? { type: 'AdaptiveCard', version: '1.6', body: [] }
        setLastCard(prior)

        const contPayload: ContinuePayload = { priorContent: prior, desiredAction: 'expand' }
        const cont = await Integraph.cont(contPayload)
        setLog((s) => s + `\nContinued: ` + JSON.stringify(cont))

        const reviewPayload: ReviewPayload = { workflowId: 'local', step: 'editor', decision: 'approve' }
        const rev = await Integraph.review(reviewPayload)
        setLog((s) => s + `\nReviewed: ` + JSON.stringify(rev))
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setLog((s) => s + `\nError: ${msg}`)
      }
    }
    run()
  }, [])

  if (!Integraph.enabled) {
    return <div>Jott Editor - Coming Soon (Integraph adapter disabled)</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="font-semibold">Jott Editor - Integraph Smoke</div>
      <div>
        <div className="text-sm text-gray-500">Base URL: {Integraph.baseUrl || '(unset)'}</div>
      </div>
      <pre className="text-xs bg-gray-100 p-2 rounded max-h-80 overflow-auto">{log}</pre>
      {lastCard && (
        <pre className="text-xs bg-gray-50 p-2 rounded max-h-80 overflow-auto">{JSON.stringify(lastCard, null, 2)}</pre>
      )}
    </div>
  )
}
