import { v4 as uuidv4 } from 'uuid';
import { getTestData, setTestData } from './storage';

/**
 * List all test suites
 * @returns {Promise<TestSuite[]>}
 */
export const listTestSuites = async () => {
  const data = await getTestData();
  return data.testSuites || [];
};

/**
 * Get a specific test suite by ID
 * @param {string} suiteId - The test suite ID
 * @returns {Promise<TestSuite|null>}
 */
export const getTestSuite = async (suiteId) => {
  const suites = await listTestSuites();
  return suites.find(suite => suite.id === suiteId) || null;
};

/**
 * Create a new test suite
 * @param {Omit<TestSuite, 'id' | 'createdAt' | 'updatedAt'>} input - Test suite data
 * @returns {Promise<TestSuite>}
 */
export const createTestSuite = async (input) => {
  if (!input.name?.trim()) {
    throw new Error('Test suite name is required');
  }

  const now = new Date().toISOString();
  const suite = {
    id: uuidv4(),
    name: input.name.trim(),
    description: input.description?.trim() || '',
    status: input.status || 'pending',
    testCases: input.testCases || [],
    duration: input.duration || 0,
    tags: input.tags || [],
    createdAt: now,
    updatedAt: now,
    startedAt: input.startedAt || null,
    completedAt: input.completedAt || null,
  };

  const data = await getTestData();
  data.testSuites = data.testSuites || [];
  data.testSuites.push(suite);
  await setTestData(data);

  return suite;
};

/**
 * Update a test suite
 * @param {string} suiteId - The test suite ID
 * @param {Partial<TestSuite>} updates - Updates to apply
 * @returns {Promise<TestSuite>}
 */
export const updateTestSuite = async (suiteId, updates) => {
  const data = await getTestData();
  const suiteIndex = data.testSuites?.findIndex(s => s.id === suiteId);
  
  if (suiteIndex === -1 || suiteIndex === undefined) {
    throw new Error(`Test suite with ID ${suiteId} not found`);
  }

  const updatedSuite = {
    ...data.testSuites[suiteIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  data.testSuites[suiteIndex] = updatedSuite;
  await setTestData(data);

  return updatedSuite;
};

/**
 * Delete a test suite
 * @param {string} suiteId - The test suite ID
 * @returns {Promise<void>}
 */
export const deleteTestSuite = async (suiteId) => {
  const data = await getTestData();
  data.testSuites = data.testSuites?.filter(s => s.id !== suiteId) || [];
  await setTestData(data);
};

/**
 * Get a specific test case by ID
 * @param {string} suiteId - The test suite ID
 * @param {string} caseId - The test case ID
 * @returns {Promise<TestCase|null>}
 */
export const getTestCase = async (suiteId, caseId) => {
  const suite = await getTestSuite(suiteId);
  if (!suite) return null;
  
  return suite.testCases.find(testCase => testCase.id === caseId) || null;
};

/**
 * Create a new test case within a suite
 * @param {string} suiteId - The test suite ID
 * @param {Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>} input - Test case data
 * @returns {Promise<TestCase>}
 */
export const createTestCase = async (suiteId, input) => {
  if (!input.name?.trim()) {
    throw new Error('Test case name is required');
  }

  const now = new Date().toISOString();
  const testCase = {
    id: uuidv4(),
    name: input.name.trim(),
    description: input.description?.trim() || '',
    status: input.status || 'pending',
    steps: input.steps || [],
    duration: input.duration || 0,
    tags: input.tags || [],
    createdAt: now,
    updatedAt: now,
    startedAt: input.startedAt || null,
    completedAt: input.completedAt || null,
  };

  const data = await getTestData();
  const suiteIndex = data.testSuites?.findIndex(s => s.id === suiteId);
  
  if (suiteIndex === -1 || suiteIndex === undefined) {
    throw new Error(`Test suite with ID ${suiteId} not found`);
  }

  data.testSuites[suiteIndex].testCases.push(testCase);
  data.testSuites[suiteIndex].updatedAt = now;
  await setTestData(data);

  return testCase;
};

/**
 * Update a test case
 * @param {string} suiteId - The test suite ID
 * @param {string} caseId - The test case ID
 * @param {Partial<TestCase>} updates - Updates to apply
 * @returns {Promise<TestCase>}
 */
export const updateTestCase = async (suiteId, caseId, updates) => {
  const data = await getTestData();
  const suiteIndex = data.testSuites?.findIndex(s => s.id === suiteId);
  
  if (suiteIndex === -1 || suiteIndex === undefined) {
    throw new Error(`Test suite with ID ${suiteId} not found`);
  }

  const caseIndex = data.testSuites[suiteIndex].testCases.findIndex(c => c.id === caseId);
  
  if (caseIndex === -1) {
    throw new Error(`Test case with ID ${caseId} not found`);
  }

  const now = new Date().toISOString();
  const updatedCase = {
    ...data.testSuites[suiteIndex].testCases[caseIndex],
    ...updates,
    updatedAt: now,
  };

  data.testSuites[suiteIndex].testCases[caseIndex] = updatedCase;
  data.testSuites[suiteIndex].updatedAt = now;
  await setTestData(data);

  return updatedCase;
};

/**
 * Delete a test case
 * @param {string} suiteId - The test suite ID
 * @param {string} caseId - The test case ID
 * @returns {Promise<void>}
 */
export const deleteTestCase = async (suiteId, caseId) => {
  const data = await getTestData();
  const suiteIndex = data.testSuites?.findIndex(s => s.id === suiteId);
  
  if (suiteIndex === -1 || suiteIndex === undefined) {
    throw new Error(`Test suite with ID ${suiteId} not found`);
  }

  data.testSuites[suiteIndex].testCases = data.testSuites[suiteIndex].testCases.filter(c => c.id !== caseId);
  data.testSuites[suiteIndex].updatedAt = new Date().toISOString();
  await setTestData(data);
};

/**
 * Get a specific test step by ID
 * @param {string} suiteId - The test suite ID
 * @param {string} caseId - The test case ID
 * @param {string} stepId - The test step ID
 * @returns {Promise<TestStep|null>}
 */
export const getTestStep = async (suiteId, caseId, stepId) => {
  const testCase = await getTestCase(suiteId, caseId);
  if (!testCase) return null;
  
  return testCase.steps.find(step => step.id === stepId) || null;
};

/**
 * Create a new test step within a test case
 * @param {string} suiteId - The test suite ID
 * @param {string} caseId - The test case ID
 * @param {Omit<TestStep, 'id' | 'createdAt'>} input - Test step data
 * @returns {Promise<TestStep>}
 */
export const createTestStep = async (suiteId, caseId, input) => {
  if (!input.description?.trim()) {
    throw new Error('Test step description is required');
  }

  const now = new Date().toISOString();
  const step = {
    id: uuidv4(),
    description: input.description.trim(),
    status: input.status || 'pending',
    expectedResult: input.expectedResult?.trim() || '',
    actualResult: input.actualResult?.trim() || '',
    errorMessage: input.errorMessage?.trim() || '',
    duration: input.duration || 0,
    createdAt: now,
    completedAt: input.completedAt || null,
  };

  const data = await getTestData();
  const suiteIndex = data.testSuites?.findIndex(s => s.id === suiteId);
  
  if (suiteIndex === -1 || suiteIndex === undefined) {
    throw new Error(`Test suite with ID ${suiteId} not found`);
  }

  const caseIndex = data.testSuites[suiteIndex].testCases.findIndex(c => c.id === caseId);
  
  if (caseIndex === -1) {
    throw new Error(`Test case with ID ${caseId} not found`);
  }

  data.testSuites[suiteIndex].testCases[caseIndex].steps.push(step);
  data.testSuites[suiteIndex].testCases[caseIndex].updatedAt = now;
  data.testSuites[suiteIndex].updatedAt = now;
  await setTestData(data);

  return step;
};

/**
 * Update a test step
 * @param {string} suiteId - The test suite ID
 * @param {string} caseId - The test case ID
 * @param {string} stepId - The test step ID
 * @param {Partial<TestStep>} updates - Updates to apply
 * @returns {Promise<TestStep>}
 */
export const updateTestStep = async (suiteId, caseId, stepId, updates) => {
  const data = await getTestData();
  const suiteIndex = data.testSuites?.findIndex(s => s.id === suiteId);
  
  if (suiteIndex === -1 || suiteIndex === undefined) {
    throw new Error(`Test suite with ID ${suiteId} not found`);
  }

  const caseIndex = data.testSuites[suiteIndex].testCases.findIndex(c => c.id === caseId);
  
  if (caseIndex === -1) {
    throw new Error(`Test case with ID ${caseId} not found`);
  }

  const stepIndex = data.testSuites[suiteIndex].testCases[caseIndex].steps.findIndex(s => s.id === stepId);
  
  if (stepIndex === -1) {
    throw new Error(`Test step with ID ${stepId} not found`);
  }

  const now = new Date().toISOString();
  const updatedStep = {
    ...data.testSuites[suiteIndex].testCases[caseIndex].steps[stepIndex],
    ...updates,
  };

  data.testSuites[suiteIndex].testCases[caseIndex].steps[stepIndex] = updatedStep;
  data.testSuites[suiteIndex].testCases[caseIndex].updatedAt = now;
  data.testSuites[suiteIndex].updatedAt = now;
  await setTestData(data);

  return updatedStep;
};

/**
 * Delete a test step
 * @param {string} suiteId - The test suite ID
 * @param {string} caseId - The test case ID
 * @param {string} stepId - The test step ID
 * @returns {Promise<void>}
 */
export const deleteTestStep = async (suiteId, caseId, stepId) => {
  const data = await getTestData();
  const suiteIndex = data.testSuites?.findIndex(s => s.id === suiteId);
  
  if (suiteIndex === -1 || suiteIndex === undefined) {
    throw new Error(`Test suite with ID ${suiteId} not found`);
  }

  const caseIndex = data.testSuites[suiteIndex].testCases.findIndex(c => c.id === caseId);
  
  if (caseIndex === -1) {
    throw new Error(`Test case with ID ${caseId} not found`);
  }

  data.testSuites[suiteIndex].testCases[caseIndex].steps = data.testSuites[suiteIndex].testCases[caseIndex].steps.filter(s => s.id !== stepId);
  data.testSuites[suiteIndex].testCases[caseIndex].updatedAt = new Date().toISOString();
  data.testSuites[suiteIndex].updatedAt = new Date().toISOString();
  await setTestData(data);
};

/**
 * Start test execution for a suite
 * @param {string} suiteId - The test suite ID
 * @returns {Promise<TestSuite>}
 */
export const startTestSuite = async (suiteId) => {
  const now = new Date().toISOString();
  return updateTestSuite(suiteId, {
    status: 'running',
    startedAt: now,
  });
};

/**
 * Complete test execution for a suite
 * @param {string} suiteId - The test suite ID
 * @param {string} finalStatus - The final status ('passed', 'failed', 'skipped')
 * @returns {Promise<TestSuite>}
 */
export const completeTestSuite = async (suiteId, finalStatus) => {
  const now = new Date().toISOString();
  return updateTestSuite(suiteId, {
    status: finalStatus,
    completedAt: now,
  });
};

/**
 * Get test execution statistics
 * @returns {Promise<Object>}
 */
export const getTestStats = async () => {
  const suites = await listTestSuites();
  
  const stats = {
    totalSuites: suites.length,
    totalCases: 0,
    totalSteps: 0,
    passed: { suites: 0, cases: 0, steps: 0 },
    failed: { suites: 0, cases: 0, steps: 0 },
    running: { suites: 0, cases: 0, steps: 0 },
    pending: { suites: 0, cases: 0, steps: 0 },
    skipped: { suites: 0, cases: 0, steps: 0 },
  };

  suites.forEach(suite => {
    stats.totalCases += suite.testCases.length;
    stats[suite.status].suites++;
    
    suite.testCases.forEach(testCase => {
      stats.totalSteps += testCase.steps.length;
      stats[testCase.status].cases++;
      
      testCase.steps.forEach(step => {
        stats[step.status].steps++;
      });
    });
  });

  return stats;
};
