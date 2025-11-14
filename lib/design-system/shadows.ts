// Design System - Shadow Tokens
// Consistent shadow definitions for depth and elevation

export const shadows = {
  // Standard shadows
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Inner shadow
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Colored shadows (for emphasis)
  primarySm: '0 1px 2px 0 rgba(239, 68, 68, 0.1)',
  primary: '0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)',
  primaryLg: '0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',

  // Focus shadows
  focusRing: '0 0 0 3px rgba(239, 68, 68, 0.1)',
  focusRingOffset: '0 0 0 2px white, 0 0 0 4px rgba(239, 68, 68, 0.5)',
} as const;

// Shadow utility classes
export const shadowClasses = {
  // Card shadows
  card: 'shadow-md hover:shadow-lg transition-shadow duration-200',
  cardInteractive: 'shadow-sm hover:shadow-md active:shadow-sm transition-shadow duration-150',
  cardElevated: 'shadow-lg hover:shadow-xl transition-shadow duration-200',

  // Button shadows
  button: 'shadow-sm hover:shadow-md active:shadow-sm transition-shadow duration-150',
  buttonPrimary: 'shadow-sm hover:shadow-md active:shadow-sm transition-all duration-150',

  // Modal/Dialog shadows
  modal: 'shadow-2xl',
  dropdown: 'shadow-lg',
  popover: 'shadow-md',

  // Input shadows
  input: 'shadow-sm focus:shadow-md transition-shadow duration-150',
  inputFocus: 'shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',

  // Floating elements
  floating: 'shadow-xl',
  floatingHigh: 'shadow-2xl',
} as const;

// Helper function to get shadow value
export const getShadow = (key: keyof typeof shadows) => {
  return shadows[key];
};

// Helper function to get shadow class
export const getShadowClass = (variant: keyof typeof shadowClasses) => {
  return shadowClasses[variant];
};

// Elevation levels (semantic naming)
export const elevation = {
  flat: shadows.none,
  raised: shadows.sm,
  floating: shadows.md,
  overlay: shadows.lg,
  modal: shadows.xl,
  popover: shadows['2xl'],
} as const;
