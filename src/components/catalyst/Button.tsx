import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

const baseStyles = {
  solid: clsx(
    'inline-flex items-center justify-center rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
  ),
  outline: clsx(
    'inline-flex items-center justify-center rounded-md px-3.5 py-2.5 text-sm font-semibold',
    'ring-1 ring-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
  ),
  ghost: clsx(
    'inline-flex items-center justify-center rounded-md px-3.5 py-2.5 text-sm font-semibold',
    'hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
  ),
}

const variantStyles = {
  solid: {
    indigo: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
    gray: 'bg-gray-600 text-white hover:bg-gray-500 focus-visible:outline-gray-600',
    red: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600',
    white: 'bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white',
  },
  outline: {
    gray: 'ring-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:outline-gray-600',
    indigo: 'ring-indigo-600 text-indigo-600 hover:bg-indigo-50 focus-visible:outline-indigo-600',
  },
  ghost: {
    gray: 'text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-600',
  },
}

type ButtonProps = {
  variant?: keyof typeof baseStyles
  color?: string
  className?: string
  href?: string
  to?: string
} & (
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
)

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant = 'solid', color = 'indigo', className, href, to, ...props },
  ref
) {
  className = clsx(
    baseStyles[variant],
    variantStyles[variant]?.[color as keyof typeof variantStyles[typeof variant]],
    className
  )

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={className}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    )
  }

  if (to) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        className={className}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={className}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  )
})