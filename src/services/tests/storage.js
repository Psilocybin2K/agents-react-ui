const STORAGE_KEY = 'test_data_v1';

/**
 * Get test data from localStorage
 * @returns {Promise<Object>}
 */
export const getTestData = async () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { testSuites: [] };
    }
    
    const data = JSON.parse(stored);
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      console.warn('Invalid test data structure, resetting to empty');
      return { testSuites: [] };
    }
    
    if (!Array.isArray(data.testSuites)) {
      data.testSuites = [];
    }
    
    return data;
  } catch (error) {
    console.error('Error reading test data from localStorage:', error);
    return { testSuites: [] };
  }
};

/**
 * Set test data to localStorage
 * @param {Object} data - The test data to store
 * @returns {Promise<void>}
 */
export const setTestData = async (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid test data object');
    }
    
    if (!Array.isArray(data.testSuites)) {
      throw new Error('testSuites must be an array');
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing test data to localStorage:', error);
    throw error;
  }
};

/**
 * Clear all test data from localStorage
 * @returns {Promise<void>}
 */
export const clearTestData = async () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing test data from localStorage:', error);
    throw error;
  }
};

/**
 * Seed test data with initial data (for development/testing)
 * @param {Object} seedData - Initial test data
 * @returns {Promise<void>}
 */
export const seedTestData = async (seedData) => {
  try {
    const existing = await getTestData();
    const merged = {
      testSuites: [...(existing.testSuites || []), ...(seedData.testSuites || [])]
    };
    await setTestData(merged);
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
};

/**
 * Export test data as JSON
 * @returns {Promise<string>}
 */
export const exportTestData = async () => {
  try {
    const data = await getTestData();
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting test data:', error);
    throw error;
  }
};

/**
 * Import test data from JSON
 * @param {string} jsonData - JSON string containing test data
 * @returns {Promise<void>}
 */
export const importTestData = async (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate imported data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON data structure');
    }
    
    if (!Array.isArray(data.testSuites)) {
      throw new Error('Imported data must contain testSuites array');
    }
    
    await setTestData(data);
  } catch (error) {
    console.error('Error importing test data:', error);
    throw error;
  }
};
