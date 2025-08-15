import React from 'react';
import { Button } from '@fluentui/react-components';

const GenerateButton = ({ onClick, disabled, loading }) => {
  return (
    <Button appearance="primary" onClick={onClick} disabled={disabled}>
      {loading ? 'Generating…' : 'Generate Memories'}
    </Button>
  );
};

export default GenerateButton;


