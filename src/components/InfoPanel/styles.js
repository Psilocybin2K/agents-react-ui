import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { shadows } from '../../styles/shadows';
import { spacing } from '../../styles/typography';
import { colors } from '../../styles/colors';

const useStyles = makeStyles({
  infoPanel: {
    width: '320px',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(spacing['2xl']),
    backgroundColor: tokens.colorNeutralBackground2,
    borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.overflow('hidden'),
    boxSizing: 'border-box',
    boxShadow: shadows.subtle.sm,
    position: 'relative',
    zIndex: 10,
    animation: 'fadeInRight 0.4s ease-out',
  },
  infoPanelContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['2xl'],
    flex: 1,
    minHeight: 0,
    ...shorthands.overflow('auto'),
    scrollBehavior: 'smooth',
  },
  infoCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(spacing.lg),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    wordWrap: 'break-word',
    fontSize: tokens.fontSizeBase300,
    lineHeight: '1.6',
    letterSpacing: '0.025em',
    transitionProperty: 'transform, box-shadow, border-color',
    transitionDuration: tokens.durationFaster,
    transitionTimingFunction: tokens.curveDecelerateMid,
    boxShadow: shadows.components.card,
    animation: 'fadeInUp 0.3s ease-out',
    ':hover': {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: shadows.interactive.hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
    ':active': {
      transform: 'translateY(-1px) scale(0.98)',
      animation: 'buttonPress 0.15s ease-out',
    },
  },
  successCard: {
    backgroundColor: colors.semantic.success.background,
    color: colors.semantic.success.foreground,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(spacing.md, spacing.lg),
    ...shorthands.border('1px', 'solid', colors.semantic.success.border),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(spacing.sm),
    wordWrap: 'break-word',
    fontSize: tokens.fontSizeBase200,
    lineHeight: '1.4',
    letterSpacing: '0.025em',
    boxShadow: shadows.subtle.sm,
    transitionProperty: 'transform, box-shadow, border-color',
    transitionDuration: tokens.durationFaster,
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: shadows.subtle.md,
      borderColor: colors.semantic.success.hover,
    },
  },
  sourceButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap(spacing.sm),
  },
  chipButton: {
    transitionProperty: 'transform, background-color, border-color, color, box-shadow',
    transitionDuration: tokens.durationFaster,
    transitionTimingFunction: tokens.curveDecelerateMid,
    boxShadow: shadows.components.button,
    animation: 'fadeInUp 0.3s ease-out',
    ':hover': {
      transform: 'translateY(-2px) scale(1.05)',
      boxShadow: shadows.interactive.hover,
    },
    ':active': {
      transform: 'translateY(0) scale(0.95)',
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
});

export default useStyles;


