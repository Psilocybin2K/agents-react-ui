import { tokens } from '@fluentui/react-components';

// Typography Scale System
export const typography = {
  // Font Sizes - Based on Fluent UI tokens with enhancements
  fontSize: {
    xs: tokens.fontSizeBase100,    // 10px - Captions, labels
    sm: tokens.fontSizeBase200,    // 12px - Small text, metadata
    base: tokens.fontSizeBase300,  // 14px - Body text
    lg: tokens.fontSizeBase400,    // 16px - Large body text
    xl: tokens.fontSizeBase500,    // 20px - Subheadings
    '2xl': tokens.fontSizeBase600, // 24px - Headings
    '3xl': tokens.fontSizeBase700, // 28px - Large headings
    '4xl': tokens.fontSizeBase800, // 32px - Page titles
    '5xl': tokens.fontSizeBase900, // 40px - Hero text
  },

  // Font Weights - Enhanced weight system
  fontWeight: {
    light: tokens.fontWeightThin,      // 100
    normal: tokens.fontWeightRegular,  // 400
    medium: tokens.fontWeightMedium,   // 500
    semibold: tokens.fontWeightSemibold, // 600
    bold: tokens.fontWeightBold,       // 700
    extrabold: tokens.fontWeightHeavy, // 900
  },

  // Line Heights - Optimized for readability
  lineHeight: {
    tight: '1.2',      // Headings, short text
    normal: '1.4',     // Body text, general content
    relaxed: '1.6',    // Long-form content, descriptions
    loose: '1.8',      // Large text blocks, articles
  },

  // Letter Spacing - For improved legibility
  letterSpacing: {
    tight: '-0.025em',   // Headings, compact text
    normal: '0em',       // Body text, default
    wide: '0.025em',     // Small text, labels
    wider: '0.05em',     // All caps, navigation
    widest: '0.1em',     // Special cases, emphasis
  },

  // Font Family - Consistent font stack
  fontFamily: {
    sans: '"Segoe UI", "Helvetica Neue", "Arial", sans-serif',
    mono: '"Cascadia Code", "Consolas", "Monaco", monospace',
  },
};

// Typography Presets for Common Use Cases
export const textStyles = {
  // Heading Styles
  h1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: '24px',
  },
  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: '20px',
  },
  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: '16px',
  },
  h4: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
    marginBottom: '12px',
  },
  h5: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
    marginBottom: '8px',
  },
  h6: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
    marginBottom: '8px',
  },

  // Body Text Styles
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
  },

  // Specialized Text Styles
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
  },
  code: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
    fontFamily: typography.fontFamily.mono,
  },
  link: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
    textDecoration: 'underline',
  },
};

// Spacing System
export const spacing = {
  // Base spacing unit (4px)
  unit: 4,
  
  // Spacing scale
  xs: '4px',    // 1 unit
  sm: '8px',    // 2 units
  md: '12px',   // 3 units
  lg: '16px',   // 4 units
  xl: '20px',   // 5 units
  '2xl': '24px', // 6 units
  '3xl': '32px', // 8 units
  '4xl': '40px', // 10 units
  '5xl': '48px', // 12 units
  '6xl': '64px', // 16 units

  // Component-specific spacing
  component: {
    padding: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '24px',
    },
    margin: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '24px',
    },
    gap: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '24px',
    },
  },

  // Layout spacing
  layout: {
    section: '32px',
    container: '24px',
    card: '16px',
    form: '20px',
    navigation: '12px',
  },
};

// Utility functions for typography
export const getTextStyle = (styleName) => {
  return textStyles[styleName] || textStyles.body;
};

export const getSpacing = (size) => {
  return spacing[size] || spacing.md;
};

// CSS custom properties for typography
export const typographyCSS = `
  :root {
    /* Font Sizes */
    --font-size-xs: ${typography.fontSize.xs};
    --font-size-sm: ${typography.fontSize.sm};
    --font-size-base: ${typography.fontSize.base};
    --font-size-lg: ${typography.fontSize.lg};
    --font-size-xl: ${typography.fontSize.xl};
    --font-size-2xl: ${typography.fontSize['2xl']};
    --font-size-3xl: ${typography.fontSize['3xl']};
    --font-size-4xl: ${typography.fontSize['4xl']};
    --font-size-5xl: ${typography.fontSize['5xl']};

    /* Font Weights */
    --font-weight-light: ${typography.fontWeight.light};
    --font-weight-normal: ${typography.fontWeight.normal};
    --font-weight-medium: ${typography.fontWeight.medium};
    --font-weight-semibold: ${typography.fontWeight.semibold};
    --font-weight-bold: ${typography.fontWeight.bold};
    --font-weight-extrabold: ${typography.fontWeight.extrabold};

    /* Line Heights */
    --line-height-tight: ${typography.lineHeight.tight};
    --line-height-normal: ${typography.lineHeight.normal};
    --line-height-relaxed: ${typography.lineHeight.relaxed};
    --line-height-loose: ${typography.lineHeight.loose};

    /* Letter Spacing */
    --letter-spacing-tight: ${typography.letterSpacing.tight};
    --letter-spacing-normal: ${typography.letterSpacing.normal};
    --letter-spacing-wide: ${typography.letterSpacing.wide};
    --letter-spacing-wider: ${typography.letterSpacing.wider};
    --letter-spacing-widest: ${typography.letterSpacing.widest};

    /* Spacing */
    --spacing-xs: ${spacing.xs};
    --spacing-sm: ${spacing.sm};
    --spacing-md: ${spacing.md};
    --spacing-lg: ${spacing.lg};
    --spacing-xl: ${spacing.xl};
    --spacing-2xl: ${spacing['2xl']};
    --spacing-3xl: ${spacing['3xl']};
    --spacing-4xl: ${spacing['4xl']};
    --spacing-5xl: ${spacing['5xl']};
    --spacing-6xl: ${spacing['6xl']};
  }
`;
