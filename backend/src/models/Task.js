const Joi = require("joi")

// Task data model with validation schema

class Task {
  constructor(data) {
    this.id = data.id
    this.userId = data.userId || "default-user" // For now, using default user
    this.title = data.title
    this.description = data.description
    this.status = data.status || "pending"
    this.priority = data.priority || "medium"
    this.dueDate = data.dueDate
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }

  // Validation schema for creating a new task

  static get createSchema() {
    return Joi.object({
      title: Joi.string().required().min(1).max(255).trim(),
      description: Joi.string().allow("").max(1000).trim(),
      status: Joi.string()
        .valid("pending", "in-progress", "completed", "cancelled")
        .default("pending"),
      priority: Joi.string()
        .valid("low", "medium", "high", "urgent")
        .default("medium"),
      dueDate: Joi.date().iso().allow(null).optional(),
      userId: Joi.string().optional(),
    })
  }

  // Validation schema for updating a task

  static get updateSchema() {
    return Joi.object({
      title: Joi.string().min(1).max(255).trim().optional(),
      description: Joi.string().allow("").max(1000).trim().optional(),
      status: Joi.string()
        .valid("pending", "in-progress", "completed", "cancelled")
        .optional(),
      priority: Joi.string()
        .valid("low", "medium", "high", "urgent")
        .optional(),
      dueDate: Joi.date().iso().allow(null).optional(),
    })
  }

  //  Convert task instance to DynamoDB item format

  toDynamoItem() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  // Create Task instance from DynamoDB item
  static fromDynamoItem(item) {
    return new Task(item)
  }

  // Validate task data for creation

  static validateCreate(data) {
    return this.createSchema.validate(data, { abortEarly: false })
  }

  // Validate task data for update

  static validateUpdate(data) {
    return this.updateSchema.validate(data, { abortEarly: false })
  }

  // Update task properties

  update(updates) {
    const allowedUpdates = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
    ]

    // Use object destructuring and filtering for cleaner code
    const validUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedUpdates.includes(key))
    )

    // Apply updates using object spread
    Object.assign(this, validUpdates)
    this.updatedAt = new Date().toISOString()
  }
}

module.exports = Task
