type ACNode = Record<string, any>

function TextBlock({ node }: { node: ACNode }) {
  const text = String(node.text ?? '')
  const wrap = node.wrap !== false
  const weight = node.weight === 'bolder' ? 'font-bold' : ''
  const sizeCls = node.size === 'large' ? 'text-lg' : node.size === 'small' ? 'text-sm' : 'text-base'
  return <div className={`${sizeCls} ${weight}`} style={{ whiteSpace: wrap ? 'normal' : 'nowrap' }}>{text}</div>
}

function renderNode(node: ACNode, idx: number) {
  switch (node.type) {
    case 'TextBlock':
      return <TextBlock key={idx} node={node} />
    default:
      return (
        <div key={idx} className="text-xs text-gray-500">
          [Unsupported node: {String(node.type)}]
        </div>
      )
  }
}

export default function AdaptiveCardRenderer({ card }: { card: ACNode }) {
  const body: ACNode[] = Array.isArray(card?.body) ? card.body : []
  return <div className="space-y-2">{body.map((n, i) => renderNode(n, i))}</div>
}
