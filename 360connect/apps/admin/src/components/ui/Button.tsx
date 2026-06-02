import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none' },
  secondary: { backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', border: 'none' },
  ghost: { backgroundColor: 'transparent', color: 'var(--text-secondary)', border: 'none' },
  danger: { backgroundColor: 'var(--accent-red)', color: 'white', border: 'none' },
  outline: { backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled,
  className,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0',
        sizeClasses[size],
        className
      )}
      style={{ ...variantStyles[variant], ...style }}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  )
}
