import React, { useMemo, useState } from 'react';
import { Input, Button, Text } from '@fluentui/react-components';
import { AddRegular, SearchRegular } from '@fluentui/react-icons';
import useStyles from './styles';

const PromptList = ({ prompts = [], selectedId, onSelect, onCreateNew }) => {
  const styles = useStyles();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = Array.isArray(prompts) ? prompts : [];
    if (!q) return list;
    return list.filter(p => (p.name || '').toLowerCase().includes(q));
  }, [prompts, query]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* Fixed header section */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ position: 'relative', marginBottom: 12, width: '100%' }}>
          <Input 
            placeholder="Search prompts..." 
            value={query} 
            onChange={(e, d) => setQuery(d.value)}
            style={{ paddingLeft: '36px', width: '100%' }}
          />
          <SearchRegular 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              fontSize: '16px',
              opacity: 0.6
            }} 
          />
          {query && (
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              opacity: 0.6,
              pointerEvents: 'none'
            }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <Button 
          appearance="primary" 
          icon={<AddRegular />}
          onClick={() => onCreateNew && onCreateNew()}
          style={{ height: '40px', width: '100%' }}
        >
          New Prompt
        </Button>
      </div>
      
      {/* Scrollable list section */}
      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 6, 
          overflow: 'auto',
          height: '100%'
        }}>
          {filtered.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '32px 16px',
              opacity: 0.6
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <Text weight="semibold">No prompts found</Text>
              <Text size="small" style={{ marginTop: '8px' }}>
                {query ? 'Try adjusting your search terms' : 'Create your first prompt to get started'}
              </Text>
            </div>
          )}
          {filtered.map(item => {
            const isSelected = selectedId === item.id;
            
            return (
              <button
                key={item.id}
                role="listitem"
                onClick={() => onSelect && onSelect(item.id)}
                title={item.name}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid var(--colorBrandBackground)' : '1px solid transparent',
                  background: isSelected 
                    ? 'var(--colorBrandBackground2)' 
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'var(--colorNeutralBackground2)';
                    e.target.style.borderColor = 'var(--colorNeutralStroke1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: isSelected ? 'var(--colorBrandBackground)' : 'var(--colorNeutralStroke2)',
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Text
                        weight={isSelected ? 'semibold' : 'regular'}
                        size="medium"
                        style={{
                          color: isSelected ? 'var(--colorNeutralForeground1)' : 'var(--colorNeutralForeground1)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.name || 'Untitled'}
                      </Text>
                    </div>
                    {item.description ? (
                      <Text
                        size="small"
                        style={{
                          opacity: 0.7,
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.description}
                      </Text>
                    ) : (
                      <Text
                        size="small"
                        style={{
                          opacity: 0.5,
                          fontStyle: 'italic'
                        }}
                      >
                        No description
                      </Text>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromptList;


