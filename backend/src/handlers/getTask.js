const DynamoDBUtil = require("../utils/dynamodb")
const {
  success,
  notFound,
  internalError,
  validationError,
} = require("../utils/response")

const dynamoDb = new DynamoDBUtil()

/**
 * Lambda handler for getting a single task by ID
 */
exports.handler = async (event) => {
  try {
    console.log("Get Task - Event:", JSON.stringify(event, null, 2))

    // Extract task ID from path parameters
    const taskId = event.pathParameters?.id

    if (!taskId) {
      return validationError([{ message: "Task ID is required" }])
    }

    console.log("Fetching task with ID:", taskId)

    // Get task from DynamoDB
    const task = await dynamoDb.getById(taskId)

    if (!task) {
      console.log("Task not found:", taskId)
      return notFound("Task")
    }

    console.log("Task found:", task)

    return success(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    return internalError("Failed to fetch task")
  }
}
