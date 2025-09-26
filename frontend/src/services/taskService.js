import api from "./api"

/**
 * Task service for API operations using modern patterns
 */
class TaskService {
  // Base API path
  static BASE_PATH = "/tasks"

  /**
   * Build query string from filters object
   */
  #buildQueryString = (filters) => {
    const params = new URLSearchParams()

    // Use Object.entries for cleaner iteration
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value)
      }
    })

    return params.toString()
  }

  /**
   * Generic error handler with better context
   */
  #handleError = (operation, error, id = null) => {
    const context = id ? `${operation} for task ${id}` : operation
    console.error(`TaskService: ${context} failed:`, error)
    throw error
  }

  /**
   * Get all tasks with optional filters
   */
  async getTasks(filters = {}) {
    try {
      const queryString = this.#buildQueryString(filters)
      const url = queryString
        ? `${TaskService.BASE_PATH}?${queryString}`
        : TaskService.BASE_PATH

      const { data } = await api.get(url)
      return data.data
    } catch (error) {
      this.#handleError("Fetching tasks", error)
    }
  }

  /**
   * Validate task ID
   */
  #validateId = (id, operation) => {
    if (!id) {
      throw new Error(`Task ID is required for ${operation}`)
    }
  }

  /**
   * Validate task data
   */
  #validateTaskData = (taskData) => {
    if (!taskData?.title?.trim()) {
      throw new Error("Task title is required")
    }
  }

  /**
   * Get a single task by ID
   */
  async getTask(id) {
    try {
      this.#validateId(id, "fetching")
      const { data } = await api.get(`${TaskService.BASE_PATH}/${id}`)
      return data.data
    } catch (error) {
      this.#handleError("Fetching task", error, id)
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData) {
    try {
      this.#validateTaskData(taskData)
      const { data } = await api.post(TaskService.BASE_PATH, taskData)
      return data.data
    } catch (error) {
      this.#handleError("Creating task", error)
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(id, updates) {
    try {
      this.#validateId(id, "updating")
      const { data } = await api.put(`${TaskService.BASE_PATH}/${id}`, updates)
      return data.data
    } catch (error) {
      this.#handleError("Updating task", error, id)
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id) {
    try {
      this.#validateId(id, "deletion")
      const { data } = await api.delete(`${TaskService.BASE_PATH}/${id}`)
      return data.data
    } catch (error) {
      this.#handleError("Deleting task", error, id)
    }
  }

  /**
   * Update task status (convenience method)
   */
  async updateTaskStatus(id, status) {
    return this.updateTask(id, { status })
  }

  /**
   * Update task priority (convenience method)
   */
  async updateTaskPriority(id, priority) {
    return this.updateTask(id, { priority })
  }

  /**
   * Mark task as completed (convenience method)
   */
  async completeTask(id) {
    return this.updateTaskStatus(id, "completed")
  }

  /**
   * Mark task as in progress (convenience method)
   */
  async startTask(id) {
    return this.updateTaskStatus(id, "in-progress")
  }
}

// Export singleton instance
const taskService = new TaskService()
export default taskService
