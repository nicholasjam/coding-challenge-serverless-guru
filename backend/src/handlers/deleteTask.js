const DynamoDBUtil = require("../utils/dynamodb")
const {
  success,
  validationError,
  notFound,
  internalError,
} = require("../utils/response")

const dynamoDb = new DynamoDBUtil()

/**
 * Lambda handler for deleting a task
 */
exports.handler = async (event) => {
  try {
    console.log("Delete Task - Event:", JSON.stringify(event, null, 2))

    // Extract task ID from path parameters
    const taskId = event.pathParameters?.id

    if (!taskId) {
      return validationError([{ message: "Task ID is required" }])
    }

    console.log("Deleting task with ID:", taskId)

    // Delete task from DynamoDB
    const deletedTask = await dynamoDb.delete(taskId)

    console.log("Task deleted successfully:", deletedTask)

    // Return the deleted task data
    return success({
      message: "Task deleted successfully",
      deletedTask,
    })
  } catch (error) {
    console.error("Error deleting task:", error)

    if (error.message === "Item not found") {
      return notFound("Task")
    }

    return internalError("Failed to delete task")
  }
}
