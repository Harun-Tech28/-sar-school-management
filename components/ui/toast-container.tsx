'use client';

import React from 'react';
import { Toast, ToastProps } from './toast';

interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onDismiss'>[];
  onDismiss: (id: string) => void;
  maxVisible?: number;
}

export function ToastContainer({
  toasts,
  onDismiss,
  maxVisible = 3,
}: ToastContainerProps) {
  // Show only the most recent toasts up to maxVisible
  const visibleToasts = toasts.slice(-maxVisible);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <Toast {...toast} onDismiss={onDismiss} />
        </div>
      ))}

      {/* Hidden announcer for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {toasts.length > 0 &&
          `${toasts[toasts.length - 1].title}${
            toasts[toasts.length - 1].message
              ? `: ${toasts[toasts.length - 1].message}`
              : ''
          }`}
      </div>
    </div>
  );
}
