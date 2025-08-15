import { tokens } from '@fluentui/react-components';

// Enhanced Color System with Accessibility Focus
export const colors = {
  // Brand Colors - Primary brand palette
  brand: {
    primary: tokens.colorBrandForeground1,
    secondary: tokens.colorBrandForeground2,
    tertiary: tokens.colorBrandForeground3,
    stroke: tokens.colorBrandStroke1,
    stroke2: tokens.colorBrandStroke2,
    background: tokens.colorBrandBackground,
    background2: tokens.colorBrandBackground2,
    background3: tokens.colorBrandBackground3,
    backgroundInverted: tokens.colorBrandBackgroundInverted,
    backgroundStatic: tokens.colorBrandBackgroundStatic,
    backgroundHover: tokens.colorBrandBackgroundHover,
    backgroundPressed: tokens.colorBrandBackgroundPressed,
    backgroundSelected: tokens.colorBrandBackgroundSelected,
  },

  // Semantic Colors - For status and feedback
  semantic: {
    success: {
      foreground: '#107C10',
      background: '#DFF6DD',
      border: '#107C10',
      hover: '#0B5A0B',
      pressed: '#0A4F0A',
    },
    warning: {
      foreground: '#D83B01',
      background: '#FFF4CE',
      border: '#D83B01',
      hover: '#B02E01',
      pressed: '#9A2801',
    },
    error: {
      foreground: '#D13438',
      background: '#FDE7E9',
      border: '#D13438',
      hover: '#A4262C',
      pressed: '#8F2226',
    },
    info: {
      foreground: '#0078D4',
      background: '#EFF6FC',
      border: '#0078D4',
      hover: '#106EBE',
      pressed: '#0E5DB3',
    },
  },

  // Neutral Colors - Enhanced for better contrast
  neutral: {
    // Background hierarchy
    background1: tokens.colorNeutralBackground1,
    background2: tokens.colorNeutralBackground2,
    background3: tokens.colorNeutralBackground3,
    background4: tokens.colorNeutralBackground4,
    background5: tokens.colorNeutralBackground5,
    background6: tokens.colorNeutralBackground6,
    
    // Foreground hierarchy
    foreground1: tokens.colorNeutralForeground1,
    foreground2: tokens.colorNeutralForeground2,
    foreground3: tokens.colorNeutralForeground3,
    foreground4: tokens.colorNeutralForeground4,
    foreground5: tokens.colorNeutralForeground5,
    foreground6: tokens.colorNeutralForeground6,
    
    // Stroke hierarchy
    stroke1: tokens.colorNeutralStroke1,
    stroke2: tokens.colorNeutralStroke2,
    stroke3: tokens.colorNeutralStroke3,
    stroke4: tokens.colorNeutralStroke4,
    stroke5: tokens.colorNeutralStroke5,
    stroke6: tokens.colorNeutralStroke6,
  },

  // Interactive Colors - For buttons and interactive elements
  interactive: {
    primary: {
      background: tokens.colorBrandBackground,
      foreground: tokens.colorBrandForeground1,
      border: tokens.colorBrandStroke1,
      hover: {
        background: tokens.colorBrandBackgroundHover,
        foreground: tokens.colorBrandForeground1,
        border: tokens.colorBrandStroke1,
      },
      pressed: {
        background: tokens.colorBrandBackgroundPressed,
        foreground: tokens.colorBrandForeground1,
        border: tokens.colorBrandStroke1,
      },
      disabled: {
        background: tokens.colorNeutralBackgroundDisabled,
        foreground: tokens.colorNeutralForegroundDisabled,
        border: tokens.colorNeutralStrokeDisabled,
      },
    },
    secondary: {
      background: 'transparent',
      foreground: tokens.colorNeutralForeground1,
      border: tokens.colorNeutralStroke1,
      hover: {
        background: tokens.colorNeutralBackground1Hover,
        foreground: tokens.colorNeutralForeground1,
        border: tokens.colorNeutralStroke1Hover,
      },
      pressed: {
        background: tokens.colorNeutralBackground1Pressed,
        foreground: tokens.colorNeutralForeground1,
        border: tokens.colorNeutralStroke1Pressed,
      },
      disabled: {
        background: 'transparent',
        foreground: tokens.colorNeutralForegroundDisabled,
        border: tokens.colorNeutralStrokeDisabled,
      },
    },
  },

  // Message Colors - For chat and notification messages
  message: {
    user: {
      background: tokens.colorNeutralBackground2,
      foreground: tokens.colorNeutralForeground1,
      border: tokens.colorNeutralStroke1,
    },
    ai: {
      background: '#EBF5FF',
      foreground: tokens.colorNeutralForeground1,
      border: '#B3D7F2',
    },
    system: {
      background: tokens.colorNeutralBackground3,
      foreground: tokens.colorNeutralForeground2,
      border: tokens.colorNeutralStroke2,
    },
  },

  // Status Colors - For various status indicators
  status: {
    online: '#107C10',
    offline: '#8A8A8A',
    away: '#D83B01',
    busy: '#D13438',
    available: '#107C10',
    unavailable: '#8A8A8A',
  },

  // Focus Colors - For accessibility
  focus: {
    primary: tokens.colorBrandStroke1,
    secondary: tokens.colorNeutralStroke1,
    outline: '2px solid',
    offset: '2px',
  },
};

// Contrast ratios for accessibility
export const contrastRatios = {
  // WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
  normal: 4.5,
  large: 3.0,
  // WCAG AAA compliance (7:1 for normal text, 4.5:1 for large text)
  normalAAA: 7.0,
  largeAAA: 4.5,
};

// Color utility functions
export const getContrastColor = (backgroundColor) => {
  // Simple contrast calculation - in production, use a proper color contrast library
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? colors.neutral.foreground1 : '#FFFFFF';
};

export const getSemanticColor = (type, variant = 'foreground') => {
  return colors.semantic[type]?.[variant] || colors.neutral.foreground1;
};

export const getInteractiveColor = (type, state = 'default') => {
  const interactive = colors.interactive[type];
  if (state === 'default') {
    return {
      background: interactive.background,
      foreground: interactive.foreground,
      border: interactive.border,
    };
  }
  return {
    background: interactive[state]?.background || interactive.background,
    foreground: interactive[state]?.foreground || interactive.foreground,
    border: interactive[state]?.border || interactive.border,
  };
};

// CSS custom properties for colors
export const colorCSS = `
  :root {
    /* Brand Colors */
    --color-brand-primary: ${colors.brand.primary};
    --color-brand-secondary: ${colors.brand.secondary};
    --color-brand-stroke: ${colors.brand.stroke};
    --color-brand-background: ${colors.brand.background};
    
    /* Semantic Colors */
    --color-success: ${colors.semantic.success.foreground};
    --color-success-bg: ${colors.semantic.success.background};
    --color-success-border: ${colors.semantic.success.border};
    
    --color-warning: ${colors.semantic.warning.foreground};
    --color-warning-bg: ${colors.semantic.warning.background};
    --color-warning-border: ${colors.semantic.warning.border};
    
    --color-error: ${colors.semantic.error.foreground};
    --color-error-bg: ${colors.semantic.error.background};
    --color-error-border: ${colors.semantic.error.border};
    
    --color-info: ${colors.semantic.info.foreground};
    --color-info-bg: ${colors.semantic.info.background};
    --color-info-border: ${colors.semantic.info.border};
    
    /* Status Colors */
    --color-status-online: ${colors.status.online};
    --color-status-offline: ${colors.status.offline};
    --color-status-away: ${colors.status.away};
    --color-status-busy: ${colors.status.busy};
    
    /* Focus Colors */
    --color-focus-primary: ${colors.focus.primary};
    --color-focus-outline: ${colors.focus.outline};
    --color-focus-offset: ${colors.focus.offset};
  }
`;

// Color usage guidelines
export const colorUsage = {
  // When to use each color
  brand: {
    primary: 'Main actions, primary buttons, important links',
    secondary: 'Secondary actions, supporting elements',
    stroke: 'Borders, focus indicators, active states',
    background: 'Primary button backgrounds, brand elements',
  },
  semantic: {
    success: 'Successful actions, positive feedback, completed states',
    warning: 'Warnings, caution messages, pending states',
    error: 'Error messages, failed actions, critical alerts',
    info: 'Informational messages, help text, neutral feedback',
  },
  neutral: {
    background1: 'Main content areas, cards, panels',
    background2: 'Secondary content areas, sidebars',
    background3: 'Tertiary content areas, modals',
    foreground1: 'Primary text, headings, important content',
    foreground2: 'Secondary text, descriptions, metadata',
    foreground3: 'Tertiary text, placeholders, disabled text',
  },
  interactive: {
    primary: 'Main call-to-action buttons, important interactions',
    secondary: 'Secondary buttons, less important actions',
  },
  message: {
    user: 'User-generated content, user messages',
    ai: 'AI-generated content, system responses',
    system: 'System notifications, status messages',
  },
};
