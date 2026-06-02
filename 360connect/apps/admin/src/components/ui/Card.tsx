import { ReactNode, CSSProperties } from 'react'
import { cn } from './cn'

type CardPadding = 'sm' | 'md' | 'lg'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: CardPadding
  hover?: boolean
  style?: CSSProperties
}

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({ children, className, padding = 'md', hover = false, style }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border',
        paddingClasses[padding],
        hover && 'transition-all hover:border-[var(--accent-blue)]',
        className
      )}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-card)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
