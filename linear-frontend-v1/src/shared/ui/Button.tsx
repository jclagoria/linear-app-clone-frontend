import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'bg-surface border border-border text-text hover:bg-surface-alt active:bg-border',
  danger:
    'bg-danger text-white hover:bg-danger-hover active:bg-red-600',
  ghost:
    'bg-transparent text-text hover:bg-surface-alt active:bg-border',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs min-h-[32px] min-w-[32px]',
  md: 'px-4 py-2.5 text-sm min-h-[44px] min-w-[44px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      icon,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" className="text-current" />
        ) : icon ? (
          <span className="h-4 w-4">{icon}</span>
        ) : null}
        {children && <span>{children}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'
