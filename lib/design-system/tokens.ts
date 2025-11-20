/**
 * Modern Design Tokens for SAR School Management System
 * Professional color palette, gradients, shadows, and animations
 */
export const designTokens = {
  colors: {
    // Primary brand colors - SAR Red
    primary: {
      50: '#FEE2E2',
      100: '#FECACA',
      200: '#FCA5A5',
      300: '#F87171',
      400: '#EF4444',
      500: '#DC1E28',  // SAR Red
      600: '#B91C1C',
      700: '#991B1B',
      800: '#7F1D1D',
      900: '#6B1717',
      950: '#5A1414',
    },
    // Secondary colors - SAR Gold
    secondary: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FDD34D',
      400: '#FDB913',  // SAR Gold
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#5A2A0A',
    },
    // Success colors - SAR Gold (positive actions)
    success: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FDD34D',
      400: '#FDB913',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    // Warning colors - SAR Gold (attention)
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FDD34D',
      400: '#FDB913',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    // Error colors - SAR Red (danger)
    error: {
      50: '#FEE2E2',
      100: '#FECACA',
      200: '#FCA5A5',
      300: '#F87171',
      400: '#EF4444',
      500: '#DC1E28',
      600: '#B91C1C',
      700: '#991B1B',
      800: '#7F1D1D',
      900: '#6B1717',
    },
    // Gradient definitions - SAR Brand Colors
    gradients: {
      primary: 'linear-gradient(135deg, #DC1E28 0%, #B01820 100%)', // SAR Red
      success: 'linear-gradient(135deg, #FDB913 0%, #F5A623 100%)', // SAR Gold
      warning: 'linear-gradient(135deg, #FDB913 0%, #F5A623 100%)', // SAR Gold
      error: 'linear-gradient(135deg, #DC1E28 0%, #B01820 100%)', // SAR Red
      purple: 'linear-gradient(135deg, #DC1E28 0%, #B01820 100%)', // SAR Red
      blue: 'linear-gradient(135deg, #DC1E28 0%, #B01820 100%)', // SAR Red
      green: 'linear-gradient(135deg, #FDB913 0%, #F5A623 100%)', // SAR Gold
      orange: 'linear-gradient(135deg, #FDB913 0%, #F5A623 100%)', // SAR Gold
      pink: 'linear-gradient(135deg, #DC1E28 0%, #FDB913 100%)', // SAR Red to Gold
      dark: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
      // Glassmorphism gradients
      glass: {
        light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        dark: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
      }
    }
  },
  shadows: {
    // Subtle shadows
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    // Colored shadows
    glow: {
      primary: '0 0 20px rgb(14 165 233 / 0.5)',
      success: '0 0 20px rgb(34 197 94 / 0.5)',
      warning: '0 0 20px rgb(245 158 11 / 0.5)',
      error: '0 0 20px rgb(239 68 68 / 0.5)',
    },
    // Elevation shadows
    elevation: {
      1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
      3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
      4: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
      5: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
    }
  },
  animations: {
    durations: {
      fastest: '100ms',
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slowest: '500ms',
    },
    easings: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    },
    // Framer Motion variants
    variants: {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      },
      slideDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
      },
      slideLeft: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
      },
      slideRight: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
      },
      scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
      },
      scaleUp: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.1 }
      }
    }
  },
  typography: {
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    fontWeights: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeights: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    }
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  }
} as const;

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type ColorScale = keyof typeof designTokens.colors.primary;
export type ShadowSize = keyof typeof designTokens.shadows;
export type AnimationDuration = keyof typeof designTokens.animations.durations;
export type AnimationEasing = keyof typeof designTokens.animations.easings;
