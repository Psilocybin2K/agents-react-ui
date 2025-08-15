import { 
  listTestSuites, 
  createTestSuite, 
  updateTestSuite, 
  deleteTestSuite,
  createTestCase,
  updateTestCase,
  deleteTestCase,
  createTestStep,
  updateTestStep,
  deleteTestStep,
  getTestStats
} from './index';
import { clearTestData } from './storage';

describe('test service', () => {
  beforeEach(async () => {
    await clearTestData();
  });

  describe('test suites', () => {
    test('listTestSuites returns empty array when no data', async () => {
      const suites = await listTestSuites();
      expect(Array.isArray(suites)).toBe(true);
      expect(suites.length).toBe(0);
    });

    test('createTestSuite creates and persists suite', async () => {
      const suite = await createTestSuite({
        name: 'Test Suite',
        description: 'Test description',
        status: 'pending'
      });

      expect(suite.id).toBeDefined();
      expect(suite.name).toBe('Test Suite');
      expect(suite.description).toBe('Test description');
      expect(suite.status).toBe('pending');
      expect(suite.testCases).toEqual([]);
      expect(suite.createdAt).toBeDefined();
      expect(suite.updatedAt).toBeDefined();

      const suites = await listTestSuites();
      expect(suites.length).toBe(1);
      expect(suites[0].id).toBe(suite.id);
    });

    test('createTestSuite requires name', async () => {
      await expect(createTestSuite({})).rejects.toThrow('Test suite name is required');
      await expect(createTestSuite({ name: '' })).rejects.toThrow('Test suite name is required');
      await expect(createTestSuite({ name: '   ' })).rejects.toThrow('Test suite name is required');
    });

    test('updateTestSuite updates fields', async () => {
      const suite = await createTestSuite({ name: 'Original' });
      const updated = await updateTestSuite(suite.id, { 
        name: 'Updated', 
        description: 'New description',
        status: 'running'
      });

      expect(updated.name).toBe('Updated');
      expect(updated.description).toBe('New description');
      expect(updated.status).toBe('running');
      expect(updated.updatedAt).toBeGreaterThan(suite.updatedAt);

      const suites = await listTestSuites();
      expect(suites[0].name).toBe('Updated');
    });

    test('updateTestSuite throws error for non-existent suite', async () => {
      await expect(updateTestSuite('non-existent', { name: 'Updated' }))
        .rejects.toThrow('Test suite with ID non-existent not found');
    });

    test('deleteTestSuite removes suite', async () => {
      const suite1 = await createTestSuite({ name: 'Suite 1' });
      const suite2 = await createTestSuite({ name: 'Suite 2' });

      await deleteTestSuite(suite1.id);

      const suites = await listTestSuites();
      expect(suites.length).toBe(1);
      expect(suites[0].id).toBe(suite2.id);
    });
  });

  describe('test cases', () => {
    let testSuite;

    beforeEach(async () => {
      testSuite = await createTestSuite({ name: 'Test Suite' });
    });

    test('createTestCase creates case within suite', async () => {
      const testCase = await createTestCase(testSuite.id, {
        name: 'Test Case',
        description: 'Test case description',
        status: 'pending'
      });

      expect(testCase.id).toBeDefined();
      expect(testCase.name).toBe('Test Case');
      expect(testCase.description).toBe('Test case description');
      expect(testCase.status).toBe('pending');
      expect(testCase.steps).toEqual([]);
      expect(testCase.createdAt).toBeDefined();
      expect(testCase.updatedAt).toBeDefined();

      const suites = await listTestSuites();
      const suite = suites.find(s => s.id === testSuite.id);
      expect(suite.testCases.length).toBe(1);
      expect(suite.testCases[0].id).toBe(testCase.id);
    });

    test('createTestCase requires name', async () => {
      await expect(createTestCase(testSuite.id, {})).rejects.toThrow('Test case name is required');
    });

    test('createTestCase throws error for non-existent suite', async () => {
      await expect(createTestCase('non-existent', { name: 'Test Case' }))
        .rejects.toThrow('Test suite with ID non-existent not found');
    });

    test('updateTestCase updates case fields', async () => {
      const testCase = await createTestCase(testSuite.id, { name: 'Original' });
      const updated = await updateTestCase(testSuite.id, testCase.id, {
        name: 'Updated',
        status: 'passed'
      });

      expect(updated.name).toBe('Updated');
      expect(updated.status).toBe('passed');
      expect(updated.updatedAt).toBeGreaterThan(testCase.updatedAt);
    });

    test('deleteTestCase removes case from suite', async () => {
      const case1 = await createTestCase(testSuite.id, { name: 'Case 1' });
      const case2 = await createTestCase(testSuite.id, { name: 'Case 2' });

      await deleteTestCase(testSuite.id, case1.id);

      const suites = await listTestSuites();
      const suite = suites.find(s => s.id === testSuite.id);
      expect(suite.testCases.length).toBe(1);
      expect(suite.testCases[0].id).toBe(case2.id);
    });
  });

  describe('test steps', () => {
    let testSuite;
    let testCase;

    beforeEach(async () => {
      testSuite = await createTestSuite({ name: 'Test Suite' });
      testCase = await createTestCase(testSuite.id, { name: 'Test Case' });
    });

    test('createTestStep creates step within case', async () => {
      const step = await createTestStep(testSuite.id, testCase.id, {
        description: 'Test step',
        status: 'pending'
      });

      expect(step.id).toBeDefined();
      expect(step.description).toBe('Test step');
      expect(step.status).toBe('pending');
      expect(step.duration).toBe(0);
      expect(step.createdAt).toBeDefined();

      const suites = await listTestSuites();
      const suite = suites.find(s => s.id === testSuite.id);
      const case_ = suite.testCases.find(c => c.id === testCase.id);
      expect(case_.steps.length).toBe(1);
      expect(case_.steps[0].id).toBe(step.id);
    });

    test('createTestStep requires description', async () => {
      await expect(createTestStep(testSuite.id, testCase.id, {}))
        .rejects.toThrow('Test step description is required');
    });

    test('updateTestStep updates step fields', async () => {
      const step = await createTestStep(testSuite.id, testCase.id, {
        description: 'Original step'
      });

      const updated = await updateTestStep(testSuite.id, testCase.id, step.id, {
        description: 'Updated step',
        status: 'passed',
        duration: 1000
      });

      expect(updated.description).toBe('Updated step');
      expect(updated.status).toBe('passed');
      expect(updated.duration).toBe(1000);
    });

    test('deleteTestStep removes step from case', async () => {
      const step1 = await createTestStep(testSuite.id, testCase.id, { description: 'Step 1' });
      const step2 = await createTestStep(testSuite.id, testCase.id, { description: 'Step 2' });

      await deleteTestStep(testSuite.id, testCase.id, step1.id);

      const suites = await listTestSuites();
      const suite = suites.find(s => s.id === testSuite.id);
      const case_ = suite.testCases.find(c => c.id === testCase.id);
      expect(case_.steps.length).toBe(1);
      expect(case_.steps[0].id).toBe(step2.id);
    });
  });

  describe('test stats', () => {
    test('getTestStats returns correct statistics', async () => {
      const suite = await createTestSuite({ name: 'Test Suite', status: 'passed' });
      const testCase = await createTestCase(suite.id, { name: 'Test Case', status: 'passed' });
      await createTestStep(suite.id, testCase.id, { description: 'Step 1', status: 'passed' });
      await createTestStep(suite.id, testCase.id, { description: 'Step 2', status: 'failed' });

      const stats = await getTestStats();

      expect(stats.totalSuites).toBe(1);
      expect(stats.totalCases).toBe(1);
      expect(stats.totalSteps).toBe(2);
      expect(stats.passed.suites).toBe(1);
      expect(stats.passed.cases).toBe(1);
      expect(stats.passed.steps).toBe(1);
      expect(stats.failed.steps).toBe(1);
    });
  });
});
