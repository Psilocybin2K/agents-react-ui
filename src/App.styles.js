import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { shadows } from './styles/shadows';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground3,
    fontFamily: '"Segoe UI", "Helvetica Neue", "Arial", sans-serif',
    minWidth: '800px',
    ...shorthands.overflow('hidden'),
    boxSizing: 'border-box',
    position: 'relative',
  },
  chatPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    minWidth: 0,
    ...shorthands.overflow('hidden'),
    boxSizing: 'border-box',
    position: 'relative',
    boxShadow: shadows.subtle.xs,
  },
});

export default useStyles;


