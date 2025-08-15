import React, { useMemo } from 'react';
import { Button, Input, Text } from '@fluentui/react-components';
import { AddRegular, SearchRegular } from '@fluentui/react-icons';
import useStyles from './styles';

export default function DocumentList({ documents = [], selectedId = null, searchQuery = '', onSearchChange, onSelect, onCreateNew }) {
  const styles = useStyles();
  const items = useMemo(() => Array.isArray(documents) ? documents : [], [documents]);

  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Input
            placeholder="Search documents…"
            value={searchQuery}
            onChange={(_, data) => onSearchChange && onSearchChange(data.value)}
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
          {searchQuery && (
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              opacity: 0.6,
              pointerEvents: 'none'
            }}>
              {items.length} result{items.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        <Button appearance="primary" icon={<AddRegular />} onClick={() => onCreateNew && onCreateNew()}>
          New
        </Button>
      </div>
      <div className={styles.listBody}>
        {items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 16px',
            opacity: 0.6
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <Text weight="semibold" style={{ display: 'block', marginBottom: '8px' }}>
              No documents found
            </Text>
            <Text size="small">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first document to get started'}
            </Text>
          </div>
        ) : items.map(item => {
          const isActive = item.id === selectedId;
          const className = isActive ? `${styles.listItem} ${styles.listItemActive}` : styles.listItem;
          return (
            <button key={item.id || Math.random()} className={className} onClick={() => onSelect && onSelect(item.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.name || 'Untitled'}</span>
                <span style={{ opacity: 0.7, fontSize: 12 }}>{(item.kind || 'text').toUpperCase()}</span>
              </div>
              {item.description && (
                <div style={{ marginTop: 4, opacity: 0.8, fontSize: 12, lineHeight: '1.4' }}>
                  {item.description}
                </div>
              )}
              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <div style={{ marginTop: 4, opacity: 0.8, fontSize: 12 }}>
                  {item.tags.join(', ')}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}