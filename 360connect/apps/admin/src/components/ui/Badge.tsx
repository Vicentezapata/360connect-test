import { ReactNode } from 'react'

type BadgeVariant = 'blue' | 'green' | 'orange' | 'red' | 'gray' | 'purple' | 'yellow'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  blue: { bg: 'var(--accent-blue)', color: 'var(--accent-blue)' },
  green: { bg: 'var(--accent-green)', color: 'var(--accent-green)' },
  orange: { bg: 'var(--accent-orange)', color: 'var(--accent-orange)' },
  red: { bg: 'var(--accent-red)', color: 'var(--accent-red)' },
  gray: { bg: 'var(--text-secondary)', color: 'var(--text-secondary)' },
  purple: { bg: 'var(--status-standby)', color: 'var(--status-standby)' },
  yellow: { bg: 'var(--status-maintenance)', color: 'var(--status-maintenance)' },
}

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  const { bg, color } = variantStyles[variant]
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium ${className ?? ''}`}
      style={{ backgroundColor: bg + '22', color }}
    >
      {children}
    </span>
  )
}
