const DynamoDBUtil = require("../utils/dynamodb")
const { success, internalError } = require("../utils/response")

const dynamoDb = new DynamoDBUtil()

/**
 * Lambda handler for getting all tasks for a user
 */
exports.handler = async (event) => {
  try {
    console.log("Get Tasks - Event:", JSON.stringify(event, null, 2))

    // Extract query parameters
    const queryParams = event.queryStringParameters || {}
    const userId = queryParams.userId || "default-user"
    const status = queryParams.status
    const priority = queryParams.priority

    // Build filters
    const filters = {}
    if (status) filters.status = status
    if (priority) filters.priority = priority

    console.log("Fetching tasks for user:", userId, "with filters:", filters)

    // Get tasks from DynamoDB
    const tasks = await dynamoDb.getByUserId(userId, filters)

    console.log(`Found ${tasks.length} tasks for user ${userId}`)

    // Return tasks with metadata
    const response = {
      tasks,
      count: tasks.length,
      filters: {
        userId,
        status,
        priority,
      },
    }

    return success(response)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return internalError("Failed to fetch tasks")
  }
}
