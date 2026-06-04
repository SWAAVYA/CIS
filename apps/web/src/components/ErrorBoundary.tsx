import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    return { hasError: true, message }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-8">
          <div className="p-4 max-w-md" style={{ background: '#7a303022', border: '1px solid var(--red-dim)' }}>
            <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--red)' }}>
              Something went wrong
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{this.state.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, message: '' })}
              className="mt-3 px-3 py-1.5 text-xs rounded font-mono"
              style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: '1px solid var(--border2)' }}
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
