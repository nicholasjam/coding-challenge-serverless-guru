const Task = require("../models/Task")
const DynamoDBUtil = require("../utils/dynamodb")
const {
  success,
  validationError,
  notFound,
  internalError,
} = require("../utils/response")

const dynamoDb = new DynamoDBUtil()

/**
 * Lambda handler for updating a task
 */
exports.handler = async (event) => {
  try {
    console.log("Update Task - Event:", JSON.stringify(event, null, 2))

    // Extract task ID from path parameters
    const taskId = event.pathParameters?.id

    if (!taskId) {
      return validationError([{ message: "Task ID is required" }])
    }

    // Parse request body
    let requestBody
    try {
      requestBody = JSON.parse(event.body || "{}")
    } catch (parseError) {
      return validationError([{ message: "Invalid JSON in request body" }])
    }

    // Validate input data
    const { error, value } = Task.validateUpdate(requestBody)
    if (error) {
      return validationError(error.details)
    }

    // Check if there are any updates to apply
    if (Object.keys(value).length === 0) {
      return validationError([
        { message: "No valid fields provided for update" },
      ])
    }

    console.log("Updating task:", taskId, "with data:", value)

    // Add updatedAt timestamp
    const updateData = {
      ...value,
      updatedAt: new Date().toISOString(),
    }

    // Update task in DynamoDB
    const updatedTask = await dynamoDb.update(taskId, updateData)

    console.log("Task updated successfully:", updatedTask)

    return success(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)

    if (error.message === "Item not found") {
      return notFound("Task")
    }

    return internalError("Failed to update task")
  }
}
