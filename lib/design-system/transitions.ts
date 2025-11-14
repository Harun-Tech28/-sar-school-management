// Design System - Transition Tokens
// Consistent timing functions and durations for animations

export const transitions = {
  // Duration values
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    slower: '600ms',
  },

  // Timing functions (easing)
  timing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Common transition combinations
  default: 'all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  fast: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  slow: 'all 400ms cubic-bezier(0.4, 0.0, 0.2, 1)',

  // Property-specific transitions
  color: 'color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  background: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  border: 'border-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  transform: 'transform 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  opacity: 'opacity 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  shadow: 'box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
} as const;

// Transition utility classes
export const transitionClasses = {
  // All properties
  all: 'transition-all duration-250 ease-in-out',
  allFast: 'transition-all duration-150 ease-in-out',
  allSlow: 'transition-all duration-400 ease-in-out',

  // Specific properties
  colors: 'transition-colors duration-150 ease-in-out',
  opacity: 'transition-opacity duration-250 ease-in-out',
  transform: 'transition-transform duration-250 ease-in-out',
  shadow: 'transition-shadow duration-200 ease-in-out',

  // Common combinations
  hover: 'transition-all duration-150 ease-in-out hover:scale-105',
  hoverShadow: 'transition-shadow duration-200 ease-in-out hover:shadow-lg',
  hoverColors: 'transition-colors duration-150 ease-in-out',

  // Interactive elements
  button: 'transition-all duration-150 ease-in-out active:scale-95',
  link: 'transition-colors duration-150 ease-in-out',
  input: 'transition-all duration-150 ease-in-out focus:ring-2',

  // Animations
  fadeIn: 'animate-fadeIn',
  slideUp: 'animate-slideUp',
  slideDown: 'animate-slideDown',
  scaleIn: 'animate-scaleIn',
} as const;

// Helper function to create custom transition
export const createTransition = (
  property: string | string[],
  duration: keyof typeof transitions.duration = 'normal',
  timing: keyof typeof transitions.timing = 'easeInOut'
) => {
  const props = Array.isArray(property) ? property.join(', ') : property;
  return `${props} ${transitions.duration[duration]} ${transitions.timing[timing]}`;
};

// Helper function to get transition class
export const getTransitionClass = (variant: keyof typeof transitionClasses) => {
  return transitionClasses[variant];
};

// Delay values for staggered animations
export const delays = {
  0: '0ms',
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
} as const;

// Helper for staggered animations
export const getStaggerDelay = (index: number, baseDelay: number = 50) => {
  return `${index * baseDelay}ms`;
};
