// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom does not implement localStorage in Node <18 by default in some envs; ensure a basic shim
if (typeof window !== 'undefined' && !window.localStorage) {
  const store = {};
  window.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  };
}

// jsdom: provide a no-op scrollIntoView to avoid TypeErrors
if (typeof window !== 'undefined' && window.HTMLElement && !window.HTMLElement.prototype.scrollIntoView) {
  // eslint-disable-next-line no-extend-native
  window.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {};
}

// Mock Fluent UI components and provider to avoid ESM transform issues in Jest
jest.mock('@fluentui/react-components', () => {
  const React = jest.requireActual('react');
  const Stub = ({ children, ...props }) => React.createElement('div', props, children);
  const Input = React.forwardRef(({ onChange, ...props }, ref) => React.createElement('input', {
    ...props,
    ref,
    onChange: (e) => onChange && onChange(e, { value: e.target.value })
  }));
  const Textarea = React.forwardRef(({ onChange, ...props }, ref) => React.createElement('textarea', {
    ...props,
    ref,
    onChange: (e) => onChange && onChange(e, { value: e.target.value })
  }));
  const Dropdown = ({ children, onOptionSelect, selectedOptions, ...props }) => React.createElement('select', {
    ...props,
    value: Array.isArray(selectedOptions) ? selectedOptions[0] : undefined,
    onChange: (e) => onOptionSelect && onOptionSelect(e, { optionValue: e.target.value })
  }, children);
  const Option = ({ children, value, ...props }) => React.createElement('option', { value, ...props }, children);
  const Checkbox = ({ checked, onChange, label, disabled, ...props }) => React.createElement('input', {
    type: 'checkbox',
    checked,
    disabled,
    'aria-label': label,
    onChange: (e) => onChange && onChange(e, { checked: e.target.checked }),
    ...props
  });
  const Toaster = Stub;
  const useToastController = () => ({ dispatchToast: () => {} });
  const fakeShorthands = {
    padding: () => ({}),
    overflow: () => ({}),
    borderRight: () => ({}),
    borderRadius: () => ({}),
    gap: () => ({}),
    borderBottom: () => ({}),
    border: () => ({}),
    borderColor: () => ({}),
  };
  const fakeTokens = new Proxy({}, { get: () => '' });
  return {
    __esModule: true,
    Text: Stub,
    Link: ({ children, ...props }) => React.createElement('a', props, children),
    CardHeader: Stub,
    Persona: Stub,
    Badge: Stub,
    Toolbar: Stub,
    ToolbarButton: Stub,
    ToolbarDivider: Stub,
    Button: ({ children, ...props }) => React.createElement('button', props, children),
    Card: Stub,
    Textarea,
    Toaster,
    useToastController,
    Toast: Stub,
    ToastTitle: Stub,
    Dialog: Stub,
    DialogSurface: Stub,
    DialogBody: Stub,
    DialogTitle: Stub,
    DialogContent: Stub,
    DialogActions: Stub,
    Avatar: Stub,
    Switch: ({ label, ...props }) => React.createElement('input', { type: 'checkbox', 'aria-label': label, ...props }),
    Checkbox,
    Dropdown,
    Option,
    Input,
    Field: Stub,
    Tag: Stub,
    TagGroup: Stub,
    Label: Stub,
    Tooltip: Stub,
    Divider: ({ children, vertical, ...props }) => React.createElement('div', { ...props, 'data-vertical': !!vertical }, children),
    MessageBar: Stub,
    Spinner: Stub,
    makeStyles: () => () => ({}),
    shorthands: fakeShorthands,
    tokens: fakeTokens,
    FluentProvider: ({ children }) => React.createElement('div', null, children),
    webLightTheme: {},
  };
});

// Mock react-markdown to avoid ESM transform issues in Jest
jest.mock('react-markdown', () => {
  const React = jest.requireActual('react');
  return {
    __esModule: true,
    default: ({ children }) => React.createElement('div', null, children),
  };
});
