// Jest setup file for backend tests

// Set test environment variables
process.env.TASKS_TABLE = "test-tasks-table"
process.env.STAGE = "test"
process.env.REGION = "us-east-1"
process.env.IS_OFFLINE = "true"

// Mock AWS SDK
jest.mock("aws-sdk", () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      get: jest.fn(),
      put: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
      scan: jest.fn(),
    })),
  },
}))

// Global test utilities
global.createMockEvent = (options = {}) => ({
  body: options.body ? JSON.stringify(options.body) : null,
  pathParameters: options.pathParameters || null,
  queryStringParameters: options.queryStringParameters || null,
  headers: options.headers || {},
  ...options,
})

global.createMockTask = (overrides = {}) => ({
  id: "test-task-id",
  userId: "default-user",
  title: "Test Task",
  description: "Test Description",
  status: "pending",
  priority: "medium",
  dueDate: null,
  createdAt: "2025-09-19T12:00:00.000Z",
  updatedAt: "2025-09-19T12:00:00.000Z",
  ...overrides,
})
