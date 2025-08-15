import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Field, Input, Textarea, Dropdown, Option, Label, Text, Button } from '@fluentui/react-components';
import { DocumentRegular } from '@fluentui/react-icons';

const MAX = {
  name: 100,
  description: 500,
  content: 20000,
  url: 2000,
  tag: 50,
  tagsCount: 10,
};

/**
 * DocumentForm
 * Controlled form for editing a DocumentSource draft.
 * Shows conditional fields based on kind and exposes an imperative
 * focus API via ref (focusField(name)).
 */
const DocumentForm = forwardRef(function DocumentForm({ value, onChange, errors = {}, disabled = false, onFieldBlur }, ref) {
  const v = value || {};

  const nameRef = useRef(null);
  const descRef = useRef(null);
  const contentRef = useRef(null);
  const importTextFileRef = useRef(null);
  const urlRef = useRef(null);
  const fileRef = useRef(null);
  const tagsRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusField(fieldName) {
      const map = { name: nameRef, description: descRef, content: contentRef, url: urlRef, file: fileRef, tags: tagsRef };
      const r = map[fieldName];
      if (r && r.current) r.current.focus();
    },
  }));

  const set = (updates) => onChange && onChange({ ...v, ...updates });

  useEffect(() => {
    // Clamp lengths defensively (UI-only)
    if ((v.name || '').length > MAX.name) set({ name: (v.name || '').slice(0, MAX.name) });
    if ((v.description || '').length > MAX.description) set({ description: (v.description || '').slice(0, MAX.description) });
    if (v.kind === 'text' && (v.content || '').length > MAX.content) set({ content: (v.content || '').slice(0, MAX.content) });
    if (v.kind === 'url' && (v.url || '').length > MAX.url) set({ url: (v.url || '').slice(0, MAX.url) });
    if (Array.isArray(v.tags) && v.tags.length > MAX.tagsCount) set({ tags: v.tags.slice(0, MAX.tagsCount) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.name, v.description, v.content, v.url, v.tags, v.kind]);

  const counts = {
    name: (v.name || '').length,
    description: (v.description || '').length,
    content: (v.content || '').length,
    url: (v.url || '').length,
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
                    <Text size={200} style={{ opacity: 0.7 }}>{counts.name}/{MAX.name}</Text>
                  </div>
                } 
                validationMessage={errors.name} 
                validationState={errors.name ? 'error' : undefined}
                required
              >
                <Input 
                  ref={nameRef} 
                  value={v.name || ''} 
                  onChange={(_, d) => set({ name: d.value })} 
                  onBlur={() => onFieldBlur && onFieldBlur('name')} 
                  placeholder="Enter document name..."
                />
              </Field>

              <Field 
                label={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Description</span>
                    <Text size={200} style={{ opacity: 0.7 }}>{counts.description}/{MAX.description}</Text>
                  </div>
                } 
                validationMessage={errors.description} 
                validationState={errors.description ? 'error' : undefined}
              >
                <Textarea 
                  ref={descRef} 
                  value={v.description || ''} 
                  onChange={(_, d) => set({ description: d.value })} 
                  onBlur={() => onFieldBlur && onFieldBlur('description')} 
                  rows={3} 
                  placeholder="Describe this document..."
                />
              </Field>
            </div>
          </div>

          {/* Document Configuration Section */}
          <div style={{ 
            padding: '12px', 
            background: 'var(--colorNeutralBackground2)', 
            borderRadius: '8px',
            border: '1px solid var(--colorNeutralStroke1)'
          }}>
            <Text weight="semibold" size="medium" style={{ marginBottom: '8px', display: 'block' }}>
              Document Configuration
            </Text>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Document Type">
                <Dropdown
                  selectedOptions={[v.kind || 'text']}
                  onOptionSelect={(_, data) => set({ kind: data.optionValue, content: '', url: '', fileMeta: null })}
                >
                  <Option key="text" value="text">Text Content</Option>
                  <Option key="url" value="url">URL Reference</Option>
                  <Option key="file" value="file">File Upload</Option>
                </Dropdown>
              </Field>

              {v.kind === 'text' && (
                <Field 
                  label={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Text Content</span>
                      <Text size={200} style={{ opacity: 0.7 }}>{counts.content}/{MAX.content}</Text>
                    </div>
                  } 
                  validationMessage={errors.content} 
                  validationState={errors.content ? 'error' : undefined}
                  required
                >
                  <Textarea 
                    ref={contentRef} 
                    value={v.content || ''} 
                    onChange={(_, d) => set({ content: d.value })} 
                    onBlur={() => onFieldBlur && onFieldBlur('content')} 
                    rows={8} 
                    placeholder="Enter your document content here..."
                    style={{ minHeight: '120px', resize: 'vertical' }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      appearance="secondary" 
                      icon={<DocumentRegular />}
                      onClick={() => importTextFileRef.current && importTextFileRef.current.click()} 
                      disabled={disabled}
                    >
                      Import from File
                    </Button>
                    <input
                      ref={importTextFileRef}
                      type="file"
                      accept=".txt,.md,text/plain,text/markdown"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) return;
                        try {
                          const text = await file.text();
                          set({ content: text });
                        } catch (err) {
                          // no-op; import is best-effort
                        } finally {
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </Field>
              )}

              {v.kind === 'url' && (
                <Field 
                  label={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>URL</span>
                      <Text size={200} style={{ opacity: 0.7 }}>{counts.url}/{MAX.url}</Text>
                    </div>
                  } 
                  validationMessage={errors.url} 
                  validationState={errors.url ? 'error' : undefined}
                  required
                >
                  <Input 
                    ref={urlRef} 
                    value={v.url || ''} 
                    onChange={(_, d) => set({ url: d.value })} 
                    onBlur={() => onFieldBlur && onFieldBlur('url')} 
                    placeholder="https://example.com/document" 
                  />
                </Field>
              )}

              {v.kind === 'file' && (
                <div>
                  <Label htmlFor="file-input" weight="semibold">File Upload</Label>
                  <div style={{ marginTop: 8 }}>
                    <input
                      id="file-input"
                      ref={fileRef}
                      type="file"
                      accept="text/*,application/pdf"
                      onBlur={() => onFieldBlur && onFieldBlur('file')}
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (!file) { set({ fileMeta: null }); return; }
                        set({ fileMeta: { name: file.name, size: file.size, type: file.type } });
                      }}
                      style={{ 
                        padding: '8px',
                        border: '1px solid var(--colorNeutralStroke1)',
                        borderRadius: '4px',
                        width: '100%'
                      }}
                    />
                    {errors.file && (
                      <div role="alert" aria-live="polite" style={{ color: 'var(--colorPaletteRedForeground1, #a80000)', fontSize: 12, marginTop: 4 }}>
                        {errors.file}
                      </div>
                    )}
                    {v.fileMeta && (
                      <div style={{ 
                        marginTop: 8, 
                        padding: '8px',
                        backgroundColor: 'var(--colorNeutralBackground3)',
                        borderRadius: '4px',
                        fontSize: 12, 
                        opacity: 0.85 
                      }}>
                        <div><strong>Name:</strong> {v.fileMeta.name}</div>
                        <div><strong>Size:</strong> {Math.round(v.fileMeta.size / 1024)} KB</div>
                        <div><strong>Type:</strong> {v.fileMeta.type || 'Unknown'}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
              <Text size="small" style={{ opacity: 0.7 }}>Add tags to help categorize and find this document</Text>
            </div>
            
            <Field 
              validationMessage={errors.tags} 
              validationState={errors.tags ? 'error' : undefined}
            >
              <Input
                ref={tagsRef}
                value={Array.isArray(v.tags) ? v.tags.join(', ') : ''}
                onChange={(_, d) => set({ tags: d.value.split(',').map(s => s.trim()).filter(Boolean) })}
                onBlur={() => onFieldBlur && onFieldBlur('tags')}
                placeholder="knowledge, faq, policy, documentation"
              />
            </Field>
            
            <div style={{ marginTop: 4 }}>
              <Text size={200} style={{ opacity: 0.7 }}>
                Separate tags with commas • {Array.isArray(v.tags) ? v.tags.length : 0}/{MAX.tagsCount} tags
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DocumentForm;