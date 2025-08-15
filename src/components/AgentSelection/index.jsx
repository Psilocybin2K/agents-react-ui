import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Button, Badge, Text, Checkbox } from '@fluentui/react-components';
import { ChevronDown24Regular } from '@fluentui/react-icons';
import { useAgents } from '../../services/agents/store';
import useStyles from './styles';

const AgentSelection = ({ selectedAgentIds = [], onSelectionChange, disabled = false }) => {
  const styles = useStyles();
  const { agents } = useAgents();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedAgents = useMemo(() => 
    agents.filter(agent => selectedAgentIds.includes(agent.id)), 
    [agents, selectedAgentIds]
  );

  const handleAgentToggle = (agentId) => {
    const isSelected = selectedAgentIds.includes(agentId);
    console.log(`Toggling agent ${agentId}:`, {
      isSelected,
      currentSelection: selectedAgentIds,
      currentCount: selectedAgentIds.length
    });
    
    let newSelection;
    
    if (isSelected) {
      // Remove agent
      newSelection = selectedAgentIds.filter(id => id !== agentId);
    } else {
      // Add agent (only if under limit)
      if (selectedAgentIds.length < 3) {
        newSelection = [...selectedAgentIds, agentId];
      } else {
        console.log('Cannot add agent - at limit');
        return; // Don't add if at limit
      }
    }
    
    console.log('New selection:', newSelection);
    onSelectionChange(newSelection);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getButtonText = () => {
    if (selectedAgents.length === 0) {
      return 'Select agents...';
    }
    if (selectedAgents.length === 1) {
      return selectedAgents[0].name;
    }
    return `${selectedAgents.length} agents selected`;
  };

  const isAgentDisabled = (agentId) => {
    const isSelected = selectedAgentIds.includes(agentId);
    const shouldDisable = disabled || (!isSelected && selectedAgentIds.length >= 3);
    
    // Debug logging
    console.log(`Agent ${agentId} (${agents.find(a => a.id === agentId)?.name}):`, {
      isSelected,
      selectedCount: selectedAgentIds.length,
      shouldDisable,
      disabled
    });
    
    return shouldDisable;
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <Button
        appearance="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        icon={<ChevronDown24Regular />}
        iconPosition="after"
        className={styles.button}
      >
        {getButtonText()}
      </Button>
      
      {selectedAgents.length > 0 && (
        <div className={styles.badges}>
          {selectedAgents.map(agent => (
            <Badge key={agent.id} appearance="filled" color="brand">
              {agent.name}
            </Badge>
          ))}
        </div>
      )}

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <Text weight="semibold" className={styles.header}>
            Select Agents (max 3)
          </Text>
          {agents.map(agent => (
            <div key={agent.id} className={styles.agentOption}>
              <Checkbox
                checked={selectedAgentIds.includes(agent.id)}
                onChange={() => handleAgentToggle(agent.id)}
                disabled={isAgentDisabled(agent.id)}
                label={agent.name}
              />
              <div className={styles.optionContent}>
                <Text size={200} color="neutralSecondary">
                  {agent.description}
                </Text>
                {agent.tags && agent.tags.length > 0 && (
                  <div className={styles.badges}>
                    {agent.tags.map(tag => (
                      <Badge key={tag} shape="rounded" appearance="outline" size="small">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentSelection;
