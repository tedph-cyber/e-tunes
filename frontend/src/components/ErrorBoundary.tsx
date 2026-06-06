"use client"
import { Component } from "react"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
          <p className="text-red-400 font-semibold">Something went wrong</p>
          <p className="text-red-300 text-sm mt-1">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white text-sm"
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
