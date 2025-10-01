import { registerRenderer } from './rendererRegistry'
import type {
  TextBlockNode,
  ImageNode,
  ContainerNode,
  ColumnSetNode,
  ActionSetNode,
} from '../types/adaptive-card'
import AdaptiveCardRenderer from '../components/AdaptiveCardRenderer'

// Reuse the internal components by importing the default export and referencing exported names via JSX. Since
// the component file doesn't export non-components, we avoid fast-refresh warnings here.
// We re-import and map to closures that call through to the component's internal renderers via switch fallback.

// Lightweight wrappers that rely on AdaptiveCardRenderer's internal renderers through renderNode fallback
export function registerDefaultRenderers() {
  registerRenderer('TextBlock', (node, i) => (
    // Rely on component's switch by reusing it with a single-element body
    <AdaptiveCardRenderer key={`TextBlock-${i}`} card={{ body: [node as TextBlockNode] }} />
  ))
  registerRenderer('Image', (node, i) => (
    <AdaptiveCardRenderer key={`Image-${i}`} card={{ body: [node as ImageNode] }} />
  ))
  registerRenderer('Container', (node, i) => (
    <AdaptiveCardRenderer key={`Container-${i}`} card={{ body: [node as ContainerNode] }} />
  ))
  registerRenderer('ColumnSet', (node, i) => (
    <AdaptiveCardRenderer key={`ColumnSet-${i}`} card={{ body: [node as ColumnSetNode] }} />
  ))
  registerRenderer('ActionSet', (node, i) => (
    <AdaptiveCardRenderer key={`ActionSet-${i}`} card={{ body: [node as ActionSetNode] }} />
  ))
}
