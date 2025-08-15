import { tokens } from '@fluentui/react-components';

// Enhanced shadow system for better visual depth
export const shadows = {
  // Subtle shadows for basic elevation
  subtle: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 6px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 12px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 24px rgba(0, 0, 0, 0.15)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.12), 0 8px 48px rgba(0, 0, 0, 0.18)',
  },
  
  // Colored shadows for brand elements
  brand: {
    sm: `0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 6px ${tokens.colorBrandStroke1}20`,
    md: `0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 12px ${tokens.colorBrandStroke1}30`,
    lg: `0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 24px ${tokens.colorBrandStroke1}40`,
  },
  
  // Interactive shadows for hover/focus states
  interactive: {
    hover: '0 6px 12px rgba(0, 0, 0, 0.12), 0 3px 18px rgba(0, 0, 0, 0.15)',
    focus: `0 0 0 2px ${tokens.colorBrandStroke1}, 0 4px 8px rgba(0, 0, 0, 0.1)`,
    pressed: '0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 6px rgba(0, 0, 0, 0.2)',
  },
  
  // Modal and overlay shadows
  overlay: {
    modal: '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 60px rgba(0, 0, 0, 0.2)',
    dropdown: '0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 24px rgba(0, 0, 0, 0.15)',
    tooltip: '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 12px rgba(0, 0, 0, 0.12)',
  },
  
  // Specialized shadows for specific components
  components: {
    card: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 12px rgba(0, 0, 0, 0.08)',
    button: '0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 6px rgba(0, 0, 0, 0.1)',
    input: '0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
    message: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 6px rgba(0, 0, 0, 0.08)',
  },
};

// Elevation levels for consistent depth hierarchy
export const elevation = {
  level0: 'none',
  level1: shadows.subtle.xs,
  level2: shadows.subtle.sm,
  level3: shadows.subtle.md,
  level4: shadows.subtle.lg,
  level5: shadows.subtle.xl,
};

// Dark mode shadow adjustments
export const darkShadows = {
  subtle: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 6px rgba(0, 0, 0, 0.4)',
    md: '0 4px 8px rgba(0, 0, 0, 0.35), 0 2px 12px rgba(0, 0, 0, 0.45)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.4), 0 4px 24px rgba(0, 0, 0, 0.5)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.45), 0 8px 48px rgba(0, 0, 0, 0.55)',
  },
  brand: {
    sm: `0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 6px ${tokens.colorBrandStroke1}40`,
    md: `0 4px 8px rgba(0, 0, 0, 0.35), 0 2px 12px ${tokens.colorBrandStroke1}50`,
    lg: `0 8px 16px rgba(0, 0, 0, 0.4), 0 4px 24px ${tokens.colorBrandStroke1}60`,
  },
};

// Utility function to get appropriate shadow based on theme
export const getShadow = (shadowType, level = 'md', isDark = false) => {
  const shadowSet = isDark ? darkShadows : shadows;
  return shadowSet[shadowType]?.[level] || shadowSet.subtle.md;
};
