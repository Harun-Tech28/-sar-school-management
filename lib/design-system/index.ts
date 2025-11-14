// Design System - Main Export
// Central export for all design system tokens and utilities

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './transitions';
export * from './animations';

// Re-export commonly used utilities
export { colors, getStatusColor, getStatusColorClass } from './colors';
export { typography, typographyClasses, getFontSize, getTypographyClass } from './typography';
export { spacing, spacingPatterns, getSpacing, responsiveSpacing } from './spacing';
export { shadows, shadowClasses, getShadow, getShadowClass, elevation } from './shadows';
export { transitions, transitionClasses, createTransition, getTransitionClass } from './transitions';
export { animations, microInteractions, getAnimationClass, getMicroInteractionClass } from './animations';
