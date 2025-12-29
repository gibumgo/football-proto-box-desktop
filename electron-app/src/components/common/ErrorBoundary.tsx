import { Component, type ErrorInfo, type ReactNode } from 'react';
import { NEON_THEME } from '@/domain/design/designTokens';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '24px',
                    color: NEON_THEME.colors.status.error,
                    backgroundColor: NEON_THEME.colors.bg.app,
                    height: '100%',
                    width: '100%',
                    overflow: 'auto',
                    fontFamily: 'monospace'
                }}>
                    <h2>Something went wrong.</h2>
                    {this.state.error && (
                        <div style={{ marginTop: '16px', whiteSpace: 'pre-wrap' }}>
                            <strong>Error:</strong> {this.state.error.toString()}
                        </div>
                    )}
                    {this.state.errorInfo && (
                        <div style={{ marginTop: '16px', whiteSpace: 'pre-wrap', fontSize: '12px', opacity: 0.8 }}>
                            <strong>Stack:</strong>
                            {this.state.errorInfo.componentStack}
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
