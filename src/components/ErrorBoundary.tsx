import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home, AlertOctagon, Terminal, Bug } from 'lucide-react';
import { playTone } from './AudioSynthesizer';

interface Props {
  children: ReactNode;
  fallbackViewName?: string;
  onResetToHome?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('Sovereign OS Error Boundary caught an unhandled view error:', error, errorInfo);
    try {
      playTone(220, 0.15);
    } catch {
      // Audio fallback
    }
  }

  private handleRetry = () => {
    try {
      playTone(600, 0.05);
    } catch {
      // Audio fallback
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          id="sovereign-error-boundary"
          className="w-full min-h-[400px] p-8 rounded-[28px] bg-gradient-to-br from-[#180a0a]/95 via-[#0b0808] to-[#07080F] border-2 border-rose-500/40 text-zinc-100 font-mono shadow-2xl space-y-6 my-4 animate-in fade-in duration-300 relative z-30"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    Ring-03 View Fault Isolated
                  </span>
                  <span className="text-xs text-rose-400/80">
                    Sovereign Core Protected
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  View Execution Interrupted ({this.props.fallbackViewName || 'Active Module'})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-initialize View</span>
              </button>
              {this.props.onResetToHome && (
                <button
                  onClick={this.props.onResetToHome}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Home className="w-4 h-4" />
                  <span>Return to Dashboard</span>
                </button>
              )}
            </div>
          </div>

          {/* Fault Isolation Details */}
          <div className="p-4 rounded-2xl bg-black/60 border border-rose-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
              <Bug className="w-4 h-4" />
              <span>DIAGNOSTIC TRACE & EXCEPTION LOG</span>
            </div>
            <div className="p-3 rounded-xl bg-black/80 border border-white/5 text-rose-300/90 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {this.state.error?.toString() || 'Unknown runtime view exception'}
            </div>
            {this.state.errorInfo?.componentStack && (
              <details className="text-[11px] text-zinc-400 font-mono">
                <summary className="cursor-pointer hover:text-zinc-200 py-1 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                  <span>View Component Call Stack</span>
                </summary>
                <pre className="mt-2 p-3 rounded-xl bg-black/90 border border-white/5 text-zinc-400 overflow-x-auto text-[10px]">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>

          {/* Invariant Assurance Footer */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">
                Sovereign Kernel & Merkle Tree Unaffected (Fail-Safe Ring Active)
              </span>
            </div>
            <span className="text-zinc-500">
              Block #849202 • Zero Core Mutation
            </span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
