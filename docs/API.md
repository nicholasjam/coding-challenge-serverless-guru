# API Documentation

This document describes the REST API endpoints for the Task Manager application.

## Base URL

- **Development**: `https://your-api-id.execute-api.us-east-1.amazonaws.com/dev`
- **Production**: `https://your-api-id.execute-api.us-east-1.amazonaws.com/prod`

## Authentication

Currently, the API uses a default user system. All tasks are associated with `userId: "default-user"`.

**Note**: AWS Cognito authentication can be implemented for user-specific task management.

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-09-19T12:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": [...],
    "timestamp": "2025-09-19T12:00:00.000Z"
  }
}
```

## Data Models

### Task Object

```json
{
  "id": "string (UUID)",
  "userId": "string",
  "title": "string (required, 1-255 chars)",
  "description": "string (optional, max 1000 chars)",
  "status": "pending | in-progress | completed | cancelled",
  "priority": "low | medium | high | urgent",
  "dueDate": "ISO 8601 date string (optional)",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

## Endpoints

### 1. Get All Tasks

Retrieve all tasks with optional filtering.

**Endpoint**: `GET /tasks`

**Query Parameters**:

- `status` (optional): Filter by task status
- `priority` (optional): Filter by task priority
- `userId` (optional): Filter by user ID (defaults to "default-user")

**Example Request**:

```bash
curl -X GET "https://api-url/tasks?status=pending&priority=high"
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "userId": "default-user",
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation",
        "status": "pending",
        "priority": "high",
        "dueDate": "2025-09-25T10:00:00.000Z",
        "createdAt": "2025-09-19T08:00:00.000Z",
        "updatedAt": "2025-09-19T08:00:00.000Z"
      }
    ],
    "count": 1,
    "filters": {
      "userId": "default-user",
      "status": "pending",
      "priority": "high"
    }
  },
  "timestamp": "2025-09-19T12:00:00.000Z"
}
```

### 2. Get Single Task

Retrieve a specific task by ID.

**Endpoint**: `GET /tasks/{id}`

**Path Parameters**:

- `id` (required): Task ID

**Example Request**:

```bash
curl -X GET "https://api-url/tasks/123e4567-e89b-12d3-a456-426614174000"
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "default-user",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-09-25T10:00:00.000Z",
    "createdAt": "2025-09-19T08:00:00.000Z",
    "updatedAt": "2025-09-19T08:00:00.000Z"
  },
  "timestamp": "2025-09-19T12:00:00.000Z"
}
```

**Error Response (404)**:

```json
{
  "success": false,
  "error": {
    "message": "Task not found",
    "timestamp": "2025-09-19T12:00:00.000Z"
  }
}
```

### 3. Create Task

Create a new task.

**Endpoint**: `POST /tasks`

**Request Body**:

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "status": "pending | in-progress | completed | cancelled (optional, default: pending)",
  "priority": "low | medium | high | urgent (optional, default: medium)",
  "dueDate": "ISO 8601 date string (optional)"
}
```

**Example Request**:

```bash
curl -X POST "https://api-url/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "high",
    "dueDate": "2025-09-25T10:00:00.000Z"
  }'
```

**Example Response (201)**:

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "userId": "default-user",
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-09-25T10:00:00.000Z",
    "createdAt": "2025-09-19T12:00:00.000Z",
    "updatedAt": "2025-09-19T12:00:00.000Z"
  },
  "timestamp": "2025-09-19T12:00:00.000Z"
}
```

**Validation Error (400)**:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "\"title\" is required",
        "value": ""
      }
    ],
    "timestamp": "2025-09-19T12:00:00.000Z"
  }
}
```

### 4. Update Task

Update an existing task.

**Endpoint**: `PUT /tasks/{id}`

**Path Parameters**:

- `id` (required): Task ID

**Request Body**:

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "pending | in-progress | completed | cancelled (optional)",
  "priority": "low | medium | high | urgent (optional)",
  "dueDate": "ISO 8601 date string (optional)"
}
```

**Example Request**:

```bash
curl -X PUT "https://api-url/tasks/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "priority": "medium"
  }'
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "default-user",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "completed",
    "priority": "medium",
    "dueDate": "2025-09-25T10:00:00.000Z",
    "createdAt": "2025-09-19T08:00:00.000Z",
    "updatedAt": "2025-09-19T12:30:00.000Z"
  },
  "timestamp": "2025-09-19T12:30:00.000Z"
}
```

### 5. Delete Task

Delete a task.

**Endpoint**: `DELETE /tasks/{id}`

**Path Parameters**:

- `id` (required): Task ID

**Example Request**:

```bash
curl -X DELETE "https://api-url/tasks/123e4567-e89b-12d3-a456-426614174000"
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully",
    "deletedTask": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "default-user",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "completed",
      "priority": "medium",
      "dueDate": "2025-09-25T10:00:00.000Z",
      "createdAt": "2025-09-19T08:00:00.000Z",
      "updatedAt": "2025-09-19T12:30:00.000Z"
    }
  },
  "timestamp": "2025-09-19T12:30:00.000Z"
}
```

## HTTP Status Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| 200         | OK - Request successful                 |
| 201         | Created - Resource created successfully |
| 400         | Bad Request - Invalid request data      |
| 404         | Not Found - Resource not found          |
| 500         | Internal Server Error - Server error    |

## Error Handling

### Validation Errors

When request data fails validation, the API returns a 400 status with detailed error information:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "\"title\" must be between 1 and 255 characters",
        "value": ""
      },
      {
        "field": "priority",
        "message": "\"priority\" must be one of [low, medium, high, urgent]",
        "value": "invalid"
      }
    ],
    "timestamp": "2025-09-19T12:00:00.000Z"
  }
}
```

### Server Errors

For internal server errors, the API returns a 500 status:

```json
{
  "success": false,
  "error": {
    "message": "Internal server error",
    "timestamp": "2025-09-19T12:00:00.000Z"
  }
}
```

## Rate Limiting

The API implements rate limiting through AWS API Gateway:

- **Burst Limit**: 200 requests per second
- **Rate Limit**: 100 requests per second sustained
- **Quota**: 10,000 requests per day (configurable)

When rate limits are exceeded, the API returns a 429 status code.

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all endpoints with the following configuration:

- **Allowed Origins**: `*` (all origins)
- **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Allowed Headers**: `Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent`

## Examples

### JavaScript/Axios

```javascript
import axios from "axios"

const API_BASE_URL =
  "https://your-api-url.execute-api.us-east-1.amazonaws.com/dev"

// Get all tasks
const getTasks = async () => {
  const response = await axios.get(`${API_BASE_URL}/tasks`)
  return response.data.data
}

// Create task
const createTask = async (taskData) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, taskData)
  return response.data.data
}

// Update task
const updateTask = async (id, updates) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, updates)
  return response.data.data
}

// Delete task
const deleteTask = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`)
  return response.data.data
}
```

### Python/Requests

```python
import requests

API_BASE_URL = 'https://your-api-url.execute-api.us-east-1.amazonaws.com/dev'

# Get all tasks
def get_tasks():
    response = requests.get(f'{API_BASE_URL}/tasks')
    return response.json()['data']

# Create task
def create_task(task_data):
    response = requests.post(f'{API_BASE_URL}/tasks', json=task_data)
    return response.json()['data']

# Update task
def update_task(task_id, updates):
    response = requests.put(f'{API_BASE_URL}/tasks/{task_id}', json=updates)
    return response.json()['data']

# Delete task
def delete_task(task_id):
    response = requests.delete(f'{API_BASE_URL}/tasks/{task_id}')
    return response.json()['data']
```

## Testing the API

### Using curl

```bash
# Test API health
curl -X GET "https://your-api-url/tasks"

# Create a test task
curl -X POST "https://your-api-url/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "priority": "high"
  }'

# Update the task
curl -X PUT "https://your-api-url/tasks/TASK_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'

# Delete the task
curl -X DELETE "https://your-api-url/tasks/TASK_ID"
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables for the base URL
3. Create requests for each endpoint
4. Test with various payloads and scenarios

## Monitoring and Logging

### CloudWatch Logs

All API requests and responses are logged to AWS CloudWatch. Log groups are created automatically:

- `/aws/lambda/task-manager-backend-dev-createTask`
- `/aws/lambda/task-manager-backend-dev-getTasks`
- `/aws/lambda/task-manager-backend-dev-getTask`
- `/aws/lambda/task-manager-backend-dev-updateTask`
- `/aws/lambda/task-manager-backend-dev-deleteTask`

### API Gateway Metrics

Monitor API performance through AWS CloudWatch metrics:

- Request count
- Latency (average, p95, p99)
- Error rates (4xx, 5xx)
- Cache hit/miss rates

### Custom Metrics

The API includes structured logging for monitoring:

```json
{
  "timestamp": "2025-09-19T12:00:00.000Z",
  "level": "INFO",
  "message": "Task created successfully",
  "taskId": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "default-user",
  "requestId": "abc123-def456-ghi789"
}
```
