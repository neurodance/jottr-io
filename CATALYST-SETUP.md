# Catalyst UI Setup for Jottr.io

## Installation Steps

1. **Access Catalyst from your Tailwind UI account:**
   - Go to https://tailwindcss.com/plus
   - Navigate to the Catalyst section
   - Download the Catalyst components package

2. **Install Catalyst dependencies:**
   ```bash
   npm install @headlessui/react clsx
   ```

3. **Copy Catalyst components:**
   - Extract the Catalyst components to `src/components/catalyst/`
   - The main components we'll use:
     - Button
     - Input/TextField
     - Dialog/Modal
     - Card
     - Navigation
     - Forms
     - Layout components

4. **Component Structure:**
   ```
   src/
     components/
       catalyst/        # Catalyst UI components (from Tailwind UI)
         Button.tsx
         Input.tsx
         Dialog.tsx
         Card.tsx
         ...
       jottr/          # Our custom components
         Editor.tsx
         JottCard.tsx
         Dashboard.tsx
   ```

## Required Catalyst Components

For the Jottr.io platform, we'll need:

### Core Components:
- **Button** - Primary actions
- **Input/TextField** - Forms
- **Textarea** - Content editing
- **Select** - Dropdowns
- **Dialog** - Modals
- **Card** - Content containers
- **Badge** - Status indicators
- **Avatar** - User profiles

### Layout Components:
- **Container** - Page wrapper
- **Sidebar** - Navigation
- **Header** - Top navigation
- **Stack/Grid** - Layout utilities

### Form Components:
- **Form** - Form wrapper
- **Field** - Form fields
- **Label** - Field labels
- **ErrorMessage** - Validation

## Alternative Approach (If Catalyst not available)

If you haven't downloaded Catalyst yet, we can use Headless UI + custom Tailwind components:

```bash
npm install @headlessui/react @heroicons/react
```

Then we'll build Catalyst-style components ourselves.