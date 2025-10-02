export const theme = {
  text: {
    size: {
      small: 'text-sm',
      default: 'text-base',
      large: 'text-lg',
    },
    weight: {
      normal: '',
      bold: 'font-bold',
    },
    color: {
      default: 'text-inherit',
      accent: 'text-blue-600',
      good: 'text-green-600',
      warning: 'text-amber-600',
      attention: 'text-red-600',
    },
  },
  layout: {
    wrap: {
      on: 'whitespace-normal',
      off: 'whitespace-nowrap',
    },
    hAlign: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    },
    spacing: {
      none: 'space-y-0',
      small: 'space-y-1',
      default: 'space-y-2',
      medium: 'space-y-3',
      large: 'space-y-4',
      extraLarge: 'space-y-6',
      padding: 'space-y-4',
    },
  },
  input: 'border rounded p-2 text-sm w-full',
  button: 'px-3 py-1.5 rounded border text-sm hover:bg-gray-50',
}
