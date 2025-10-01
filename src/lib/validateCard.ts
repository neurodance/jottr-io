export type Validation = {
  schema: '1.5' | '1.6'
  errors: Array<{ path: string; message: string }>
  warnings: Array<{ path: string; message: string }>
}

export function validateAdaptiveCard(card: unknown): Validation {
  const v: Validation = { schema: '1.6', errors: [], warnings: [] }
  if (typeof card !== 'object' || card === null) {
    v.errors.push({ path: '', message: 'Card must be an object' })
    return v
  }
  const obj = card as Record<string, unknown>
  if (obj.type !== 'AdaptiveCard') v.errors.push({ path: 'type', message: 'type must be AdaptiveCard' })
  if (obj.version !== '1.6' && obj.version !== '1.5') v.errors.push({ path: 'version', message: 'version must be 1.5 or 1.6' })
  if (!Array.isArray(obj.body)) v.errors.push({ path: 'body', message: 'body must be an array' })
  return v
}
