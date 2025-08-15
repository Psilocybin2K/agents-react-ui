import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    minWidth: '200px',
    position: 'relative',
  },
  button: {
    minWidth: '200px',
    width: '200px',
    justifyContent: 'space-between',
    textAlign: 'left',
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding('16px'),
    width: '280px',
    maxHeight: '400px',
    ...shorthands.overflow('auto'),
    boxShadow: tokens.shadow16,
    marginTop: '4px',
  },
  header: {
    marginBottom: '12px',
    color: tokens.colorNeutralForeground1,
  },
  agentOption: {
    ...shorthands.padding('8px', '0'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    ':last-child': {
      borderBottom: 'none',
    },
  },
  optionContent: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    marginLeft: '8px',
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('4px'),
  },
});

export default useStyles;
