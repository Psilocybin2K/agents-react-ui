/**
 * @typedef {Object} Message
 * @property {string} id - Unique message ID
 * @property {('user'|'assistant')} role - Who authored the message
 * @property {string} content - Text content
 * @property {string} createdAt - ISO timestamp
 * @property {number} [tokenCount] - Optional token count metadata
 */

/**
 * @typedef {Object} AgentSelection
 * @property {string[]} agentIds - Array of selected agent IDs
 * @property {boolean} mergeResponses - Whether to merge responses into single message
 */

/**
 * @typedef {Object} AgentResponse
 * @property {string} agentId - ID of the agent that generated this response
 * @property {string} agentName - Name of the agent
 * @property {string} content - Raw response content from the agent
 * @property {boolean} success - Whether the agent response was successful
 */

/**
 * @typedef {Object} MultiAgentResponse
 * @property {string} id - Unique response ID
 * @property {string} agentId - Agent that generated this response
 * @property {string} content - Response content
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @typedef {Object} Chat
 * @property {string} id - Unique chat ID
 * @property {string} title - Chat title
 * @property {boolean} pinned - Whether chat is pinned
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp (used for recency sorting)
 * @property {Message[]} messages - Ordered messages in this chat
 * @property {AgentSelection=} agentSelection - Current agent selection for this chat
 */

/**
 * @typedef {Object} Agent
 * @property {string} id - Unique agent ID
 * @property {string} name - Human readable name
 * @property {string=} description - Optional description
 * @property {string=} instructions - Optional system instructions
 * @property {string=} prompt - Optional default prompt
 * @property {number} createdAt - Epoch millis when created
 * @property {number} updatedAt - Epoch millis when last updated
 */


/**
 * @typedef {Object} Prompt
 * @property {string} id - Unique prompt ID
 * @property {string} name - Human readable name
 * @property {string=} description - Optional description
 * @property {string} content - Prompt body/template
 * @property {{ name: string; description?: string; required?: boolean; example?: string }[]=} variables - Optional variable schema
 * @property {string[]=} tags - Optional tags for filtering
 * @property {number} createdAt - Epoch millis when created
 * @property {number} updatedAt - Epoch millis when last updated
 */


/**
 * @typedef {Object} DocumentSource
 * @property {string} id - Unique document source ID
 * @property {string} name - Human readable name
 * @property {string=} description - Optional description
 * @property {('text'|'url'|'file')} kind - Source kind
 * @property {string=} content - Present when kind = 'text'
 * @property {string=} url - Present when kind = 'url'
 * @property {{ name: string; size: number; type?: string }=} fileMeta - Present when kind = 'file'
 * @property {string[]=} tags - Optional tags for filtering
 * @property {number} createdAt - Epoch millis when created
 * @property {number} updatedAt - Epoch millis when last updated
 */


/**
 * @typedef {Object} Memory
 * @property {string} id - Unique memory ID
 * @property {string} threadId - Owning chat/thread ID
 * @property {string} title - Short label for the memory
 * @property {string} content - Distilled fact/preference/task
 * @property {('fact'|'preference'|'task'|'other')} kind - Memory classification
 * @property {number} importance - Score 0..1 used for auto-save decisions
 * @property {string[]=} sourceMessageIds - Related message IDs
 * @property {('manual'|'auto')} origin - Creation origin
 * @property {string[]=} tags - Optional tags for filtering
 * @property {number} createdAt - Epoch millis when created
 * @property {number} updatedAt - Epoch millis when last updated
 */

/**
 * @typedef {Object} MemoryGenerationOptions
 * @property {number=} maxCandidates - Max candidate suggestions to return
 * @property {number=} importanceThreshold - Auto-save threshold 0..1
 * @property {number=} windowSize - Number of recent messages to consider
 * @property {boolean=} allowAutoSave - Whether auto-save is permitted
 */

/**
 * @typedef {Object} TestStep
 * @property {string} id - Unique step ID
 * @property {string} description - Step description/action
 * @property {('pending'|'running'|'passed'|'failed'|'skipped')} status - Current status
 * @property {string=} expectedResult - Expected outcome
 * @property {string=} actualResult - Actual outcome (when failed)
 * @property {string=} errorMessage - Error details (when failed)
 * @property {number} duration - Execution time in milliseconds
 * @property {string} createdAt - ISO timestamp
 * @property {string=} completedAt - ISO timestamp when completed
 */

/**
 * @typedef {Object} TestCase
 * @property {string} id - Unique test case ID
 * @property {string} name - Test case name
 * @property {string=} description - Test case description
 * @property {('pending'|'running'|'passed'|'failed'|'skipped')} status - Current status
 * @property {TestStep[]} steps - Ordered test steps
 * @property {number} duration - Total execution time in milliseconds
 * @property {string[]=} tags - Optional tags for filtering
 * @property {string} createdAt - ISO timestamp
 * @property {string=} startedAt - ISO timestamp when execution started
 * @property {string=} completedAt - ISO timestamp when completed
 */

/**
 * @typedef {Object} TestSuite
 * @property {string} id - Unique test suite ID
 * @property {string} name - Test suite name
 * @property {string=} description - Test suite description
 * @property {('pending'|'running'|'passed'|'failed'|'skipped')} status - Current status
 * @property {TestCase[]} testCases - Test cases in this suite
 * @property {number} duration - Total execution time in milliseconds
 * @property {string[]=} tags - Optional tags for filtering
 * @property {string} createdAt - ISO timestamp
 * @property {string=} startedAt - ISO timestamp when execution started
 * @property {string=} completedAt - ISO timestamp when completed
 */

