import type { ReactNode } from 'react'
import type { ACNode } from '../types/adaptive-card'

export type NodeRenderer = (node: ACNode, index: number) => ReactNode

const registry = new Map<string, NodeRenderer>()

export function registerRenderer(type: string, renderer: NodeRenderer) {
  registry.set(type, renderer)
}

export function unregisterRenderer(type: string) {
  registry.delete(type)
}

export function getRenderer(type?: string): NodeRenderer | undefined {
  if (!type) return undefined
  return registry.get(type)
}

export function listRenderers(): string[] {
  return Array.from(registry.keys()).sort()
}
