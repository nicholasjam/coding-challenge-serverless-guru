const { handler } = require("../createTask")
const DynamoDBUtil = require("../../utils/dynamodb")

// Mock DynamoDB
jest.mock("../../utils/dynamodb")

describe("createTask Lambda Handler", () => {
  let mockDynamoCreate

  beforeEach(() => {
    mockDynamoCreate = jest.fn()
    DynamoDBUtil.mockImplementation(() => ({
      create: mockDynamoCreate,
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should create a task successfully", async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        title: "Test Task",
        description: "Test Description",
        priority: "high",
      }),
    }

    const expectedTask = {
      id: expect.any(String),
      title: "Test Task",
      description: "Test Description",
      priority: "high",
      status: "pending",
      userId: "default-user",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }

    mockDynamoCreate.mockResolvedValue(expectedTask)

    // Act
    const result = await handler(event)

    // Assert
    expect(result.statusCode).toBe(201)
    expect(JSON.parse(result.body).success).toBe(true)
    expect(JSON.parse(result.body).data).toMatchObject({
      title: "Test Task",
      description: "Test Description",
      priority: "high",
    })
    expect(mockDynamoCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Task",
        description: "Test Description",
        priority: "high",
      })
    )
  })

  it("should return validation error for missing title", async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        description: "Test Description",
      }),
    }

    // Act
    const result = await handler(event)

    // Assert
    expect(result.statusCode).toBe(400)
    expect(JSON.parse(result.body).success).toBe(false)
    expect(JSON.parse(result.body).error.message).toBe("Validation failed")
    expect(mockDynamoCreate).not.toHaveBeenCalled()
  })

  it("should return validation error for invalid JSON", async () => {
    // Arrange
    const event = {
      body: "invalid json",
    }

    // Act
    const result = await handler(event)

    // Assert
    expect(result.statusCode).toBe(400)
    expect(JSON.parse(result.body).success).toBe(false)
    expect(mockDynamoCreate).not.toHaveBeenCalled()
  })

  it("should handle database errors", async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        title: "Test Task",
      }),
    }

    mockDynamoCreate.mockRejectedValue(new Error("Database error"))

    // Act
    const result = await handler(event)

    // Assert
    expect(result.statusCode).toBe(500)
    expect(JSON.parse(result.body).success).toBe(false)
    expect(JSON.parse(result.body).error.message).toBe("Failed to create task")
  })

  it("should handle duplicate ID error", async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        title: "Test Task",
      }),
    }

    const duplicateError = new Error("Item with this ID already exists")
    mockDynamoCreate.mockRejectedValue(duplicateError)

    // Act
    const result = await handler(event)

    // Assert
    expect(result.statusCode).toBe(400)
    expect(JSON.parse(result.body).success).toBe(false)
  })
})
