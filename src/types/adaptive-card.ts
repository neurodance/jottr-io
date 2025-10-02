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

export type Fact = { title?: string; value?: string }
export type FactSetNode = {
  type: 'FactSet'
  facts?: Fact[]
} & ACUnknown

export type TextRun = { type?: 'TextRun'; text?: string; bold?: boolean; italic?: boolean; underline?: boolean; size?: 'small' | 'default' | 'large' }
export type RichTextBlockNode = {
  type: 'RichTextBlock'
  inlines?: Array<TextRun | string>
} & ACUnknown

export type InputTextNode = {
  type: 'Input.Text'
  id?: string
  placeholder?: string
  value?: string
  isMultiline?: boolean
} & ACUnknown

export type InputNumberNode = {
  type: 'Input.Number'
  id?: string
  placeholder?: string
  value?: number
  min?: number
  max?: number
} & ACUnknown

export type InputToggleNode = {
  type: 'Input.Toggle'
  id?: string
  title?: string
  value?: 'true' | 'false'
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

export type ActionShowCard = {
  type: 'Action.ShowCard'
  title?: string
  card?: AdaptiveCard
} & ACUnknown

export type Action = ActionOpenUrl | ActionSubmit | ActionShowCard | ACUnknown

export type ActionSetNode = {
  type: 'ActionSet'
  actions?: Action[]
} & ACUnknown

export type ACNode =
  | TextBlockNode
  | ImageNode
  | ContainerNode
  | ColumnSetNode
  | FactSetNode
  | RichTextBlockNode
  | InputTextNode
  | InputNumberNode
  | InputToggleNode
  | ActionSetNode
  | ACUnknown

export type AdaptiveCard = {
  type?: 'AdaptiveCard'
  version?: string
  body?: ACNode[]
  actions?: Action[]
  [key: string]: unknown
}
