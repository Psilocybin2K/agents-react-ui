import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { shadows } from '../../styles/shadows';

const useStyles = makeStyles({
  content: {
    ...shorthands.padding('8px', '0'),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  splitPane: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    ...shorthands.gap('12px'),
    minHeight: '420px',
    maxHeight: 'calc(80vh - 120px)', // Account for header and actions
    flex: 1,
  },
  listPane: {
    ...shorthands.padding('8px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    maxHeight: '100%',
    boxShadow: shadows.components.card,
    animation: 'fadeInLeft 0.4s ease-out',
  },
  formPane: {
    ...shorthands.padding('8px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    maxHeight: '100%',
    overflow: 'auto',
    boxShadow: shadows.components.card,
    animation: 'fadeInRight 0.4s ease-out',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minHeight: 0,
  },
  listHeader: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  listBody: {
    flexGrow: 1,
    minHeight: 0,
    ...shorthands.overflow('auto'),
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  listItem: {
    textAlign: 'left',
    width: '100%',
    ...shorthands.padding('8px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: tokens.colorNeutralForeground2,
    transitionProperty: 'background-color, color, box-shadow, transform',
    transitionDuration: tokens.durationFaster,
    transitionTimingFunction: tokens.curveDecelerateMid,
    boxShadow: shadows.subtle.xs,
    animation: 'fadeInUp 0.3s ease-out',
    ':hover': { 
      backgroundColor: tokens.colorNeutralBackground1Hover, 
      color: tokens.colorNeutralForeground1,
      boxShadow: shadows.subtle.sm,
      transform: 'translateX(2px) scale(1.02)',
    },
    ':active': {
      transform: 'translateX(1px) scale(0.98)',
      animation: 'buttonPress 0.15s ease-out',
    },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '2px',
      boxShadow: shadows.interactive.focus,
      animation: 'focusRing 0.3s ease-out',
    },
  },
  listItemActive: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    boxShadow: `inset 2px 0 0 ${tokens.colorBrandStroke1}, ${shadows.brand.sm}`,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  },
});

export default useStyles;