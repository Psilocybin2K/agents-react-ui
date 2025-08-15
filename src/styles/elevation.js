import { shadows } from './shadows';

// Z-index scale for consistent layering
export const zIndex = {
  base: 0,
  card: 1,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  tooltip: 500,
  toast: 600,
};

// Elevation levels with corresponding shadows and z-index
export const elevationLevels = {
  level0: {
    shadow: 'none',
    zIndex: zIndex.base,
  },
  level1: {
    shadow: shadows.subtle.xs,
    zIndex: zIndex.card,
  },
  level2: {
    shadow: shadows.subtle.sm,
    zIndex: zIndex.card,
  },
  level3: {
    shadow: shadows.subtle.md,
    zIndex: zIndex.card,
  },
  level4: {
    shadow: shadows.subtle.lg,
    zIndex: zIndex.dropdown,
  },
  level5: {
    shadow: shadows.subtle.xl,
    zIndex: zIndex.overlay,
  },
};

// Component-specific elevation presets
export const componentElevation = {
  // Basic components
  card: elevationLevels.level1,
  button: elevationLevels.level1,
  input: elevationLevels.level1,
  
  // Interactive components
  buttonHover: {
    shadow: shadows.interactive.hover,
    zIndex: zIndex.card,
  },
  buttonPressed: {
    shadow: shadows.interactive.pressed,
    zIndex: zIndex.card,
  },
  
  // Navigation components
  sidebar: elevationLevels.level2,
  header: elevationLevels.level1,
  navigation: elevationLevels.level2,
  
  // Content components
  message: elevationLevels.level1,
  infoCard: elevationLevels.level2,
  successCard: elevationLevels.level1,
  
  // Overlay components
  modal: {
    shadow: shadows.overlay.modal,
    zIndex: zIndex.modal,
  },
  dropdown: {
    shadow: shadows.overlay.dropdown,
    zIndex: zIndex.dropdown,
  },
  tooltip: {
    shadow: shadows.overlay.tooltip,
    zIndex: zIndex.tooltip,
  },
  
  // Brand elements
  brand: {
    shadow: shadows.brand.md,
    zIndex: zIndex.card,
  },
  brandHover: {
    shadow: shadows.brand.lg,
    zIndex: zIndex.card,
  },
};

// Utility function to get elevation for a component
export const getElevation = (component, state = 'default') => {
  const elevation = componentElevation[component];
  
  if (!elevation) {
    return elevationLevels.level1;
  }
  
  if (state === 'hover' && componentElevation[`${component}Hover`]) {
    return componentElevation[`${component}Hover`];
  }
  
  if (state === 'pressed' && componentElevation[`${component}Pressed`]) {
    return componentElevation[`${component}Pressed`];
  }
  
  return elevation;
};

// CSS custom properties for elevation
export const elevationCSS = `
  :root {
    --elevation-level0: none;
    --elevation-level1: ${elevationLevels.level1.shadow};
    --elevation-level2: ${elevationLevels.level2.shadow};
    --elevation-level3: ${elevationLevels.level3.shadow};
    --elevation-level4: ${elevationLevels.level4.shadow};
    --elevation-level5: ${elevationLevels.level5.shadow};
    
    --z-index-base: ${zIndex.base};
    --z-index-card: ${zIndex.card};
    --z-index-dropdown: ${zIndex.dropdown};
    --z-index-sticky: ${zIndex.sticky};
    --z-index-overlay: ${zIndex.overlay};
    --z-index-modal: ${zIndex.modal};
    --z-index-tooltip: ${zIndex.tooltip};
    --z-index-toast: ${zIndex.toast};
  }
`;
