import React from 'react';
import { Avatar, Text, Input, Badge, Button, Persona } from '@fluentui/react-components';
import { DataUsage24Regular, Search24Regular, Chat24Regular, Library24Regular, Apps24Regular, Add24Regular, Keyboard24Regular, Pin24Regular, PinOff24Regular } from '@fluentui/react-icons';
import useStyles from './styles';

const Sidebar = ({
  pinnedChats = [],
  recentChats = [],
  selectedChatId = null,
  onCreateChat,
  onSelectChat,
  onTogglePin,
  searchQuery = '',
  onSearch,
  onOpenAgents,
  onOpenPrompts,
  onOpenDocuments,
  manageAgentsButtonRef,
  manageDocumentsButtonRef,
}) => {
  const styles = useStyles();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
          <Avatar color="brand" icon={<DataUsage24Regular />} />
          <Text size={500} weight="bold">Ciphy</Text>
        </div>

        <Persona
          name="Alex Ferguson"
          secondaryText="Available"
          avatar={{ image: { src: "https://placehold.co/32x32/E0E0E0/333?text=AF" } }}
          presence={{ status: 'available' }}
        />

        <Input
          contentBefore={<Search24Regular />}
          contentAfter={<Keyboard24Regular />}
          placeholder="Search for chats..."
          value={searchQuery}
          onChange={(e, data) => onSearch && onSearch(data.value)}
        />

        <nav className={styles.sidebarNav}>
          <a
            href="#"
            className={`${styles.sidebarNavItem} ${styles.sidebarNavItemActive}`}
            onClick={(e) => e.preventDefault()}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><Chat24Regular /> <Text>Chats</Text></div>
            <Badge appearance="filled" color="brand">{pinnedChats.length + recentChats.length}</Badge>
          </a>
          <a href="#" className={styles.sidebarNavItem}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><Library24Regular /> <Text>Library</Text></div>
            <Badge appearance="ghost" color="neutral">2</Badge>
          </a>
          <a href="#" className={styles.sidebarNavItem}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><Apps24Regular /> <Text>Apps</Text></div>
            <Badge appearance="ghost" color="neutral">3</Badge>
          </a>
        </nav>

        <div className={styles.sidebarScrollArea}>
          <div>
            <h2 className={styles.sidebarSectionHeader}>Pinned</h2>
            {pinnedChats.map((chat) => (
              <div key={chat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a
                  href="#"
                  className={styles.sidebarLink}
                  onClick={(e) => { e.preventDefault(); onSelectChat && onSelectChat(chat.id); }}
                  title={chat.title}
                  style={{ fontWeight: chat.id === selectedChatId ? 600 : undefined, flex: 1 }}
                >
                  {chat.title || 'Untitled'}
                </a>
                <Button
                  appearance="transparent"
                  size="small"
                  icon={<PinOff24Regular />}
                  aria-label="Unpin chat"
                  onClick={() => onTogglePin && onTogglePin(chat.id)}
                />
              </div>
            ))}
          </div>
          <div>
            <h2 className={styles.sidebarSectionHeader}>Chat History</h2>
            {recentChats.map((chat) => (
              <div key={chat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a
                  href="#"
                  className={styles.sidebarLink}
                  onClick={(e) => { e.preventDefault(); onSelectChat && onSelectChat(chat.id); }}
                  title={chat.title}
                  style={{ fontWeight: chat.id === selectedChatId ? 600 : undefined, flex: 1 }}
                >
                  {chat.title || 'Untitled'}
                </a>
                <Button
                  appearance="transparent"
                  size="small"
                  icon={<Pin24Regular />}
                  aria-label="Pin chat"
                  onClick={() => onTogglePin && onTogglePin(chat.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button appearance="primary" icon={<Add24Regular />} onClick={() => onCreateChat && onCreateChat()}>Start new chat</Button>
          <Button appearance="secondary" icon={<Apps24Regular />} onClick={() => onOpenAgents && onOpenAgents()} ref={manageAgentsButtonRef}>Manage agents</Button>
          <Button appearance="secondary" icon={<Library24Regular />} onClick={() => onOpenPrompts && onOpenPrompts()}>Manage prompts</Button>
          <Button appearance="secondary" icon={<DataUsage24Regular />} onClick={() => onOpenDocuments && onOpenDocuments()} ref={manageDocumentsButtonRef}>Manage documents</Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
