import api from './api';

/**
 * Task service for API operations
 */
class TaskService {
  /**
   * Get all tasks with optional filters
   */
  async getTasks(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query parameters
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.userId) params.append('userId', filters.userId);
      
      const queryString = params.toString();
      const url = queryString ? `/tasks?${queryString}` : '/tasks';
      
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  /**
   * Get a single task by ID
   */
  async getTask(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData) {
    try {
      // Validate required fields
      if (!taskData.title) {
        throw new Error('Task title is required');
      }

      const response = await api.post('/tasks', taskData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(id, updates) {
    try {
      if (!id) {
        throw new Error('Task ID is required for update');
      }

      const response = await api.put(`/tasks/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id) {
    try {
      if (!id) {
        throw new Error('Task ID is required for deletion');
      }

      const response = await api.delete(`/tasks/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update task status (convenience method)
   */
  async updateTaskStatus(id, status) {
    return this.updateTask(id, { status });
  }

  /**
   * Update task priority (convenience method)
   */
  async updateTaskPriority(id, priority) {
    return this.updateTask(id, { priority });
  }

  /**
   * Mark task as completed (convenience method)
   */
  async completeTask(id) {
    return this.updateTaskStatus(id, 'completed');
  }

  /**
   * Mark task as in progress (convenience method)
   */
  async startTask(id) {
    return this.updateTaskStatus(id, 'in-progress');
  }
}

// Export singleton instance
const taskService = new TaskService();
export default taskService;
