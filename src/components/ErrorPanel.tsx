import type { ReactNode } from 'react'

export function ErrorPanel({ title = 'Error', details, correlationId }: { title?: string; details?: ReactNode; correlationId?: string }) {
  if (!details && !correlationId) return null
  return (
    <div className="mt-2 border border-red-200 bg-red-50 text-red-800 rounded p-2 text-sm">
      <div className="font-semibold">{title}</div>
      {details && <div className="mt-1 text-xs">{details}</div>}
      {correlationId && (
        <div className="mt-1 text-xs opacity-80">correlationId: <code>{correlationId}</code></div>
      )}
    </div>
  )
}
