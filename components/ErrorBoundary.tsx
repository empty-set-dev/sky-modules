import React, { ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback: ReactNode
}
interface ErrorBoundaryState {
    hasError: boolean
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true }
    }

    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        errorConsole(error, info)
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return this.props.fallback
        }

        return this.props.children
    }
}

export default ErrorBoundary
