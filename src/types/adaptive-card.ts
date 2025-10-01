// Minimal, extensible Adaptive Card types used by the renderer.
// We intentionally keep fields optional and permissive to support forward-compat.

export type ACUnknown = { type?: string; id?: string; [key: string]: unknown }

export type TextBlockNode = {
  type: 'TextBlock'
  text?: string
  wrap?: boolean
  weight?: 'bolder' | 'default'
  size?: 'small' | 'default' | 'large'
  color?: 'default' | 'accent' | 'good' | 'warning' | 'attention'
} & ACUnknown

export type ImageNode = {
  type: 'Image'
  url: string
  altText?: string
  size?: 'auto' | 'stretch' | 'small' | 'medium' | 'large'
} & ACUnknown

export type ContainerNode = {
  type: 'Container'
  items?: ACNode[]
} & ACUnknown

export type ColumnNode = {
  type?: 'Column'
  width?: 'auto' | 'stretch' | number
  items?: ACNode[]
} & ACUnknown

export type ColumnSetNode = {
  type: 'ColumnSet'
  columns?: ColumnNode[]
} & ACUnknown

export type ActionOpenUrl = {
  type: 'Action.OpenUrl'
  title?: string
  url: string
} & ACUnknown

export type ActionSubmit = {
  type: 'Action.Submit'
  title?: string
  data?: unknown
} & ACUnknown

export type Action = ActionOpenUrl | ActionSubmit | ACUnknown

export type ActionSetNode = {
  type: 'ActionSet'
  actions?: Action[]
} & ACUnknown

export type ACNode =
  | TextBlockNode
  | ImageNode
  | ContainerNode
  | ColumnSetNode
  | ActionSetNode
  | ACUnknown

export type AdaptiveCard = {
  type?: 'AdaptiveCard'
  version?: string
  body?: ACNode[]
  actions?: Action[]
  [key: string]: unknown
}
