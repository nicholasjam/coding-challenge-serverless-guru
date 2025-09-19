# Task Manager Backend

A serverless REST API built with AWS Lambda, API Gateway, and DynamoDB using the Serverless Framework.

## Architecture

- **Runtime**: Node.js 18.x
- **Framework**: Serverless Framework
- **Database**: AWS DynamoDB
- **API**: AWS API Gateway (REST)
- **Authentication**: AWS Cognito (optional)

## API Endpoints

| Method | Endpoint      | Description                           |
| ------ | ------------- | ------------------------------------- |
| GET    | `/tasks`      | Get all tasks (with optional filters) |
| GET    | `/tasks/{id}` | Get a specific task by ID             |
| POST   | `/tasks`      | Create a new task                     |
| PUT    | `/tasks/{id}` | Update an existing task               |
| DELETE | `/tasks/{id}` | Delete a task                         |

## Data Model

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

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- Serverless Framework CLI (`npm install -g serverless`)

### Installation

```bash
# Install dependencies
npm install

# Install DynamoDB Local (for development)
npm run dynamodb:install
```

### Development

```bash
# Start DynamoDB Local
npm run dynamodb:start

# Start offline development server
npm run offline
```

### Deployment

```bash
# Deploy to development environment
npm run deploy:dev

# Deploy to production environment
npm run deploy:prod
```

### Environment Variables

- `TASKS_TABLE` - DynamoDB table name (auto-generated)
- `STAGE` - Deployment stage (dev/prod)
- `REGION` - AWS region
- `IS_OFFLINE` - Set when running locally

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Usage Examples

### Create Task

```bash
curl -X POST https://api-url/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task management app",
    "priority": "high",
    "dueDate": "2025-09-25T10:00:00.000Z"
  }'
```

### Get All Tasks

```bash
curl https://api-url/tasks?status=pending&priority=high
```

### Update Task

```bash
curl -X PUT https://api-url/tasks/task-id \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Delete Task

```bash
curl -X DELETE https://api-url/tasks/task-id
```

## Error Handling

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
    "details": [ ... ],
    "timestamp": "2025-09-19T12:00:00.000Z"
  }
}
```

## Monitoring and Logging

- CloudWatch logs are automatically configured
- All Lambda functions include structured logging
- Error tracking and performance monitoring available through AWS X-Ray

## Security

- CORS enabled for cross-origin requests
- Input validation using Joi
- SQL injection protection through DynamoDB
- Rate limiting available through API Gateway

## Performance

- DynamoDB provisioned throughput: 1 RCU/WCU (adjustable)
- Lambda memory: 128MB (adjustable)
- API Gateway caching available
- Global Secondary Index for efficient user queries
