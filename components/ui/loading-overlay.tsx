import React from 'react';
import { Spinner } from './spinner';

export interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ message = 'Loading...', fullScreen = false }: LoadingOverlayProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 z-10';

  return (
    <div className={`${containerClasses} flex items-center justify-center bg-white/80 backdrop-blur-sm`}>
      <div className="flex flex-col items-center gap-4 p-6">
        <Spinner size="xl" color="primary" />
        {message && (
          <p className="text-sm font-medium text-gray-700 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
