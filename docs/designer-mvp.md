# Jott Designer MVP Contract

This document defines the minimal product contract for the Jott Designer inside `jottr-io`. It focuses on a usable end-to-end loop with Integraph while keeping scope small and learnable.

## Core panes

- Composer (chat-like)
  - Input box with multiline prompt
  - Primary actions: Generate, Continue (with action choice), Clear
  - Secondary: History of prompts in session
- Live Preview
  - Renders Adaptive Card JSON (1.6 target)
  - Updates instantly on backend responses and local edits
  - Supports simulating Action.Submit and OpenUrl (no external side effects)
- Layers/Frames
  - Tree view of Adaptive Card elements (id-based when present)
  - Select node -> property inspector focuses that node
  - Basic move up/down within container; delete node
- Suggestion Sidecar
  - Displays continuation suggestions from backend: [expand, analyze, lateral, temporal]
  - One-click to apply as a new Continue request

## Minimal state shape

```ts
// High-level, framework-agnostic
interface DesignerState {
  session: {
    correlationId?: string;
    jottId?: string;
    mode: "no-code" | "pro-code";
  };
  document: {
    cardJson: any; // Adaptive Card JSON (1.6 preferred)
    assets: Array<{ type: string; url: string; meta?: any }>; // optional
  };
  ui: {
    selectedNodeId?: string;
    panel: {
      composerOpen: boolean;
      layersOpen: boolean;
      sidecarOpen: boolean;
    };
  };
  suggestions: string[]; // e.g., ["expand", "analyze", "lateral", "temporal"]
  validation?: {
    schema: "1.5" | "1.6";
    errors: Array<{ path: string; message: string }>;
    warnings: Array<{ path: string; message: string }>;
  };
}
```

## Events (UI → Controller)

- submitPrompt(text, context?, constraints?, mode?, draftLevel?)
- continueWith(desiredAction, priorContent, context?)
- approveReview(decision: "approve" | "revise", feedback?)
- selectNode(nodeId)
- editProperty(nodeId, path, value)
- addElement(parentId, index, element)
- deleteElement(nodeId)
- reorderElement(nodeId, direction: "up" | "down")
- switchMode("no-code" | "pro-code")
- undo(), redo()
- importCard(json), exportCard()

## Events (Backend → Controller)

- generated({ correlationId, status, cardJson, assets, continuationSuggestions, trace })
- updated({ correlationId, status, updatedCardJson, nextJott, suggestions, trace })
- reviewResult({ correlationId, status, nextStep, links })
- error({ status: "error", errorCode, message })

## Adapter bindings (Integraph)

- POST /workflows/jott-generate
  - Send: { prompt, context, constraints, mode, draftLevel }
  - Receive: { correlationId, status, cardJson, assets, continuationSuggestions, trace }
- POST /workflows/jott-continue
  - Send: { jottId?, priorContent, desiredAction, context }
  - Receive: { correlationId, status, updatedCardJson, nextJott, suggestions, trace }
- POST /workflows/review-approve
  - Send: { workflowId, step: "editor", decision: "approve|revise", feedback? }
  - Receive: { correlationId, status, nextStep, links }

See `workspaces/integraph/docs/adapter-spec.md` for payload details and error envelope.

## Minimal flows (happy path)

1) User enters a prompt and clicks Generate
2) Controller calls /workflows/jott-generate; state updated with correlationId; UI shows pending
3) Response arrives: update `document.cardJson`, `suggestions`, `session.mode` remains; preview updates
4) User clicks a suggestion (e.g., "expand"); controller calls /workflows/jott-continue
5) Response updates `document.cardJson` and optionally `suggestions`; preview updates
6) User toggles pro-code, edits JSON; preview re-renders; validation runs
7) User approves review; controller calls /workflows/review-approve; response sets `nextStep`

## Edge cases to handle

- Pending/long-running responses (show spinner and allow cancel)
- Error envelope from backend (toast + retain last good state)
- Schema mismatch or invalid JSON (show validation errors, fall back to last valid render)
- Large assets or unreachable URLs (defer or placeholder visuals)
- Undo/Redo across remote updates (treat remote updates as new history checkpoints)
- Network timeouts and retries (idempotent by correlationId)

## Feature flags

- enableIntegraphAdapter (use live endpoints vs. local stub)
- enableAcPreviewer (use acpreviewer-based renderer vs. built-in)
- enableProCode (expose JSON editor and property inspector)

## Success criteria (MVP)

- A user can generate a first Adaptive Card from a prompt and see it render
- A user can apply at least one continuation and see the card update
- A user can select any element and edit one or two key properties (e.g., text, spacing)
- A user can toggle pro-code, safely edit JSON, and recover from invalid edits
- Basic review-approve flow returns a nextStep
- Telemetry includes `correlationId` for each backend call (local only)
