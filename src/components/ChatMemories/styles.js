import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { shadows } from '../../styles/shadows';
import { spacing } from '../../styles/typography';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    ...shorthands.padding('8px', '0'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(spacing.md),
    boxShadow: shadows.components.card,
    animation: 'fadeInUp 0.4s ease-out',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: '1.4',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    ...shorthands.padding(spacing.xs, '0'),
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding(spacing.sm, spacing.md),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    fontSize: tokens.fontSizeBase200,
    lineHeight: '1.4',
    letterSpacing: '0.025em',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: tokens.durationFaster,
    transitionTimingFunction: tokens.curveDecelerateMid,
    boxShadow: shadows.subtle.xs,
    animation: 'fadeInUp 0.3s ease-out',
    ':hover': {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: shadows.subtle.sm,
    },
    ':active': {
      transform: 'translateY(-1px) scale(0.98)',
      animation: 'buttonPress 0.15s ease-out',
    },
  },
  listItemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
    lineHeight: '1.2',
  },
});

export default useStyles;


