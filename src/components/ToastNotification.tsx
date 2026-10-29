import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 flex items-center gap-2.5 rounded-2xl bg-neutral-900/95 dark:bg-neutral-800/95 text-white px-4 py-3 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md border border-neutral-700/60 max-w-[90vw] sm:max-w-md transition-all animate-in fade-in slide-in-from-bottom-4">
      {toast.type === 'success' && (
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
      )}
      {toast.type === 'error' && (
        <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
      )}
      {toast.type === 'info' && (
        <Info className="h-5 w-5 text-blue-400 shrink-0" />
      )}
      <span className="leading-snug">{toast.message}</span>
    </div>
  );
};
