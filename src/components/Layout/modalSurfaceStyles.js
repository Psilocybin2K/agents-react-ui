import { makeStyles } from '@fluentui/react-components';
import { shadows } from '../../styles/shadows';

// Shared modal surface sizing for management-style modals
const useModalSurfaceStyles = makeStyles({
  surface: {
    maxWidth: '920px',
    width: '92vw',
    maxHeight: '80vh', // Added max height constraint
    boxShadow: shadows.overlay.modal,
    animation: 'scaleIn 0.3s ease-out',
  },
});

export default useModalSurfaceStyles;


