# Catalyst UI Components

This directory should contain the Catalyst UI components from your Tailwind UI account.

## Setup Instructions

1. Download the Catalyst components from https://tailwindcss.com/plus
2. Copy the following components to this directory:
   - Button.tsx
   - Input.tsx
   - TextField.tsx
   - Textarea.tsx
   - Select.tsx
   - Dialog.tsx
   - Card.tsx
   - Badge.tsx
   - Avatar.tsx
   - Container.tsx
   - Sidebar.tsx
   - Header.tsx
   - Form.tsx
   - Field.tsx
   - Label.tsx
   - ErrorMessage.tsx

## Component Structure

The Catalyst components should follow this pattern:
```typescript
import { clsx } from 'clsx'

export function ComponentName({ className, ...props }) {
  return (
    <element
      className={clsx(
        'base-styles',
        className
      )}
      {...props}
    />
  )
}
```

## Usage

These components will be used throughout the jottr.io platform for consistent UI/UX.