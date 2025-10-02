import type {
  AdaptiveCard,
  ACNode,
  TextBlockNode,
  ContainerNode,
  ColumnSetNode,
  ColumnNode,
  ImageNode,
  ImageSetNode,
  MediaNode,
  ActionSetNode,
  Action,
  FactSetNode,
  RichTextBlockNode,
  InputTextNode,
  InputNumberNode,
  InputToggleNode,
  InputChoiceSetNode,
  InputDateNode,
  InputTimeNode,
  ACUnknown,
} from '../types/adaptive-card'
import { getRenderer } from '../lib/rendererRegistry'
import { theme } from '../lib/theme'
import { useMemo, useState } from 'react'

function TextBlock({ node }: { node: TextBlockNode }) {
  const text = String(node.text ?? '')
  const wrap = node.wrap !== false
  const weight = node.weight === 'bolder' ? theme.text.weight.bold : theme.text.weight.normal
  const sizeCls = node.size === 'large' ? theme.text.size.large : node.size === 'small' ? theme.text.size.small : theme.text.size.default
  const wrapCls = wrap ? theme.layout.wrap.on : theme.layout.wrap.off
  const colorCls = theme.text.color[node.color ?? 'default'] ?? theme.text.color.default
  return <div className={`${sizeCls} ${weight} ${wrapCls} ${colorCls}`}>{text}</div>
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
  return <div className={theme.layout.spacing.default}>{items.map((n, i) => renderNode(n, i))}</div>
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
  const justify = theme.layout.hAlign[node.horizontalAlignment ?? 'left']
  return (
    <div className={`flex -mx-2 flex-row gap-0 ${justify}`}>
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

function ShowCardButton({ title, card }: { title: string; card?: AdaptiveCard }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button type="button" className={theme.button} onClick={() => setOpen((v) => !v)}>
        {title}
      </button>
      {open && card && (
        <div className="mt-2 p-2 border rounded">
          <AdaptiveCardRenderer card={card} />
        </div>
      )}
    </div>
  )
}

function ActionButton({ action, toggleVisibility }: { action: Action; toggleVisibility: (targets: Array<string | { elementId: string; isVisible?: boolean }>) => void }) {
  const title: string = hasTitle(action) && typeof (action as Record<string, unknown>).title === 'string' ? ((action as Record<string, unknown>).title as string) : 'Action'
  const common = 'px-3 py-1.5 rounded border text-sm hover:bg-gray-50'
  // could be replaced with theme.button later
  if (isOpenUrl(action)) {
    return (
      <a href={action.url} target="_blank" rel="noreferrer" className={common}>
        {title}
      </a>
    )
  }
  if ((action as Record<string, unknown>).type === 'Action.ShowCard') {
    const card = (action as Record<string, unknown>).card as AdaptiveCard | undefined
    return <ShowCardButton title={title} card={card} />
  }
  if ((action as Record<string, unknown>).type === 'Action.ToggleVisibility') {
    const targets = (action as Record<string, unknown>).targetElements as Array<string | { elementId: string; isVisible?: boolean }>
    return (
      <button type="button" className={common} onClick={() => toggleVisibility(targets ?? [])}>
        {title}
      </button>
    )
  }
  // Submit or unknown action: non-functional placeholder button
  return <button type="button" className={common}>{title}</button>
}

function ActionSet({ node, toggleVisibility }: { node: ActionSetNode; toggleVisibility: (targets: Array<string | { elementId: string; isVisible?: boolean }>) => void }) {
  const actions = Array.isArray(node.actions) ? node.actions : []
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {actions.map((a, i) => (
        <ActionButton key={i} action={a} toggleVisibility={toggleVisibility} />
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
      return <ActionSet key={idx} node={node as ActionSetNode} toggleVisibility={() => {}} />
    case 'FactSet': {
      const n = node as FactSetNode
      const facts = Array.isArray(n.facts) ? n.facts : []
      return (
        <table key={idx} className="text-sm">
          <tbody>
            {facts.map((f, i) => (
              <tr key={i}>
                <td className="pr-4 text-gray-600 whitespace-nowrap">{f.title}</td>
                <td>{f.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    case 'ImageSet': {
      const n = node as ImageSetNode
      const imgs = Array.isArray(n.images) ? n.images : []
      const size = n.imageSize ?? 'medium'
      const sizeCls = size === 'small' ? 'w-16' : size === 'large' ? 'w-64' : 'w-32'
      return (
        <div key={idx} className="flex flex-row flex-wrap gap-2">
          {imgs.map((img, i) => (
            <img key={i} src={img.url} alt={img.altText ?? ''} className={`${sizeCls} h-auto object-contain`} />
          ))}
        </div>
      )
    }
    case 'Media': {
      const n = node as MediaNode
      const sources = Array.isArray(n.sources) ? n.sources : []
      const video = sources.find((s) => (s.mimeType ?? '').startsWith('video/'))
      const audio = sources.find((s) => (s.mimeType ?? '').startsWith('audio/'))
      if (video) {
        return (
          <video key={idx} controls poster={n.poster} autoPlay={!!n.autoplay} loop={!!n.loop} className="w-full">
            {sources.map((s, i) => (
              <source key={i} src={s.url} type={s.mimeType} />
            ))}
            {n.altText}
          </video>
        )
      }
      if (audio) {
        return (
          <audio key={idx} controls autoPlay={!!n.autoplay} loop={!!n.loop} className="w-full">
            {sources.map((s, i) => (
              <source key={i} src={s.url} type={s.mimeType} />
            ))}
            {n.altText}
          </audio>
        )
      }
      // Fallback: try video tag with provided sources
      return (
        <video key={idx} controls poster={n.poster} autoPlay={!!n.autoplay} loop={!!n.loop} className="w-full">
          {sources.map((s, i) => (
            <source key={i} src={s.url} type={s.mimeType} />
          ))}
          {n.altText}
        </video>
      )
    }
    case 'RichTextBlock': {
      const n = node as RichTextBlockNode
      const inlines = Array.isArray(n.inlines) ? n.inlines : []
      return (
        <div key={idx} className="text-base">
          {inlines.map((r, i) => {
            if (typeof r === 'string') return <span key={i}>{r}</span>
            const cls = [
              r.bold ? 'font-bold' : '',
              r.italic ? 'italic' : '',
              r.underline ? 'underline' : '',
              r.size === 'small' ? 'text-sm' : r.size === 'large' ? 'text-lg' : 'text-base',
            ]
              .filter(Boolean)
              .join(' ')
            return <span key={i} className={cls}>{r.text}</span>
          })}
        </div>
      )
    }
    case 'Input.Text':
      return (
        <input
          key={idx}
          type="text"
          className="border rounded p-2 text-sm w-full"
          placeholder={(node as InputTextNode).placeholder}
          defaultValue={(node as InputTextNode).value}
        />
      )
    case 'Input.Number':
      return (
        <input
          key={idx}
          type="number"
          className="border rounded p-2 text-sm w-full"
          placeholder={(node as InputNumberNode).placeholder}
          defaultValue={(node as InputNumberNode).value}
          min={(node as InputNumberNode).min}
          max={(node as InputNumberNode).max}
        />
      )
    case 'Input.Toggle':
      return (
        <label key={idx} className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked={(node as InputToggleNode).value === 'true'} />
          {(node as InputToggleNode).title}
        </label>
      )
    case 'Input.ChoiceSet': {
      const n = node as InputChoiceSetNode
      const choices = Array.isArray(n.choices) ? n.choices : []
      const multi = !!n.isMultiSelect
      const style = n.style ?? 'compact'
      if (style === 'expanded') {
        return (
          <div key={idx} className={theme.text.size.default}>
            {choices.map((c, i) => (
              <label key={i} className="flex items-center gap-2 py-0.5">
                <input type={multi ? 'checkbox' : 'radio'} name={n.id} defaultChecked={Array.isArray(n.value) ? n.value?.includes(c.value ?? '') : n.value === c.value} />
                <span>{c.title}</span>
              </label>
            ))}
          </div>
        )
      }
      // compact -> select
      return (
        <select
          key={idx}
          multiple={multi}
          {...(multi
            ? { defaultValue: (Array.isArray(n.value) ? n.value : n.value ? [n.value] : []) as string[] }
            : { defaultValue: (typeof n.value === 'string' ? n.value : undefined) as string | undefined })}
          className={theme.input}
          aria-label={n.placeholder ?? n.id ?? 'choices'}
        >
          {choices.map((c, i) => (
            <option key={i} value={c.value}>
              {c.title}
            </option>
          ))}
        </select>
      )
    }
    case 'Input.Date':
      return <input key={idx} type="date" className={theme.input} defaultValue={(node as InputDateNode).value} placeholder={(node as InputDateNode).placeholder} />
    case 'Input.Time':
      return <input key={idx} type="time" className={theme.input} defaultValue={(node as InputTimeNode).value} placeholder={(node as InputTimeNode).placeholder} />
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
  // Track runtime visibility toggles by element id
  const [visibility, setVisibility] = useState<Record<string, boolean>>({})
  const toggleVisibility = (targets: Array<string | { elementId: string; isVisible?: boolean }>) => {
    setVisibility((prev) => {
      const next = { ...prev }
      for (const t of targets ?? []) {
        const id = typeof t === 'string' ? t : t.elementId
        const setTo = typeof t === 'string' ? undefined : t.isVisible
        if (!id) continue
        const current = id in prev ? !!prev[id] : true
        next[id] = typeof setTo === 'boolean' ? setTo : !current
      }
      return next
    })
  }
  const shouldShow = useMemo(() => (id?: string) => {
    if (!id) return true
    if (id in visibility) return !!visibility[id]
    return true
  }, [visibility])
  return (
    <div className={theme.layout.spacing.medium}>
  <div className={theme.layout.spacing.default}>{body.map((n, i) => (shouldShow((n as ACUnknown).id) ? renderNode(n, i) : null))}</div>
      {actions.length > 0 && (
        <div>
          <ActionSet node={{ type: 'ActionSet', actions }} toggleVisibility={toggleVisibility} />
        </div>
      )}
    </div>
  )
}

// Note: registration of default renderers is provided in lib/defaultRenderers.tsx to preserve fast-refresh.
