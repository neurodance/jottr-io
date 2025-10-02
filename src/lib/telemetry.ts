export type TelemetryEvent = {
  path: string
  startedAt: number
  endedAt: number
  ok: boolean
  status: number
  correlationId?: string
}

let events: TelemetryEvent[] = []

export function pushEvent(ev: TelemetryEvent) {
  events.push(ev)
  if (events.length > 200) events = events.slice(-200)
}

export function getEvents(): TelemetryEvent[] {
  return events.slice()
}

export function clearEvents() {
  events = []
}
