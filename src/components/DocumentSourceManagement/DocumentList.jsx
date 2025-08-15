import React, { useMemo } from 'react';
import { Button, Input, Text } from '@fluentui/react-components';
import useStyles from './styles';

export default function DocumentList({ documents = [], selectedId = null, searchQuery = '', onSearchChange, onSelect, onCreateNew }) {
  const styles = useStyles();
  const items = useMemo(() => Array.isArray(documents) ? documents : [], [documents]);

  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <Input
          placeholder="Search documents…"
          value={searchQuery}
          onChange={(_, data) => onSearchChange && onSearchChange(data.value)}
        />
        <Button appearance="primary" onClick={() => onCreateNew && onCreateNew()}>New</Button>
      </div>
      <div className={styles.listBody}>
        {items.length === 0 ? (
          <Text size={300} style={{ opacity: 0.7 }}>No documents</Text>
        ) : items.map(item => {
          const isActive = item.id === selectedId;
          const className = isActive ? `${styles.listItem} ${styles.listItemActive}` : styles.listItem;
          return (
            <button key={item.id || Math.random()} className={className} onClick={() => onSelect && onSelect(item.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.name || 'Untitled'}</span>
                <span style={{ opacity: 0.7, fontSize: 12 }}>{(item.kind || 'text').toUpperCase()}</span>
              </div>
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


