import React, { useState, useEffect, useMemo } from 'react';
import { 
  Avatar, 
  Text, 
  CardHeader, 
  Button, 
  Link, 
  Tree,
  TreeItem,
  TreeItemLayout,
  Divider,
  Spinner,
  Tooltip,
  Input,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem
} from '@fluentui/react-components';
import { 
  DataUsage24Regular, 
  CheckmarkCircle24Regular, 
  ChevronRight24Regular,
  ErrorCircle24Regular,
  Clock24Regular,
  Play24Regular,
  Pause24Regular,
  ArrowForward24Regular,
  DocumentText24Regular,
  Steps24Regular,
  Search24Regular,
  Filter24Regular,
  ChevronDown24Regular
} from '@fluentui/react-icons';
import { tokens } from '@fluentui/react-components';
import { spacing } from '../../styles/typography';
import { useTests } from '../../services/tests/store';
import useStyles from './styles';

const InfoPanel = ({ lastAssistantMessage }) => {
  const styles = useStyles();
  const { 
    testSuites, 
    loading, 
    error, 
    stats, 
    loadTestSuites 
  } = useTests();
  
  const [expandedSuites, setExpandedSuites] = useState(new Set());
  const [expandedCases, setExpandedCases] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  // Load test data on mount
  useEffect(() => {
    loadTestSuites();
  }, [loadTestSuites]);

  // Get all unique tags from test suites
  const allTags = useMemo(() => {
    const tags = new Set();
    testSuites.forEach(suite => {
      suite.tags?.forEach(tag => tags.add(tag));
      suite.testCases.forEach(testCase => {
        testCase.tags?.forEach(tag => tags.add(tag));
      });
    });
    return Array.from(tags).sort();
  }, [testSuites]);

  // Filter test suites based on search and filters
  const filteredTestSuites = useMemo(() => {
    return testSuites.filter(suite => {
      // Search filter
      const searchMatch = !searchQuery || 
        suite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suite.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suite.testCases.some(testCase => 
          testCase.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testCase.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Status filter
      const statusMatch = statusFilter === 'all' || suite.status === statusFilter;

      // Tag filter
      const tagMatch = tagFilter === 'all' || 
        suite.tags?.includes(tagFilter) ||
        suite.testCases.some(testCase => testCase.tags?.includes(tagFilter));

      return searchMatch && statusMatch && tagMatch;
    });
  }, [testSuites, searchQuery, statusFilter, tagFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckmarkCircle24Regular style={{ color: tokens.colorPaletteGreenForeground1 }} />;
      case 'failed':
        return <ErrorCircle24Regular style={{ color: tokens.colorPaletteRedForeground1 }} />;
      case 'running':
        return <Spinner size="tiny" />;
      case 'pending':
        return <Clock24Regular style={{ color: tokens.colorNeutralForeground3 }} />;
      case 'skipped':
        return <ArrowForward24Regular style={{ color: tokens.colorNeutralForeground3 }} />;
      default:
        return <Clock24Regular style={{ color: tokens.colorNeutralForeground3 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return tokens.colorPaletteGreenForeground1;
      case 'failed':
        return tokens.colorPaletteRedForeground1;
      case 'running':
        return tokens.colorPaletteBlueForeground1;
      case 'pending':
        return tokens.colorNeutralForeground3;
      case 'skipped':
        return tokens.colorNeutralForeground3;
      default:
        return tokens.colorNeutralForeground3;
    }
  };

  const formatDuration = (duration) => {
    if (duration === 0) return '0ms';
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const toggleSuite = (suiteId) => {
    const newExpanded = new Set(expandedSuites);
    if (newExpanded.has(suiteId)) {
      newExpanded.delete(suiteId);
    } else {
      newExpanded.add(suiteId);
    }
    setExpandedSuites(newExpanded);
  };

  const toggleCase = (caseId) => {
    const newExpanded = new Set(expandedCases);
    if (newExpanded.has(caseId)) {
      newExpanded.delete(caseId);
    } else {
      newExpanded.add(caseId);
    }
    setExpandedCases(newExpanded);
  };

  const getSuiteStats = (suite) => {
    const total = suite.testCases.length;
    const passed = suite.testCases.filter(tc => tc.status === 'passed').length;
    const failed = suite.testCases.filter(tc => tc.status === 'failed').length;
    const running = suite.testCases.filter(tc => tc.status === 'running').length;
    const skipped = suite.testCases.filter(tc => tc.status === 'skipped').length;
    return { total, passed, failed, running, skipped };
  };

  const getCaseStats = (testCase) => {
    const total = testCase.steps.length;
    const passed = testCase.steps.filter(step => step.status === 'passed').length;
    const failed = testCase.steps.filter(step => step.status === 'failed').length;
    const running = testCase.steps.filter(step => step.status === 'running').length;
    const skipped = testCase.steps.filter(step => step.status === 'skipped').length;
    return { total, passed, failed, running, skipped };
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTagFilter('all');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'all': return 'All Status';
      case 'passed': return 'Passed';
      case 'failed': return 'Failed';
      case 'running': return 'Running';
      case 'pending': return 'Pending';
      case 'skipped': return 'Skipped';
      default: return 'All Status';
    }
  };

  if (loading && testSuites.length === 0) {
    return (
      <aside className={styles.infoPanel}>
        <div className={styles.infoPanelContent}>
          <div style={{textAlign: 'center', padding: '40px 20px'}}>
            <Spinner size="large" />
            <Text as="p" block style={{marginTop: '16px', color: tokens.colorNeutralForeground3}}>
              Loading test data...
            </Text>
          </div>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={styles.infoPanel}>
        <div className={styles.infoPanelContent}>
          <div style={{textAlign: 'center', padding: '40px 20px'}}>
            <ErrorCircle24Regular style={{color: tokens.colorPaletteRedForeground1, fontSize: '48px'}} />
            <Text as="p" block style={{marginTop: '16px', color: tokens.colorPaletteRedForeground1}}>
              Error loading test data
            </Text>
            <Text as="p" block size={200} style={{marginTop: '8px', color: tokens.colorNeutralForeground3}}>
              {error}
            </Text>
            <Button 
              appearance="outline" 
              style={{marginTop: '16px'}}
              onClick={loadTestSuites}
            >
              Retry
            </Button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.infoPanel}>
      <div className={styles.infoPanelContent}>
        <div style={{textAlign: 'center', flexShrink: 0}}>
          <Avatar 
            size={56} 
            style={{backgroundColor: tokens.colorBrandBackground, color: tokens.colorNeutralForegroundOnBrand}} 
            icon={<DocumentText24Regular />} 
          />
          <Text as="h2" block size={600} weight="bold" style={{marginTop: '16px'}}>
            Test Execution
          </Text>
          <Text as="p" block size={300} style={{color: tokens.colorNeutralForeground3, marginTop: '4px'}}>
            Monitor test suites, cases, and steps in real-time
          </Text>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexShrink: 0}}>
          <div>
            <Text as="p" block size={200} style={{color: tokens.colorNeutralForeground4, textTransform: 'uppercase'}}>Total Suites</Text>
            <Text as="p" block size={500} weight="semibold">{stats?.totalSuites || testSuites.length}</Text>
          </div>
          <div>
            <Text as="p" block size={200} style={{color: tokens.colorNeutralForeground4, textTransform: 'uppercase'}}>Running</Text>
            <Text as="p" block size={500} weight="semibold">
              {stats?.running?.suites || testSuites.filter(s => s.status === 'running').length}
            </Text>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className={styles.filterContainer}>
          <div style={{display: 'flex', gap: spacing.sm, marginBottom: spacing.md}}>
            <div style={{flex: 1, position: 'relative'}}>
              <Search24Regular style={{
                position: 'absolute',
                left: spacing.sm,
                top: '50%',
                transform: 'translateY(-50%)',
                color: tokens.colorNeutralForeground3,
                fontSize: '16px'
              }} />
              <Input
                placeholder="Search test suites, cases..."
                value={searchQuery}
                onChange={(e, data) => setSearchQuery(data.value)}
                style={{paddingLeft: '36px'}}
                size="small"
              />
            </div>
            <Button
              appearance="outline"
              size="small"
              icon={<Filter24Regular />}
              onClick={clearFilters}
              disabled={!searchQuery && statusFilter === 'all' && tagFilter === 'all'}
            >
              Clear
            </Button>
          </div>
          
          <div style={{display: 'flex', gap: spacing.sm}}>
            <Menu>
              <MenuTrigger>
                <Button appearance="outline" size="small" icon={<ChevronDown24Regular />}>
                  {getStatusLabel(statusFilter)}
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => setStatusFilter('all')}>All Status</MenuItem>
                  <MenuItem onClick={() => setStatusFilter('passed')}>Passed</MenuItem>
                  <MenuItem onClick={() => setStatusFilter('failed')}>Failed</MenuItem>
                  <MenuItem onClick={() => setStatusFilter('running')}>Running</MenuItem>
                  <MenuItem onClick={() => setStatusFilter('pending')}>Pending</MenuItem>
                  <MenuItem onClick={() => setStatusFilter('skipped')}>Skipped</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
            
            <Menu>
              <MenuTrigger>
                <Button appearance="outline" size="small" icon={<ChevronDown24Regular />}>
                  {tagFilter === 'all' ? 'All Tags' : tagFilter}
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => setTagFilter('all')}>All Tags</MenuItem>
                  {allTags.map(tag => (
                    <MenuItem key={tag} onClick={() => setTagFilter(tag)}>{tag}</MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>

        {filteredTestSuites.length === 0 ? (
          <div className={styles.infoCard} style={{flexShrink: 0}}>
            <div style={{textAlign: 'center', padding: '40px 20px'}}>
              <DocumentText24Regular style={{color: tokens.colorNeutralForeground3, fontSize: '48px'}} />
              <Text as="p" block style={{marginTop: '16px', color: tokens.colorNeutralForeground3}}>
                {testSuites.length === 0 ? 'No test suites found' : 'No test suites match your filters'}
              </Text>
              <Text as="p" block size={200} style={{marginTop: '8px', color: tokens.colorNeutralForeground4}}>
                {testSuites.length === 0 ? 'Create your first test suite to get started' : 'Try adjusting your search or filter criteria'}
              </Text>
            </div>
          </div>
        ) : (
          <div className={styles.testTreeContainer}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0}}>
              <Text as="h3" block size={400} weight="semibold">
                Test Suites ({filteredTestSuites.length})
              </Text>
              {loading && <Spinner size="tiny" />}
            </div>
            
            <Tree>
              {filteredTestSuites.map(suite => {
                const suiteStats = getSuiteStats(suite);
                const isExpanded = expandedSuites.has(suite.id);
                
                return (
                  <TreeItem 
                    key={suite.id} 
                    itemType="branch"
                    open={isExpanded}
                    onOpenChange={() => toggleSuite(suite.id)}
                  >
                    <TreeItemLayout>
                      <div className={styles.treeItemContent}>
                        <div className={styles.treeItemHeader}>
                          {getStatusIcon(suite.status)}
                          <div className={styles.treeItemInfo}>
                            <Text weight="semibold" style={{color: getStatusColor(suite.status)}}>
                              {suite.name}
                            </Text>
                            <Text size={200} style={{color: tokens.colorNeutralForeground3}}>
                              {suite.description}
                            </Text>
                          </div>
                          <div className={styles.treeItemStats}>
                            <Text size={200} style={{color: tokens.colorNeutralForeground3}}>
                              {suiteStats.passed}/{suiteStats.total}
                            </Text>
                            <Text size={200} style={{color: tokens.colorNeutralForeground3}}>
                              {formatDuration(suite.duration)}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </TreeItemLayout>
                    
                    {isExpanded && (
                      <Tree>
                        {suite.testCases.map(testCase => {
                          const caseStats = getCaseStats(testCase);
                          const isCaseExpanded = expandedCases.has(testCase.id);
                          
                          return (
                            <TreeItem 
                              key={testCase.id} 
                              itemType="branch"
                              open={isCaseExpanded}
                              onOpenChange={() => toggleCase(testCase.id)}
                            >
                              <TreeItemLayout>
                                <div className={styles.treeItemContent}>
                                  <div className={styles.treeItemHeader}>
                                    {getStatusIcon(testCase.status)}
                                    <div className={styles.treeItemInfo}>
                                      <Text weight="semibold" style={{color: getStatusColor(testCase.status)}}>
                                        {testCase.name}
                                      </Text>
                                      <Text size={200} style={{color: tokens.colorNeutralForeground3}}>
                                        {testCase.description}
                                      </Text>
                                    </div>
                                    <div className={styles.treeItemStats}>
                                      <Text size={200} style={{color: tokens.colorNeutralForeground3}}>
                                        {caseStats.passed}/{caseStats.total}
                                      </Text>
                                      <Text size={200} style={{color: tokens.colorNeutralForeground3}}>
                                        {formatDuration(testCase.duration)}
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                              </TreeItemLayout>
                              
                              {isCaseExpanded && (
                                <Tree>
                                  {testCase.steps.map(step => (
                                    <TreeItem key={step.id} itemType="leaf">
                                      <TreeItemLayout>
                                        <div className={styles.treeItemContent}>
                                          <div className={styles.treeItemHeader}>
                                            {getStatusIcon(step.status)}
                                            <div className={styles.treeItemInfo}>
                                              <Text style={{color: getStatusColor(step.status)}}>
                                                {step.description}
                                              </Text>
                                              {step.errorMessage && (
                                                <Text size={200} style={{color: tokens.colorPaletteRedForeground1}}>
                                                  {step.errorMessage}
                                                </Text>
                                              )}
                                            </div>
                                            <div className={styles.treeItemStats}>
                                              <Text size={200} style={{color: tokens.colorNeutralForeground3}}>
                                                {formatDuration(step.duration)}
                                              </Text>
                                            </div>
                                          </div>
                                        </div>
                                      </TreeItemLayout>
                                    </TreeItem>
                                  ))}
                                </Tree>
                              )}
                            </TreeItem>
                          );
                        })}
                      </Tree>
                    )}
                  </TreeItem>
                );
              })}
            </Tree>
          </div>
        )}

        <div className={styles.infoCard} style={{flexShrink: 0}}>
          <CardHeader header={<Text weight="semibold">Test Execution Status</Text>} />
          <Text as="p" block>• <span style={{color: tokens.colorPaletteGreenForeground1}}>Passed</span> - All assertions successful</Text>
          <Text as="p" block>• <span style={{color: tokens.colorPaletteRedForeground1}}>Failed</span> - One or more assertions failed</Text>
          <Text as="p" block>• <span style={{color: tokens.colorPaletteBlueForeground1}}>Running</span> - Currently executing</Text>
          <Text as="p" block>• <span style={{color: tokens.colorNeutralForeground3}}>Pending</span> - Queued for execution</Text>
        </div>

        <Link href="#" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecorationLine: 'none', flexShrink: 0}}>
          <Text weight="semibold" style={{color: tokens.colorBrandForeground1}}>View detailed test report</Text>
          <ChevronRight24Regular style={{color: tokens.colorBrandForeground1}} />
        </Link>
      </div>
    </aside>
  );
};

export default InfoPanel;
