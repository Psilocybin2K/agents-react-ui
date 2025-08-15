import React from 'react';
import { Avatar, Text, CardHeader, Button, Link, Badge } from '@fluentui/react-components';
import { DataUsage24Regular, CheckmarkCircle24Regular, ChevronRight24Regular } from '@fluentui/react-icons';
import { tokens } from '@fluentui/react-components';
import useStyles from './styles';

const InfoPanel = ({ lastAssistantMessage }) => {
  const styles = useStyles();
  const sources = ["google.com", "medium.com", "producthunt.com", "linkedin.com"];
  return (
    <aside className={styles.infoPanel}>
      <div className={styles.infoPanelContent}>
        <div style={{textAlign: 'center'}}>
          <Avatar size={56} style={{backgroundColor: tokens.colorBrandBackground, color: tokens.colorNeutralForegroundOnBrand}} icon={<DataUsage24Regular />} />
          <Text as="h2" block size={600} weight="bold" style={{marginTop: '16px'}}>GPT 4o Model</Text>
          <Text as="p" block size={300} style={{color: tokens.colorNeutralForeground3, marginTop: '4px'}}>
            The latest GPT-4 model with improved instruction following, JSON mode, and more...
          </Text>
          {lastAssistantMessage?.tokenCount ? (
            <div style={{ marginTop: '8px' }}>
              <Badge appearance="outline">{lastAssistantMessage.tokenCount} tokens</Badge>
            </div>
          ) : null}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
          <div>
            <Text as="p" block size={200} style={{color: tokens.colorNeutralForeground4, textTransform: 'uppercase'}}>Context Window</Text>
            <Text as="p" block size={500} weight="semibold">128,000 tokens</Text>
          </div>
          <div>
            <Text as="p" block size={200} style={{color: tokens.colorNeutralForeground4, textTransform: 'uppercase'}}>Training Data</Text>
            <Text as="p" block size={500} weight="semibold">Up to Apr 2023</Text>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <div className={styles.successCard}>
            <CheckmarkCircle24Regular style={{color: tokens.colorPaletteGreenForeground1}} />
            <Text style={{color: tokens.colorNeutralForeground1}}>Searched for: spaces and special characters...</Text>
          </div>
          <div className={styles.successCard}>
            <CheckmarkCircle24Regular style={{color: tokens.colorPaletteGreenForeground1}} />
            <Text style={{color: tokens.colorNeutralForeground1}}>Successfully generated responses</Text>
          </div>
        </div>
        <div className={styles.infoCard}>
          <CardHeader header={<Text weight="semibold">Token usage in language models</Text>} />
          <Text as="p" block>1. Tokens are the basic units of text.</Text>
          <Text as="p" block>2. Models count tokens in both input and output.</Text>
          <Text as="p" block>3. Advanced tracking systems use timestamps.</Text>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.sourceButtons}>
            {sources.map(s => (
              <Button className={styles.chipButton} key={s} size="small" appearance="outline" icon={<img src={`https://www.google.com/s2/favicons?domain=${s}`} alt="" width="16" height="16" />}>{s}</Button>
            ))}
          </div>
        </div>
        <Link href="#" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecorationLine: 'none'}}>
          <Text weight="semibold" style={{color: tokens.colorBrandForeground1}}>Fact check history</Text>
          <ChevronRight24Regular style={{color: tokens.colorBrandForeground1}} />
        </Link>
      </div>
    </aside>
  );
};

export default InfoPanel;
