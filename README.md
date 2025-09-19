# Full-Stack Task Management Application

A complete serverless full-stack application built with AWS Lambda, DynamoDB, API Gateway, and React. This project demonstrates modern web development practices with a scalable serverless architecture, responsive design, and automated CI/CD pipelines.

## 🎯 Project Overview

This application was built as a comprehensive coding challenge showcasing:

- **Complete CRUD functionality** for task management
- **Serverless backend** with AWS Lambda and DynamoDB
- **Modern React frontend** with Material-UI
- **Responsive design** for all device sizes
- **CI/CD pipelines** with GitHub Actions
- **Infrastructure as Code** with Serverless Framework
- **Comprehensive testing** and documentation

## 🏗️ Architecture

### Backend (Serverless)

- **Framework**: Serverless Framework
- **Runtime**: Node.js 18.x
- **Database**: AWS DynamoDB with Global Secondary Index
- **API**: AWS API Gateway (REST) with CORS
- **Functions**: 5 AWS Lambda functions for CRUD operations
- **Validation**: Joi schema validation
- **Testing**: Jest with comprehensive test coverage

### Frontend (React)

- **Framework**: React 18 with hooks and context
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **Notifications**: Notistack for user feedback

### DevOps & CI/CD

- **Version Control**: Git with feature branch workflow
- **CI/CD**: GitHub Actions for multi-stage deployments
- **Infrastructure**: Infrastructure as Code with Serverless Framework
- **Hosting**: Netlify for frontend, AWS for backend
- **Monitoring**: AWS CloudWatch for logs and metrics

## 📁 Project Structure

```
task-manager/
├── backend/                 # Serverless backend
│   ├── src/
│   │   ├── handlers/        # Lambda function handlers
│   │   │   ├── createTask.js
│   │   │   ├── getTasks.js
│   │   │   ├── getTask.js
│   │   │   ├── updateTask.js
│   │   │   └── deleteTask.js
│   │   ├── models/          # Data models and validation
│   │   │   └── Task.js
│   │   └── utils/           # Utility functions
│   │       ├── dynamodb.js
│   │       └── response.js
│   ├── serverless.yml       # Infrastructure configuration
│   ├── package.json
│   └── README.md
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── Layout/
│   │   ├── pages/           # Page components
│   │   │   ├── TaskList.js
│   │   │   ├── TaskDetail.js
│   │   │   ├── CreateTask.js
│   │   │   ├── EditTask.js
│   │   │   └── NotFound.js
│   │   ├── services/        # API services
│   │   │   ├── api.js
│   │   │   └── taskService.js
│   │   ├── context/         # State management
│   │   │   └── TaskContext.js
│   │   └── config/          # Configuration
│   │       └── environment.js
│   ├── public/
│   ├── package.json
│   └── README.md
├── .github/
│   └── workflows/           # CI/CD pipelines
│       ├── backend-deploy.yml
│       └── frontend-deploy.yml
├── docs/                    # Documentation
│   ├── API.md              # API documentation
│   └── DEPLOYMENT.md       # Deployment guide
├── scripts/                 # Development scripts
│   └── setup.sh            # Automated setup script
└── README.md               # This file
```

## ✨ Features

### Task Management

- ✅ **Create Tasks**: Rich form with validation and date picker
- ✅ **View Tasks**: Detailed task information with status tracking
- ✅ **Update Tasks**: In-place editing with real-time validation
- ✅ **Delete Tasks**: Safe deletion with confirmation dialogs
- ✅ **List Tasks**: Paginated list with advanced filtering

### User Experience

- 📱 **Responsive Design**: Optimized for mobile, tablet, desktop, and large screens
- 🎨 **Modern UI**: Clean, intuitive Material Design interface
- ⚡ **Real-time Updates**: Live status updates and notifications
- 🔍 **Advanced Filtering**: Filter by status, priority, and search text
- 🚀 **Performance**: Optimized loading states and error handling

### Technical Features

- 🔐 **Input Validation**: Comprehensive client and server-side validation
- 🛡️ **Error Handling**: Graceful error handling with user-friendly messages
- 📊 **State Management**: Efficient state management with React Context
- 🔄 **API Integration**: Robust API layer with retry logic and caching
- 🧪 **Testing**: Unit and integration tests for critical functionality

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd task-manager

# Run automated setup
./scripts/setup.sh

# Start development environment
./start-dev.sh
```

### Option 2: Manual Setup

#### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured
- Serverless Framework CLI (`npm install -g serverless`)

#### Backend Setup

```bash
cd backend
npm install
npm run dynamodb:install
npm run dynamodb:start &
npm run offline
```

#### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local with REACT_APP_API_URL=http://localhost:3000/dev
npm start
```

## 🌐 Live Demo

### Application URLs

- **Production Frontend**: https://taskmanager.netlify.app (will be available after deployment)
- **Development API**: Available after running `./deploy.sh dev`
- **Production API**: Available after running `./deploy.sh prod`

### Demo Features

- Complete CRUD operations for tasks
- Responsive design demonstration across device sizes
- Real-time filtering and search
- Modern Material-UI interface
- Error handling and loading states

## 📖 API Documentation

### Endpoints Overview

| Method | Endpoint      | Description                            |
| ------ | ------------- | -------------------------------------- |
| GET    | `/tasks`      | List all tasks with optional filtering |
| GET    | `/tasks/{id}` | Get specific task by ID                |
| POST   | `/tasks`      | Create new task                        |
| PUT    | `/tasks/{id}` | Update existing task                   |
| DELETE | `/tasks/{id}` | Delete task                            |

### Example Usage

```bash
# Get all tasks
curl -X GET "https://api-url/tasks"

# Create task
curl -X POST "https://api-url/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "priority": "high"}'

# Update task status
curl -X PUT "https://api-url/tasks/task-id" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

For complete API documentation, see [docs/API.md](docs/API.md).

## 🚢 Deployment

### Automated CI/CD

The application uses GitHub Actions for automated deployments:

- **Development**: Push to `develop` branch → Auto-deploy to dev environment
- **Production**: Push to `main` branch → Auto-deploy to production environment

### Manual Deployment

```bash
# Deploy to development
./deploy.sh dev

# Deploy to production
./deploy.sh prod
```

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## 🧪 Testing

### Run All Tests

```bash
./run-tests.sh
```

### Individual Test Suites

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Test Coverage

- Backend: Unit tests for Lambda handlers and utilities
- Frontend: Component tests and integration tests
- API: Endpoint testing with various scenarios

## 📱 Responsive Design

The application is optimized for multiple device sizes:

### Mobile (< 600px)

- Collapsible navigation drawer
- Single-column task layout
- Touch-friendly interface
- Floating action button for quick access

### Tablet (600px - 960px)

- Adaptive navigation
- Two-column task grid
- Optimized spacing

### Desktop (960px - 1280px)

- Persistent side navigation
- Three-column task grid
- Full feature set

### Large Screens (> 1280px)

- Maximum width container
- Enhanced visual hierarchy
- Optimized content spacing

## 🛠️ Development

### Available Scripts

#### Backend

```bash
npm run offline          # Start local development server
npm run deploy:dev       # Deploy to development
npm run deploy:prod      # Deploy to production
npm test                # Run tests
npm run lint            # Run ESLint
```

#### Frontend

```bash
npm start               # Start development server
npm run build           # Build for production
npm test                # Run tests
npm run lint            # Run ESLint
```

### Environment Configuration

#### Backend

- `TASKS_TABLE`: DynamoDB table name
- `STAGE`: Deployment stage (dev/prod)
- `REGION`: AWS region

#### Frontend

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_STAGE`: Environment stage

## 🏆 Technical Highlights

### Backend Architecture

- **Serverless Functions**: 5 optimized Lambda functions
- **Database Design**: DynamoDB with GSI for efficient queries
- **Validation**: Joi schemas for robust input validation
- **Error Handling**: Consistent error responses with proper HTTP codes
- **Logging**: Structured logging for monitoring and debugging

### Frontend Architecture

- **Component Structure**: Reusable, composable React components
- **State Management**: Efficient global state with Context API
- **Performance**: Code splitting and lazy loading
- **UX**: Loading states, error boundaries, and optimistic updates
- **Accessibility**: ARIA labels and keyboard navigation support

### DevOps Practices

- **Infrastructure as Code**: Complete infrastructure defined in code
- **Multi-stage Deployments**: Separate dev and production environments
- **Automated Testing**: CI/CD pipeline includes automated testing
- **Monitoring**: CloudWatch integration for logs and metrics
- **Security**: Input validation, CORS configuration, and secure deployments

## 📚 Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Deployment Guide](docs/DEPLOYMENT.md) - Step-by-step deployment instructions
- [Backend README](backend/README.md) - Backend-specific documentation
- [Frontend README](frontend/README.md) - Frontend-specific documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AWS** for providing excellent serverless infrastructure
- **Material-UI** for the comprehensive React component library
- **Serverless Framework** for simplifying AWS deployments
- **React Team** for the amazing frontend framework
- **GitHub Actions** for reliable CI/CD pipelines

---

**Built with ❤️ as a comprehensive full-stack coding challenge demonstrating modern web development practices.**
