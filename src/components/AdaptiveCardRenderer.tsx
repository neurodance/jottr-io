import type {
  AdaptiveCard,
  ACNode,
  TextBlockNode,
  ContainerNode,
  ColumnSetNode,
  ColumnNode,
  ImageNode,
  ActionSetNode,
  Action,
} from '../types/adaptive-card'
import { getRenderer } from '../lib/rendererRegistry'

function TextBlock({ node }: { node: TextBlockNode }) {
  const text = String(node.text ?? '')
  const wrap = node.wrap !== false
  const weight = node.weight === 'bolder' ? 'font-bold' : ''
  const sizeCls = node.size === 'large' ? 'text-lg' : node.size === 'small' ? 'text-sm' : 'text-base'
  const wrapCls = wrap ? 'whitespace-normal' : 'whitespace-nowrap'
  return <div className={`${sizeCls} ${weight} ${wrapCls}`}>{text}</div>
}

function Image({ node }: { node: ImageNode }) {
  const alt = node.altText ?? ''
  const sizeCls =
    node.size === 'small'
      ? 'w-16 h-auto'
      : node.size === 'medium'
      ? 'w-32 h-auto'
      : node.size === 'large'
      ? 'w-64 h-auto'
      : node.size === 'stretch'
      ? 'w-full h-auto'
      : 'w-auto h-auto'
  return <img src={node.url} alt={alt} className={`${sizeCls} object-contain`} />
}

function Container({ node }: { node: ContainerNode }) {
  const items = Array.isArray(node.items) ? node.items : []
  return <div className="space-y-2">{items.map((n, i) => renderNode(n, i))}</div>
}

function Column({ node }: { node: ColumnNode }) {
  const items = Array.isArray(node.items) ? node.items : []
  let widthCls = 'flex-1' // stretch default
  if (typeof node.width === 'number') {
    const pct = Math.max(0, Math.min(100, node.width))
    widthCls = `grow-0 shrink-0 basis-[${pct}%]`
  } else if (node.width === 'auto') {
    widthCls = 'flex-none'
  }
  return <div className={`px-2 ${widthCls}`}>{items.map((n, i) => renderNode(n, i))}</div>
}

function ColumnSet({ node }: { node: ColumnSetNode }) {
  const cols = Array.isArray(node.columns) ? node.columns : []
  return (
    <div className="flex -mx-2 flex-row gap-0">
      {cols.map((c, i) => (
        <Column key={i} node={c} />
      ))}
    </div>
  )
}

function hasTitle(a: Action | Record<string, unknown>): a is Action & { title?: unknown } {
  return typeof (a as Record<string, unknown>).title !== 'undefined'
}

function isOpenUrl(a: Action | Record<string, unknown>): a is Extract<Action, { type: 'Action.OpenUrl' }> {
  const r = a as Record<string, unknown>
  return typeof r.type === 'string' && r.type === 'Action.OpenUrl' && typeof r.url === 'string'
}

function ActionButton({ action }: { action: Action }) {
  const title: string = hasTitle(action) && typeof (action as Record<string, unknown>).title === 'string' ? ((action as Record<string, unknown>).title as string) : 'Action'
  const common = 'px-3 py-1.5 rounded border text-sm hover:bg-gray-50'
  if (isOpenUrl(action)) {
    return (
      <a href={action.url} target="_blank" rel="noreferrer" className={common}>
        {title}
      </a>
    )
  }
  // Submit or unknown action: non-functional placeholder button
  return <button type="button" className={common}>{title}</button>
}

function ActionSet({ node }: { node: ActionSetNode }) {
  const actions = Array.isArray(node.actions) ? node.actions : []
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {actions.map((a, i) => (
        <ActionButton key={i} action={a} />
      ))}
    </div>
  )
}

function renderNode(node: ACNode, idx: number) {
  // Prefer registry-provided renderer for this type if available
  const t = ((): string | undefined => {
    const r = node as Record<string, unknown>
    return typeof r.type === 'string' ? r.type : undefined
  })()
  const fromRegistry = getRenderer(t)
  if (fromRegistry) return fromRegistry(node, idx)

  switch (node.type) {
    case 'TextBlock':
      return <TextBlock key={idx} node={node as TextBlockNode} />
    case 'Image':
      return <Image key={idx} node={node as ImageNode} />
    case 'Container':
      return <Container key={idx} node={node as ContainerNode} />
    case 'ColumnSet':
      return <ColumnSet key={idx} node={node as ColumnSetNode} />
    case 'ActionSet':
      return <ActionSet key={idx} node={node as ActionSetNode} />
    default:
      return (
        <div key={idx} className="text-xs text-gray-500">
          [Unsupported node: {(() => {
            const r = node as Record<string, unknown>
            return typeof r.type === 'string' ? r.type : 'unknown'
          })()}]
        </div>
      )
  }
}

export default function AdaptiveCardRenderer({ card }: { card: AdaptiveCard }) {
  const body: ACNode[] = Array.isArray(card?.body) ? card.body : []
  const actions: Action[] = Array.isArray(card?.actions) ? card.actions : []
  return (
    <div className="space-y-3">
      <div className="space-y-2">{body.map((n, i) => renderNode(n, i))}</div>
      {actions.length > 0 && (
        <div>
          <ActionSet node={{ type: 'ActionSet', actions }} />
        </div>
      )}
    </div>
  )
}

// Note: registration of default renderers is provided in lib/defaultRenderers.tsx to preserve fast-refresh.
