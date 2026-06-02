import { ReactNode } from 'react'
import { TableProperties } from 'lucide-react'

interface Column<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

function LoadingSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div
                className="h-4 rounded animate-pulse"
                style={{ backgroundColor: 'var(--bg-hover)', width: `${60 + Math.random() * 40}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-xs font-medium px-5 py-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingSkeleton cols={columns.length} />
          ) : data.length === 0 ? null : (
            data.map((row, i) => (
              <tr
                key={i}
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
                className={`transition-colors hover:bg-[var(--bg-hover)] ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4">
                    {col.render
                      ? col.render(row)
                      : (
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          {String(row[col.key] ?? '')}
                        </span>
                      )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!loading && data.length === 0 && (
        <div className="py-16 text-center">
          <TableProperties size={40} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--text-secondary)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{emptyMessage}</p>
        </div>
      )}
    </div>
  )
}
