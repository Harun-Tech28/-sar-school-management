// Design System - Spacing Tokens
// Consistent spacing scale for margins, padding, and gaps

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
  36: '9rem',     // 144px
  40: '10rem',    // 160px
  44: '11rem',    // 176px
  48: '12rem',    // 192px
  52: '13rem',    // 208px
  56: '14rem',    // 224px
  60: '15rem',    // 240px
  64: '16rem',    // 256px
  72: '18rem',    // 288px
  80: '20rem',    // 320px
  96: '24rem',    // 384px
} as const;

// Common spacing patterns
export const spacingPatterns = {
  // Component spacing
  componentGap: spacing[4],      // Gap between components
  sectionGap: spacing[8],        // Gap between sections
  pageGap: spacing[12],          // Gap between page sections

  // Card spacing
  cardPadding: spacing[6],       // Padding inside cards
  cardGap: spacing[4],           // Gap between card elements

  // Form spacing
  formFieldGap: spacing[4],      // Gap between form fields
  formSectionGap: spacing[8],    // Gap between form sections
  labelGap: spacing[2],          // Gap between label and input

  // Button spacing
  buttonPaddingX: spacing[4],    // Horizontal padding
  buttonPaddingY: spacing[2],    // Vertical padding
  buttonGap: spacing[2],         // Gap between button elements

  // Table spacing
  tableCellPadding: spacing[4],  // Padding in table cells
  tableRowGap: spacing[2],       // Gap between table rows

  // Layout spacing
  containerPadding: spacing[6],  // Container padding
  sidebarWidth: spacing[64],     // Sidebar width
  headerHeight: spacing[16],     // Header height
} as const;

// Helper function to get spacing value
export const getSpacing = (key: keyof typeof spacing) => {
  return spacing[key];
};

// Helper function to get multiple spacing values
export const getSpacingValues = (...keys: (keyof typeof spacing)[]) => {
  return keys.map(key => spacing[key]).join(' ');
};

// Responsive spacing utilities
export const responsiveSpacing = {
  // Mobile-first responsive padding
  containerPaddingResponsive: 'px-4 sm:px-6 lg:px-8',
  sectionPaddingResponsive: 'py-8 sm:py-12 lg:py-16',
  
  // Responsive gaps
  gridGapResponsive: 'gap-4 sm:gap-6 lg:gap-8',
  flexGapResponsive: 'gap-2 sm:gap-4 lg:gap-6',
} as const;
