// Design System - Typography Tokens
// Typography scale and utilities for consistent text styling

export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
  },

  // Font Sizes with line heights
  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' },      // 12px
    sm: { size: '0.875rem', lineHeight: '1.25rem' },  // 14px
    base: { size: '1rem', lineHeight: '1.5rem' },     // 16px
    lg: { size: '1.125rem', lineHeight: '1.75rem' },  // 18px
    xl: { size: '1.25rem', lineHeight: '1.75rem' },   // 20px
    '2xl': { size: '1.5rem', lineHeight: '2rem' },    // 24px
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' }, // 30px
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' }, // 36px
    '5xl': { size: '3rem', lineHeight: '1' },         // 48px
  },

  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Typography utility classes
export const typographyClasses = {
  // Headings
  h1: 'text-4xl font-bold text-gray-900 tracking-tight',
  h2: 'text-3xl font-bold text-gray-900 tracking-tight',
  h3: 'text-2xl font-semibold text-gray-900',
  h4: 'text-xl font-semibold text-gray-900',
  h5: 'text-lg font-semibold text-gray-900',
  h6: 'text-base font-semibold text-gray-900',

  // Body text
  body: 'text-base text-gray-700',
  bodyLarge: 'text-lg text-gray-700',
  bodySmall: 'text-sm text-gray-600',

  // Labels
  label: 'text-sm font-medium text-gray-700',
  labelSmall: 'text-xs font-medium text-gray-600',

  // Captions
  caption: 'text-xs text-gray-500',
  captionBold: 'text-xs font-semibold text-gray-600',

  // Links
  link: 'text-red-600 hover:text-red-700 underline cursor-pointer',
  linkSubtle: 'text-gray-600 hover:text-gray-900 cursor-pointer',

  // Code
  code: 'font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded',
  codeBlock: 'font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-lg',
} as const;

// Helper function to get font size CSS
export const getFontSize = (size: keyof typeof typography.fontSize) => {
  const { size: fontSize, lineHeight } = typography.fontSize[size];
  return {
    fontSize,
    lineHeight,
  };
};

// Helper function to get typography class
export const getTypographyClass = (variant: keyof typeof typographyClasses) => {
  return typographyClasses[variant];
};
