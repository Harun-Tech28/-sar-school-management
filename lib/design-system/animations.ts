// Design System - Animation Utilities
// Reusable animation keyframes and utilities

// Animation keyframes (to be added to globals.css)
export const animationKeyframes = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(20px);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes badgePulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
`;

// Animation classes
export const animations = {
  // Fade animations
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',

  // Slide animations
  slideUp: 'animate-slideUp',
  slideDown: 'animate-slideDown',
  slideInRight: 'animate-slideInRight',
  slideOutRight: 'animate-slideOutRight',

  // Scale animations
  scaleIn: 'animate-scaleIn',
  scaleOut: 'animate-scaleOut',

  // Loading animations
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',

  // Skeleton animations
  shimmer: 'animate-shimmer',
  wave: 'animate-wave',

  // Badge animations
  badgePulse: 'animate-badgePulse',
} as const;

// Animation duration classes
export const animationDurations = {
  fast: 'duration-150',
  normal: 'duration-250',
  slow: 'duration-400',
  slower: 'duration-600',
} as const;

// Animation timing function classes
export const animationTimings = {
  linear: 'ease-linear',
  in: 'ease-in',
  out: 'ease-out',
  inOut: 'ease-in-out',
} as const;

// Helper function to combine animation classes
export const getAnimationClass = (
  animation: keyof typeof animations,
  duration: keyof typeof animationDurations = 'normal',
  timing: keyof typeof animationTimings = 'inOut'
) => {
  return `${animations[animation]} ${animationDurations[duration]} ${animationTimings[timing]}`;
};

// Micro-interaction utilities
export const microInteractions = {
  // Hover effects
  hoverScale: 'hover:scale-105 transition-transform duration-150 ease-out',
  hoverScaleSmall: 'hover:scale-102 transition-transform duration-150 ease-out',
  hoverLift: 'hover:-translate-y-1 transition-transform duration-150 ease-out',
  hoverGlow: 'hover:shadow-lg transition-shadow duration-200 ease-out',

  // Active/Press effects
  pressScale: 'active:scale-95 transition-transform duration-100 ease-out',
  pressDown: 'active:translate-y-0.5 transition-transform duration-100 ease-out',

  // Focus effects
  focusRing: 'focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 focus:outline-none transition-all duration-150',
  focusGlow: 'focus:shadow-lg focus:shadow-red-500/20 focus:outline-none transition-all duration-150',

  // Loading states
  loadingPulse: 'animate-pulse',
  loadingSpin: 'animate-spin',

  // Disabled states
  disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
} as const;

// Helper function to get micro-interaction class
export const getMicroInteractionClass = (variant: keyof typeof microInteractions) => {
  return microInteractions[variant];
};

// Stagger animation helper
export const staggerAnimation = (index: number, baseDelay: number = 50) => {
  return {
    animationDelay: `${index * baseDelay}ms`,
  };
};

// Reduced motion support
export const respectReducedMotion = (animationClass: string) => {
  return `motion-safe:${animationClass}`;
};
