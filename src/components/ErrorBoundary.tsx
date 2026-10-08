import React, { Component, ErrorInfo, ReactNode } from 'react';
import { safeStorage } from '../utils/storage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in RoktoBondhu app:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAndReload = () => {
    try {
      safeStorage.clear();
      // Clear all roktobondhu prefixed keys from localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.keys(window.localStorage)
          .filter(k => k.startsWith('roktobondhu_'))
          .forEach(k => window.localStorage.removeItem(k));
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 text-neutral-900 dark:text-neutral-100 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center text-3xl mb-4 shadow-sm">
              🩸
            </div>

            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              কিছু একটা সমস্যা হয়েছে
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
              অ্যাপ্লিকেশনটি লোড করার সময় একটি ত্রুটি ঘটেছে। নিচের বাটনে ক্লিক করে পেজটি রিফ্রেশ করুন অথবা প্রাথমিক ডাটা রিস্টোর করুন।
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                🔄 পেজটি রিলোড করুন
              </button>
              <button
                onClick={this.handleResetAndReload}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-xs text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                🧹 ক্যাশ ক্লিয়ার ও রিস্টোর
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer">
                  টেকনিক্যাল ত্রুটির বিবরণ (Technical Details)
                </summary>
                <pre className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-[10px] text-rose-600 dark:text-rose-400 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
