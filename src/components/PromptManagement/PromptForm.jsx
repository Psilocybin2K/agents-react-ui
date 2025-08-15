import React from 'react';
import { Field, Input, Textarea, Tag, TagGroup, Button, Text } from '@fluentui/react-components';
import useStyles from './styles';

const NAME_MAX = 100;
const DESC_MAX = 500;
const CONTENT_MAX = 5000;
const TAG_MAX = 50;
const TAGS_MAX_COUNT = 10;
const VAR_MAX = 50;

const PromptForm = ({ value, onChange, errors = {}, disabled = false }) => {
  const styles = useStyles();
  const v = value || { name: '', description: '', content: '', variables: [], tags: [] };

  const update = (patch) => onChange && onChange({ ...v, ...patch });

  const counters = {
    name: (v.name || '').length,
    description: (v.description || '').length,
    content: (v.content || '').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scrollable Content */}
      <div style={{ flex: 1, overflow: 'auto', paddingRight: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Basic Information Section */}
          <div style={{ 
            padding: '12px', 
            background: 'var(--colorNeutralBackground2)', 
            borderRadius: '8px',
            border: '1px solid var(--colorNeutralStroke1)'
          }}>
            <Text weight="semibold" size="medium" style={{ marginBottom: '8px', display: 'block' }}>
              Basic Information
            </Text>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Field 
                label={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Name</span>
                    <Text size={200} style={{ opacity: 0.7 }}>{counters.name}/{NAME_MAX}</Text>
                  </div>
                } 
                required 
                validationState={errors.name ? 'error' : undefined} 
                validationMessage={errors.name}
              >
                <Input 
                  value={v.name} 
                  maxLength={NAME_MAX} 
                  disabled={disabled} 
                  onChange={(e, d) => update({ name: (d && 'value' in d) ? d.value : e.target.value })} 
                />
              </Field>

              <Field 
                label={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Description</span>
                    <Text size={200} style={{ opacity: 0.7 }}>{counters.description}/{DESC_MAX}</Text>
                  </div>
                } 
                validationState={errors.description ? 'error' : undefined} 
                validationMessage={errors.description}
              >
                <Input 
                  value={v.description} 
                  maxLength={DESC_MAX} 
                  disabled={disabled} 
                  onChange={(e, d) => update({ description: (d && 'value' in d) ? d.value : e.target.value })} 
                  placeholder="Describe what this prompt does..."
                />
              </Field>
            </div>
          </div>

          {/* Prompt Content Section */}
          <div style={{ 
            padding: '12px', 
            background: 'var(--colorNeutralBackground2)', 
            borderRadius: '8px',
            border: '1px solid var(--colorNeutralStroke1)'
          }}>
            <Text weight="semibold" size="medium" style={{ marginBottom: '8px', display: 'block' }}>
              Prompt Content
            </Text>
            
            <Field 
              label={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Content</span>
                  <Text size={200} style={{ opacity: 0.7 }}>{counters.content}/{CONTENT_MAX}</Text>
                </div>
              } 
              required 
              validationState={errors.content ? 'error' : undefined} 
              validationMessage={errors.content}
            >
              <Textarea 
                value={v.content} 
                maxLength={CONTENT_MAX} 
                disabled={disabled} 
                onChange={(e, d) => update({ content: (d && 'value' in d) ? d.value : e.target.value })}
                rows={6}
                style={{ minHeight: '120px', resize: 'vertical' }}
                placeholder="Enter your prompt template here..."
              />
            </Field>
          </div>

          {/* Variables Section */}
          <div style={{ 
            padding: '12px', 
            background: 'var(--colorNeutralBackground2)', 
            borderRadius: '8px',
            border: '1px solid var(--colorNeutralStroke1)'
          }}>
            <Text weight="semibold" size="medium" style={{ marginBottom: '8px', display: 'block' }}>
              Variables
            </Text>
            
            <div style={{ marginBottom: '8px' }}>
              <Text size="small" style={{ opacity: 0.7 }}>Define variables that can be used in your prompt template</Text>
            </div>
            
            <div className={styles.variablesBox}>
              {(v.variables || []).map((vr, idx) => (
                <div key={idx} className={styles.variableRow}>
                  <Input 
                    value={vr.name || ''} 
                    placeholder="Variable name" 
                    maxLength={TAG_MAX} 
                    disabled={disabled} 
                    onChange={(e, d) => {
                      const next = [...(v.variables || [])];
                      const nextVal = (d && 'value' in d) ? d.value : e.target.value;
                      next[idx] = { ...next[idx], name: nextVal };
                      update({ variables: next });
                    }} 
                  />
                  <Button 
                    appearance="secondary" 
                    disabled={disabled} 
                    onClick={() => {
                      const next = (v.variables || []).filter((_, i) => i !== idx);
                      update({ variables: next });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button 
                appearance="primary" 
                disabled={disabled || (v.variables || []).length >= VAR_MAX} 
                onClick={() => update({ variables: [...(v.variables || []), { name: '' }] })}
              >
                Add Variable
              </Button>
            </div>
            
            {errors.variables && (
              <Text size="small" style={{ color: 'var(--colorPaletteRedForeground1)', marginTop: '4px' }}>
                {errors.variables}
              </Text>
            )}
          </div>

          {/* Tags Section */}
          <div style={{ 
            padding: '12px', 
            background: 'var(--colorNeutralBackground2)', 
            borderRadius: '8px',
            border: '1px solid var(--colorNeutralStroke1)'
          }}>
            <Text weight="semibold" size="medium" style={{ marginBottom: '8px', display: 'block' }}>
              Tags
            </Text>
            
            <div style={{ marginBottom: '8px' }}>
              <Text size="small" style={{ opacity: 0.7 }}>Add tags to help organize and find this prompt</Text>
            </div>
            
            <TagGroup style={{ marginBottom: '8px' }}>
              {(v.tags || []).map((t, idx) => (
                <Tag 
                  key={idx} 
                  shape="rounded" 
                  dismissible 
                  disabled={disabled} 
                  onDismiss={() => update({ tags: (v.tags || []).filter((_, i) => i !== idx) })}
                >
                  {t}
                </Tag>
              ))}
            </TagGroup>
            
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Input 
                placeholder="Add tag" 
                disabled={disabled || (v.tags || []).length >= TAGS_MAX_COUNT} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget.value.trim();
                    if (input && input.length <= TAG_MAX && (v.tags || []).length < TAGS_MAX_COUNT) {
                      update({ tags: [...(v.tags || []), input] });
                      e.currentTarget.value = '';
                    }
                  }
                }} 
                style={{ flex: 1 }}
              />
              <Text size={200} style={{ opacity: 0.7 }}>Press Enter</Text>
            </div>
            
            {errors.tags && (
              <Text size="small" style={{ color: 'var(--colorPaletteRedForeground1)', marginTop: '4px' }}>
                {errors.tags}
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptForm;