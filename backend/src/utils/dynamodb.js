const AWS = require("aws-sdk")

class DynamoDBUtil {
  constructor() {
    if (process.env.IS_OFFLINE) {
      this.dynamodb = new AWS.DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:8000",
      })
    } else {
      this.dynamodb = new AWS.DynamoDB.DocumentClient({
        region: process.env.REGION || "us-east-1",
      })
    }

    this.tableName = process.env.TASKS_TABLE
  }

  async create(item) {
    const params = {
      TableName: this.tableName,
      Item: item,
      ConditionExpression: "attribute_not_exists(id)",
    }

    try {
      await this.dynamodb.put(params).promise()
      return item
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {
        throw new Error("Item with this ID already exists")
      }
      throw error
    }
  }

  async getById(id) {
    const params = {
      TableName: this.tableName,
      Key: { id },
    }

    try {
      const result = await this.dynamodb.get(params).promise()
      return result.Item || null
    } catch (error) {
      throw error
    }
  }

  async getByUserId(userId, filters = {}) {
    const params = {
      TableName: this.tableName,
      IndexName: "UserIdIndex",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ScanIndexForward: false,
    }
    if (filters.status) {
      params.FilterExpression = "status = :status"
      params.ExpressionAttributeValues[":status"] = filters.status
    }

    if (filters.priority) {
      const filterExpression = params.FilterExpression
        ? `${params.FilterExpression} AND priority = :priority`
        : "priority = :priority"
      params.FilterExpression = filterExpression
      params.ExpressionAttributeValues[":priority"] = filters.priority
    }

    try {
      const result = await this.dynamodb.query(params).promise()
      return result.Items || []
    } catch (error) {
      throw error
    }
  }

  async update(id, updates) {
    const updateExpressions = []
    const expressionAttributeNames = {}
    const expressionAttributeValues = {}

    Object.keys(updates).forEach((key, index) => {
      const attributeName = `#attr${index}`
      const attributeValue = `:val${index}`

      updateExpressions.push(`${attributeName} = ${attributeValue}`)
      expressionAttributeNames[attributeName] = key
      expressionAttributeValues[attributeValue] = updates[key]
    })

    const params = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: "attribute_exists(id)",
      ReturnValues: "ALL_NEW",
    }

    try {
      const result = await this.dynamodb.update(params).promise()
      return result.Attributes
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {
        throw new Error("Item not found")
      }
      throw error
    }
  }

  async delete(id) {
    const params = {
      TableName: this.tableName,
      Key: { id },
      ConditionExpression: "attribute_exists(id)",
      ReturnValues: "ALL_OLD",
    }

    try {
      const result = await this.dynamodb.delete(params).promise()
      return result.Attributes
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {
        throw new Error("Item not found")
      }
      throw error
    }
  }

  async getAll(limit = 50, lastEvaluatedKey = null) {
    const params = {
      TableName: this.tableName,
      Limit: limit,
    }

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey
    }

    try {
      const result = await this.dynamodb.scan(params).promise()
      return {
        items: result.Items || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = DynamoDBUtil
