// Design System - Color Tokens
// Extended color palette with semantic tokens for the SAR system

export const colors = {
  // SAR Brand Colors (Primary Red)
  primary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Main SAR red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Semantic Colors
  success: {
    light: '#d1fae5',
    DEFAULT: '#10b981',
    dark: '#065f46',
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#92400e',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#991b1b',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#1e40af',
  },

  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },

  // Border Colors
  border: {
    light: '#e5e7eb',
    DEFAULT: '#d1d5db',
    dark: '#9ca3af',
  },
} as const;

// Color utility functions
export const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info' | 'neutral') => {
  switch (status) {
    case 'success':
      return colors.success.DEFAULT;
    case 'warning':
      return colors.warning.DEFAULT;
    case 'error':
      return colors.error.DEFAULT;
    case 'info':
      return colors.info.DEFAULT;
    case 'neutral':
    default:
      return colors.gray[500];
  }
};

export const getStatusColorClass = (status: 'success' | 'warning' | 'error' | 'info' | 'neutral') => {
  switch (status) {
    case 'success':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'error':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'info':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'neutral':
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};
