import { InputHTMLAttributes, ReactNode, useState } from 'react'
import { cn } from './cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export function Input({ label, error, icon, className, id, ...props }: InputProps) {
  const [focused, setFocused] = useState(false)
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
          className={cn(
            'w-full h-10 rounded-lg border text-sm outline-none transition-all',
            icon ? 'pl-9 pr-3' : 'px-3',
            className
          )}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: error ? 'var(--accent-red)' : focused ? 'var(--accent-blue)' : 'var(--border)',
            color: 'var(--text-primary)',
            boxShadow: focused ? '0 0 0 2px var(--accent-blue)33' : 'none',
          }}
        />
      </div>
      {error && (
        <p className="text-xs" style={{ color: 'var(--accent-red)' }}>{error}</p>
      )}
    </div>
  )
}
