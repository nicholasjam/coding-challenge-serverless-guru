const { v4: uuidv4 } = require("uuid")
const Task = require("../models/Task")
const DynamoDBUtil = require("../utils/dynamodb")
const { created, validationError, internalError } = require("../utils/response")

const dynamoDb = new DynamoDBUtil()

/**
 * Lambda handler for creating a new task
 */
exports.handler = async (event) => {
  try {
    console.log("Create Task - Event:", JSON.stringify(event, null, 2))

    // Parse request body
    let requestBody
    try {
      requestBody = JSON.parse(event.body || "{}")
    } catch (parseError) {
      return validationError([{ message: "Invalid JSON in request body" }])
    }

    // Validate input data
    const { error, value } = Task.validateCreate(requestBody)
    if (error) {
      return validationError(error.details)
    }

    // Create new task instance
    const taskData = {
      id: uuidv4(),
      ...value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const task = new Task(taskData)

    // Save to DynamoDB
    const savedTask = await dynamoDb.create(task.toDynamoItem())

    console.log("Task created successfully:", savedTask)

    return created(savedTask)
  } catch (error) {
    console.error("Error creating task:", error)

    if (error.message === "Item with this ID already exists") {
      return validationError([{ message: "Task with this ID already exists" }])
    }

    return internalError("Failed to create task")
  }
}
