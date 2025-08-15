import { seedTestData as seedStorageData } from './storage';

/**
 * Sample test data for demonstration
 */
const sampleTestData = {
  testSuites: [
    {
      id: 'suite-auth-001',
      name: 'Authentication Tests',
      description: 'Comprehensive tests for user authentication flows',
      status: 'passed',
      duration: 4500,
      tags: ['auth', 'critical', 'security'],
      createdAt: '2024-01-15T10:00:00Z',
      startedAt: '2024-01-15T10:05:00Z',
      completedAt: '2024-01-15T10:05:04.5Z',
      testCases: [
        {
          id: 'case-login-001',
          name: 'User Login - Valid Credentials',
          description: 'Test successful user login with valid email and password',
          status: 'passed',
          duration: 1200,
          tags: ['login', 'positive'],
          createdAt: '2024-01-15T10:00:00Z',
          startedAt: '2024-01-15T10:05:00Z',
          completedAt: '2024-01-15T10:05:01.2Z',
          steps: [
            {
              id: 'step-nav-001',
              description: 'Navigate to login page',
              status: 'passed',
              duration: 300,
              createdAt: '2024-01-15T10:05:00Z',
              completedAt: '2024-01-15T10:05:00.3Z'
            },
            {
              id: 'step-enter-001',
              description: 'Enter valid email address',
              status: 'passed',
              duration: 200,
              createdAt: '2024-01-15T10:05:00.3Z',
              completedAt: '2024-01-15T10:05:00.5Z'
            },
            {
              id: 'step-password-001',
              description: 'Enter valid password',
              status: 'passed',
              duration: 200,
              createdAt: '2024-01-15T10:05:00.5Z',
              completedAt: '2024-01-15T10:05:00.7Z'
            },
            {
              id: 'step-submit-001',
              description: 'Submit login form',
              status: 'passed',
              duration: 500,
              createdAt: '2024-01-15T10:05:00.7Z',
              completedAt: '2024-01-15T10:05:01.2Z'
            }
          ]
        },
        {
          id: 'case-login-002',
          name: 'User Login - Invalid Credentials',
          description: 'Test login behavior with invalid email and password',
          status: 'passed',
          duration: 800,
          tags: ['login', 'negative'],
          createdAt: '2024-01-15T10:00:00Z',
          startedAt: '2024-01-15T10:05:01.2Z',
          completedAt: '2024-01-15T10:05:02.0Z',
          steps: [
            {
              id: 'step-invalid-001',
              description: 'Enter invalid email address',
              status: 'passed',
              duration: 200,
              createdAt: '2024-01-15T10:05:01.2Z',
              completedAt: '2024-01-15T10:05:01.4Z'
            },
            {
              id: 'step-invalid-pwd-001',
              description: 'Enter invalid password',
              status: 'passed',
              duration: 200,
              createdAt: '2024-01-15T10:05:01.4Z',
              completedAt: '2024-01-15T10:05:01.6Z'
            },
            {
              id: 'step-error-001',
              description: 'Verify error message is displayed',
              status: 'passed',
              duration: 400,
              createdAt: '2024-01-15T10:05:01.6Z',
              completedAt: '2024-01-15T10:05:02.0Z'
            }
          ]
        },
        {
          id: 'case-logout-001',
          name: 'User Logout',
          description: 'Test user logout functionality',
          status: 'passed',
          duration: 600,
          tags: ['logout'],
          createdAt: '2024-01-15T10:00:00Z',
          startedAt: '2024-01-15T10:05:02.0Z',
          completedAt: '2024-01-15T10:05:02.6Z',
          steps: [
            {
              id: 'step-menu-001',
              description: 'Click user menu dropdown',
              status: 'passed',
              duration: 200,
              createdAt: '2024-01-15T10:05:02.0Z',
              completedAt: '2024-01-15T10:05:02.2Z'
            },
            {
              id: 'step-logout-btn-001',
              description: 'Click logout button',
              status: 'passed',
              duration: 200,
              createdAt: '2024-01-15T10:05:02.2Z',
              completedAt: '2024-01-15T10:05:02.4Z'
            },
            {
              id: 'step-redirect-001',
              description: 'Verify redirect to login page',
              status: 'passed',
              duration: 200,
              createdAt: '2024-01-15T10:05:02.4Z',
              completedAt: '2024-01-15T10:05:02.6Z'
            }
          ]
        }
      ]
    },
    {
      id: 'suite-api-001',
      name: 'API Integration Tests',
      description: 'Tests for external API integrations and data fetching',
      status: 'running',
      duration: 0,
      tags: ['api', 'integration', 'backend'],
      createdAt: '2024-01-15T10:00:00Z',
      startedAt: '2024-01-15T10:05:04.5Z',
      testCases: [
        {
          id: 'case-api-fetch-001',
          name: 'Data Fetching - User Profile',
          description: 'Test API endpoint for fetching user profile data',
          status: 'running',
          duration: 0,
          tags: ['fetch', 'profile'],
          createdAt: '2024-01-15T10:00:00Z',
          startedAt: '2024-01-15T10:05:04.5Z',
          steps: [
            {
              id: 'step-api-call-001',
              description: 'Make GET request to /api/users/profile',
              status: 'running',
              duration: 0,
              createdAt: '2024-01-15T10:05:04.5Z'
            }
          ]
        },
        {
          id: 'case-api-post-001',
          name: 'Data Submission - User Settings',
          description: 'Test API endpoint for updating user settings',
          status: 'pending',
          duration: 0,
          tags: ['post', 'settings'],
          createdAt: '2024-01-15T10:00:00Z',
          steps: [
            {
              id: 'step-prepare-001',
              description: 'Prepare user settings payload',
              status: 'pending',
              duration: 0,
              createdAt: '2024-01-15T10:00:00Z'
            },
            {
              id: 'step-submit-001',
              description: 'Submit PUT request to /api/users/settings',
              status: 'pending',
              duration: 0,
              createdAt: '2024-01-15T10:00:00Z'
            },
            {
              id: 'step-verify-001',
              description: 'Verify settings are updated in database',
              status: 'pending',
              duration: 0,
              createdAt: '2024-01-15T10:00:00Z'
            }
          ]
        }
      ]
    },
    {
      id: 'suite-ui-001',
      name: 'UI Component Tests',
      description: 'Tests for React component rendering and interactions',
      status: 'failed',
      duration: 3200,
      tags: ['ui', 'components', 'frontend'],
      createdAt: '2024-01-15T10:00:00Z',
      startedAt: '2024-01-15T10:05:04.5Z',
      completedAt: '2024-01-15T10:05:07.7Z',
      testCases: [
        {
          id: 'case-button-001',
          name: 'Button Component - Click Events',
          description: 'Test button component click handling and callbacks',
          status: 'failed',
          duration: 3200,
          tags: ['button', 'events'],
          createdAt: '2024-01-15T10:00:00Z',
          startedAt: '2024-01-15T10:05:04.5Z',
          completedAt: '2024-01-15T10:05:07.7Z',
          steps: [
            {
              id: 'step-render-001',
              description: 'Render button component with onClick handler',
              status: 'passed',
              duration: 200,
              createdAt: '2024-01-15T10:05:04.5Z',
              completedAt: '2024-01-15T10:05:04.7Z'
            },
            {
              id: 'step-click-001',
              description: 'Simulate button click event',
              status: 'failed',
              duration: 3000,
              expectedResult: 'onClick callback should be triggered',
              actualResult: 'No callback function executed',
              errorMessage: 'Button click event not firing - possible event handler binding issue',
              createdAt: '2024-01-15T10:05:04.7Z',
              completedAt: '2024-01-15T10:05:07.7Z'
            }
          ]
        },
        {
          id: 'case-form-001',
          name: 'Form Component - Validation',
          description: 'Test form validation and error message display',
          status: 'passed',
          duration: 1800,
          tags: ['form', 'validation'],
          createdAt: '2024-01-15T10:00:00Z',
          startedAt: '2024-01-15T10:05:07.7Z',
          completedAt: '2024-01-15T10:05:09.5Z',
          steps: [
            {
              id: 'step-form-render-001',
              description: 'Render form component with validation rules',
              status: 'passed',
              duration: 300,
              createdAt: '2024-01-15T10:05:07.7Z',
              completedAt: '2024-01-15T10:05:08.0Z'
            },
            {
              id: 'step-invalid-input-001',
              description: 'Enter invalid data in required fields',
              status: 'passed',
              duration: 500,
              createdAt: '2024-01-15T10:05:08.0Z',
              completedAt: '2024-01-15T10:05:08.5Z'
            },
            {
              id: 'step-submit-invalid-001',
              description: 'Submit form with invalid data',
              status: 'passed',
              duration: 400,
              createdAt: '2024-01-15T10:05:08.5Z',
              completedAt: '2024-01-15T10:05:08.9Z'
            },
            {
              id: 'step-error-display-001',
              description: 'Verify error messages are displayed',
              status: 'passed',
              duration: 600,
              createdAt: '2024-01-15T10:05:08.9Z',
              completedAt: '2024-01-15T10:05:09.5Z'
            }
          ]
        }
      ]
    },
    {
      id: 'suite-perf-001',
      name: 'Performance Tests',
      description: 'Load testing and performance benchmarks',
      status: 'skipped',
      duration: 0,
      tags: ['performance', 'load-testing'],
      createdAt: '2024-01-15T10:00:00Z',
      testCases: [
        {
          id: 'case-load-001',
          name: 'Page Load Performance',
          description: 'Measure page load times under various conditions',
          status: 'skipped',
          duration: 0,
          tags: ['load-time', 'metrics'],
          createdAt: '2024-01-15T10:00:00Z',
          steps: [
            {
              id: 'step-baseline-001',
              description: 'Measure baseline page load time',
              status: 'skipped',
              duration: 0,
              createdAt: '2024-01-15T10:00:00Z'
            },
            {
              id: 'step-stress-001',
              description: 'Test page load under stress conditions',
              status: 'skipped',
              duration: 0,
              createdAt: '2024-01-15T10:00:00Z'
            }
          ]
        }
      ]
    }
  ]
};

/**
 * Seed the test data into storage
 * @returns {Promise<void>}
 */
export const seedTestData = async () => {
  try {
    await seedStorageData(sampleTestData);
    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
};

/**
 * Check if test data exists and seed if needed
 * @returns {Promise<boolean>} - true if data was seeded, false if already exists
 */
export const ensureTestData = async () => {
  try {
    const { getTestData } = await import('./storage');
    const data = await getTestData();
    
    if (data.testSuites && data.testSuites.length > 0) {
      return false; // Data already exists
    }
    
    await seedTestData();
    return true; // Data was seeded
  } catch (error) {
    console.error('Error ensuring test data:', error);
    return false;
  }
};

export default sampleTestData;
