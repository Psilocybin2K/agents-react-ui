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
  variablesBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('8px'),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    boxShadow: shadows.components.card,
  },
  variableRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
});

export default useStyles;