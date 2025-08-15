import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  listTestSuites, 
  getTestSuite, 
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
import { ensureTestData } from './seed';

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TEST_SUITES: 'SET_TEST_SUITES',
  ADD_TEST_SUITE: 'ADD_TEST_SUITE',
  UPDATE_TEST_SUITE: 'UPDATE_TEST_SUITE',
  DELETE_TEST_SUITE: 'DELETE_TEST_SUITE',
  UPDATE_TEST_CASE: 'UPDATE_TEST_CASE',
  ADD_TEST_CASE: 'ADD_TEST_CASE',
  DELETE_TEST_CASE: 'DELETE_TEST_CASE',
  UPDATE_TEST_STEP: 'UPDATE_TEST_STEP',
  ADD_TEST_STEP: 'ADD_TEST_STEP',
  DELETE_TEST_STEP: 'DELETE_TEST_STEP',
  SET_STATS: 'SET_STATS',
};

// Initial state
const initialState = {
  testSuites: [],
  loading: false,
  error: null,
  stats: null,
  lastUpdated: null,
};

// Reducer
function testReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.SET_TEST_SUITES:
      return { 
        ...state, 
        testSuites: action.payload, 
        loading: false, 
        error: null,
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.ADD_TEST_SUITE:
      return {
        ...state,
        testSuites: [...state.testSuites, action.payload],
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.UPDATE_TEST_SUITE:
      return {
        ...state,
        testSuites: state.testSuites.map(suite => 
          suite.id === action.payload.id ? action.payload : suite
        ),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.DELETE_TEST_SUITE:
      return {
        ...state,
        testSuites: state.testSuites.filter(suite => suite.id !== action.payload),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.ADD_TEST_CASE:
      return {
        ...state,
        testSuites: state.testSuites.map(suite => {
          if (suite.id === action.payload.suiteId) {
            return {
              ...suite,
              testCases: [...suite.testCases, action.payload.testCase]
            };
          }
          return suite;
        }),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.UPDATE_TEST_CASE:
      return {
        ...state,
        testSuites: state.testSuites.map(suite => {
          if (suite.id === action.payload.suiteId) {
            return {
              ...suite,
              testCases: suite.testCases.map(testCase => 
                testCase.id === action.payload.testCase.id ? action.payload.testCase : testCase
              )
            };
          }
          return suite;
        }),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.DELETE_TEST_CASE:
      return {
        ...state,
        testSuites: state.testSuites.map(suite => {
          if (suite.id === action.payload.suiteId) {
            return {
              ...suite,
              testCases: suite.testCases.filter(testCase => testCase.id !== action.payload.caseId)
            };
          }
          return suite;
        }),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.ADD_TEST_STEP:
      return {
        ...state,
        testSuites: state.testSuites.map(suite => {
          if (suite.id === action.payload.suiteId) {
            return {
              ...suite,
              testCases: suite.testCases.map(testCase => {
                if (testCase.id === action.payload.caseId) {
                  return {
                    ...testCase,
                    steps: [...testCase.steps, action.payload.step]
                  };
                }
                return testCase;
              })
            };
          }
          return suite;
        }),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.UPDATE_TEST_STEP:
      return {
        ...state,
        testSuites: state.testSuites.map(suite => {
          if (suite.id === action.payload.suiteId) {
            return {
              ...suite,
              testCases: suite.testCases.map(testCase => {
                if (testCase.id === action.payload.caseId) {
                  return {
                    ...testCase,
                    steps: testCase.steps.map(step => 
                      step.id === action.payload.step.id ? action.payload.step : step
                    )
                  };
                }
                return testCase;
              })
            };
          }
          return suite;
        }),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.DELETE_TEST_STEP:
      return {
        ...state,
        testSuites: state.testSuites.map(suite => {
          if (suite.id === action.payload.suiteId) {
            return {
              ...suite,
              testCases: suite.testCases.map(testCase => {
                if (testCase.id === action.payload.caseId) {
                  return {
                    ...testCase,
                    steps: testCase.steps.filter(step => step.id !== action.payload.stepId)
                  };
                }
                return testCase;
              })
            };
          }
          return suite;
        }),
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload,
        lastUpdated: new Date().toISOString()
      };
    
    default:
      return state;
  }
}

// Context
const TestContext = createContext();

// Provider component
export function TestProvider({ children }) {
  const [state, dispatch] = useReducer(testReducer, initialState);

  // Load test suites on mount
  useEffect(() => {
    loadTestSuites();
  }, []);

  // Load test suites
  const loadTestSuites = useCallback(async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      // Ensure we have sample data if none exists
      await ensureTestData();
      
      const suites = await listTestSuites();
      dispatch({ type: ACTIONS.SET_TEST_SUITES, payload: suites });
      
      // Load stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Create test suite
  const createSuite = useCallback(async (input) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const suite = await createTestSuite(input);
      dispatch({ type: ACTIONS.ADD_TEST_SUITE, payload: suite });
      
      // Update stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
      
      return suite;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Update test suite
  const updateSuite = useCallback(async (suiteId, updates) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const suite = await updateTestSuite(suiteId, updates);
      dispatch({ type: ACTIONS.UPDATE_TEST_SUITE, payload: suite });
      
      // Update stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
      
      return suite;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Delete test suite
  const deleteSuite = useCallback(async (suiteId) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      await deleteTestSuite(suiteId);
      dispatch({ type: ACTIONS.DELETE_TEST_SUITE, payload: suiteId });
      
      // Update stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Create test case
  const createCase = useCallback(async (suiteId, input) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const testCase = await createTestCase(suiteId, input);
      dispatch({ 
        type: ACTIONS.ADD_TEST_CASE, 
        payload: { suiteId, testCase } 
      });
      
      // Update stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
      
      return testCase;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Update test case
  const updateCase = useCallback(async (suiteId, caseId, updates) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const testCase = await updateTestCase(suiteId, caseId, updates);
      dispatch({ 
        type: ACTIONS.UPDATE_TEST_CASE, 
        payload: { suiteId, testCase } 
      });
      
      // Update stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
      
      return testCase;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Delete test case
  const deleteCase = useCallback(async (suiteId, caseId) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      await deleteTestCase(suiteId, caseId);
      dispatch({ 
        type: ACTIONS.DELETE_TEST_CASE, 
        payload: { suiteId, caseId } 
      });
      
      // Update stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Create test step
  const createStep = useCallback(async (suiteId, caseId, input) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const step = await createTestStep(suiteId, caseId, input);
      dispatch({ 
        type: ACTIONS.ADD_TEST_STEP, 
        payload: { suiteId, caseId, step } 
      });
      
      // Update stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
      
      return step;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Update test step
  const updateStep = useCallback(async (suiteId, caseId, stepId, updates) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const step = await updateTestStep(suiteId, caseId, stepId, updates);
      dispatch({ 
        type: ACTIONS.UPDATE_TEST_STEP, 
        payload: { suiteId, caseId, step } 
      });
      
      // Update stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
      
      return step;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Delete test step
  const deleteStep = useCallback(async (suiteId, caseId, stepId) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      await deleteTestStep(suiteId, caseId, stepId);
      dispatch({ 
        type: ACTIONS.DELETE_TEST_STEP, 
        payload: { suiteId, caseId, stepId } 
      });
      
      // Update stats
      const stats = await getTestStats();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  }, []);

  const value = {
    // State
    testSuites: state.testSuites,
    loading: state.loading,
    error: state.error,
    stats: state.stats,
    lastUpdated: state.lastUpdated,
    
    // Actions
    loadTestSuites,
    createSuite,
    updateSuite,
    deleteSuite,
    createCase,
    updateCase,
    deleteCase,
    createStep,
    updateStep,
    deleteStep,
    clearError,
  };

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
}

// Hook to use test store
export function useTests() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTests must be used within a TestProvider');
  }
  return context;
}
