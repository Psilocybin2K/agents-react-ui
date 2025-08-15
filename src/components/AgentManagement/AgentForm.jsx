import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Field, Input, Text, Textarea } from '@fluentui/react-components';
import { 
  SaveRegular, 
  DeleteRegular, 
  CopyRegular, 
  DismissRegular,
  DocumentRegular,
  FolderOpenRegular
} from '@fluentui/react-icons';

const LIMITS = { name: 100, description: 500, instructions: 5000, prompt: 5000 };

function countChars(str) { return (str || '').length; }

export default function AgentForm({ value, onChange, onSave, onCancel, onDelete, onClone, onSelectPrompt, onSelectInstruction }) {
  const v = value || { name: '', description: '', instructions: '', prompt: '' };
  const isEditing = Boolean(v.id);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const firstInvalidRef = useRef(null);
  const importInstructionsRef = useRef(null);
  const importPromptRef = useRef(null);

  const counters = useMemo(() => ({
    name: countChars(v.name),
    description: countChars(v.description),
    instructions: countChars(v.instructions),
    prompt: countChars(v.prompt),
  }), [v]);

  const validate = () => {
    const next = {};
    const name = String(v.name || '').trim();
    if (!name) next.name = 'Name is required';
    if (name.length > LIMITS.name) next.name = `Max ${LIMITS.name} characters`;
    if (countChars(v.description) > LIMITS.description) next.description = `Max ${LIMITS.description} characters`;
    if (countChars(v.instructions) > LIMITS.instructions) next.instructions = `Max ${LIMITS.instructions} characters`;
    if (countChars(v.prompt) > LIMITS.prompt) next.prompt = `Max ${LIMITS.prompt} characters`;
    return next;
  };

  useEffect(() => {
    setErrors(validate());
  }, [v]);

  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  const focusFirstInvalid = () => {
    const node = firstInvalidRef.current;
    if (node && typeof node.focus === 'function') node.focus();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scrollable Content */}
      <div style={{ flex: 1, overflow: 'auto', paddingRight: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}> {/* Reduced gap from 12 to 8 */}
          {/* Basic Information Section */}
          <div style={{ 
            padding: '12px', /* Reduced padding from 16px to 12px */
            background: 'var(--colorNeutralBackground2)', 
            borderRadius: '8px',
            border: '1px solid var(--colorNeutralStroke1)'
          }}>
            <Text weight="semibold" size="medium" style={{ marginBottom: '8px', display: 'block' }}> {/* Reduced margin from 12px to 8px */}
              Basic Information
            </Text>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}> {/* Reduced gap from 12 to 8 */}
              <Field 
                label="Name" 
                required 
                validationMessage={touched.name && errors.name ? errors.name : undefined} 
                validationState={errors.name && touched.name ? 'error' : undefined}
              >
                <Input
                  value={v.name}
                  onChange={(_, data) => onChange && onChange({ name: data.value })}
                  onBlur={() => handleBlur('name')}
                  aria-invalid={Boolean(errors.name)}
                  ref={errors.name ? firstInvalidRef : null}
                />
              </Field>
              <Text size={200} style={{ alignSelf: 'flex-end', marginTop: -4 }}>{counters.name}/{LIMITS.name}</Text> {/* Reduced margin from -8 to -4 */}

              <Field 
                label="Description" 
                validationMessage={touched.description && errors.description ? errors.description : undefined} 
                validationState={errors.description && touched.description ? 'error' : undefined}
              >
                <Input /* Changed from Textarea to Input */
                  value={v.description}
                  onChange={(_, data) => onChange && onChange({ description: data.value })}
                  onBlur={() => handleBlur('description')}
                  aria-invalid={Boolean(errors.description)}
                  placeholder="Describe what this agent does..."
                />
              </Field>
              <Text size={200} style={{ alignSelf: 'flex-end', marginTop: -4 }}>{counters.description}/{LIMITS.description}</Text> {/* Reduced margin from -8 to -4 */}
            </div>
          </div>

          {/* Agent Configuration Section */}
          <div style={{ 
            padding: '12px', /* Reduced padding from 16px to 12px */
            background: 'var(--colorNeutralBackground2)', 
            borderRadius: '8px',
            border: '1px solid var(--colorNeutralStroke1)'
          }}>
            <Text weight="semibold" size="medium" style={{ marginBottom: '8px', display: 'block' }}> {/* Reduced margin from 12px to 8px */}
              Agent Configuration
            </Text>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}> {/* Reduced gap from 16 to 12 */}
              <Field 
                label="Instructions" 
                validationMessage={touched.instructions && errors.instructions ? errors.instructions : undefined} 
                validationState={errors.instructions && touched.instructions ? 'error' : undefined}
              >
                <Textarea 
                  rows={4}
                  value={v.instructions}
                  onChange={(_, data) => onChange && onChange({ instructions: data.value })}
                  onBlur={() => handleBlur('instructions')}
                  aria-invalid={Boolean(errors.instructions)}
                  placeholder="Provide instructions for how this agent should behave..."
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}> {/* Reduced margin from 8 to 6 */}
                  <Button 
                    appearance="secondary" 
                    icon={<DocumentRegular />}
                    size="small"
                    onClick={() => importInstructionsRef.current && importInstructionsRef.current.click()}
                  >
                    Import
                  </Button>
                  <Button 
                    appearance="secondary" 
                    icon={<FolderOpenRegular />}
                    size="small"
                    onClick={() => onSelectInstruction && onSelectInstruction()}
                  >
                    Select
                  </Button>
                  <input
                    ref={importInstructionsRef}
                    type="file"
                    accept=".txt,.md,text/plain,text/markdown"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      try {
                        const text = await file.text();
                        onChange && onChange({ instructions: text });
                      } catch (_) {
                        // best-effort
                      } finally {
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </Field>
              <Text size={200} style={{ alignSelf: 'flex-end', marginTop: -4 }}>{counters.instructions}/{LIMITS.instructions}</Text> {/* Reduced margin from -8 to -4 */}

              <Field 
                label="Prompt" 
                validationMessage={touched.prompt && errors.prompt ? errors.prompt : undefined} 
                validationState={errors.prompt && touched.prompt ? 'error' : undefined}
              >
                <Textarea 
                  rows={4}
                  value={v.prompt}
                  onChange={(_, data) => onChange && onChange({ prompt: data.value })}
                  onBlur={() => handleBlur('prompt')}
                  aria-invalid={Boolean(errors.prompt)}
                  placeholder="Define the system prompt for this agent..."
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}> {/* Reduced margin from 8 to 6 */}
                  <Button 
                    appearance="secondary" 
                    icon={<DocumentRegular />}
                    size="small"
                    onClick={() => importPromptRef.current && importPromptRef.current.click()}
                  >
                    Import
                  </Button>
                  <Button 
                    appearance="secondary" 
                    icon={<FolderOpenRegular />}
                    size="small"
                    onClick={() => onSelectPrompt && onSelectPrompt()}
                  >
                    Select
                  </Button>
                  <input
                    ref={importPromptRef}
                    type="file"
                    accept=".txt,.md,text/plain,text/markdown"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      try {
                        const text = await file.text();
                        onChange && onChange({ prompt: text });
                      } catch (_) {
                        // best-effort
                      } finally {
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </Field>
              <Text size={200} style={{ alignSelf: 'flex-end', marginTop: -4 }}>{counters.prompt}/{LIMITS.prompt}</Text> {/* Reduced margin from -8 to -4 */}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div style={{ 
        flexShrink: 0,
        display: 'flex', 
        gap: 8, 
        justifyContent: 'flex-end',
        paddingTop: '12px',
        paddingBottom: '4px',
        borderTop: '1px solid var(--colorNeutralStroke2)',
        backgroundColor: 'var(--colorNeutralBackground1)',
        marginTop: '8px'
      }}>
        {isEditing && (
          <Button 
            appearance="secondary" 
            icon={<DeleteRegular />}
            onClick={() => onDelete && onDelete()}
          >
            Delete
          </Button>
        )}
        {isEditing && (
          <Button 
            appearance="secondary" 
            icon={<CopyRegular />}
            onClick={() => onClone && onClone()}
          >
            Clone
          </Button>
        )}
        <Button 
          appearance="secondary" 
          icon={<DismissRegular />}
          onClick={() => onCancel && onCancel()}
        >
          Cancel
        </Button>
        <Button 
          appearance="primary" 
          icon={<SaveRegular />}
          disabled={Object.keys(validate()).length > 0} 
          onClick={() => {
            const errs = validate();
            setTouched({ name: true, description: true, instructions: true, prompt: true });
            setErrors(errs);
            if (Object.keys(errs).length > 0) {
              focusFirstInvalid();
              return;
            }
            onSave && onSave();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}


