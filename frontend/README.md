# Task Manager Frontend

A modern, responsive React application for task management built with Material-UI.

## Features

- **Responsive Design**: Optimized for mobile, tablet, desktop, and large screens
- **Modern UI**: Clean, intuitive interface using Material-UI components
- **Real-time Updates**: Live task status updates and notifications
- **Advanced Filtering**: Filter tasks by status, priority, and search terms
- **CRUD Operations**: Create, read, update, and delete tasks
- **Quick Actions**: Fast status updates and task management
- **Offline-Ready**: Graceful handling of network issues

## Technology Stack

- **React 18**: Modern React with hooks and concurrent features
- **Material-UI (MUI) 5**: Comprehensive UI component library
- **React Router 6**: Client-side routing
- **React Query**: Data fetching and caching
- **Axios**: HTTP client for API communication
- **Date-fns**: Date manipulation and formatting
- **Notistack**: Toast notifications

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Application layout components
├── pages/              # Page components
│   ├── TaskList.js     # Main task list view
│   ├── TaskDetail.js   # Individual task details
│   ├── CreateTask.js   # Create new task form
│   ├── EditTask.js     # Edit existing task form
│   └── NotFound.js     # 404 error page
├── services/           # API services and utilities
│   ├── api.js         # Axios configuration
│   └── taskService.js  # Task-related API calls
├── context/            # React Context providers
│   └── TaskContext.js  # Global task state management
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── config/             # Configuration files
│   └── environment.js  # Environment-specific settings
├── App.js              # Main application component
└── index.js            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Edit .env.local with your API URL
   REACT_APP_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   The application will open at http://localhost:3000

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Responsive Design

The application is optimized for multiple device sizes:

### Mobile (< 600px)
- Collapsible navigation drawer
- Floating action button for quick task creation
- Single-column task layout
- Touch-friendly interface elements

### Tablet (600px - 960px)
- Adaptive navigation
- Two-column task grid
- Optimized spacing and typography

### Desktop (960px - 1280px)
- Persistent side navigation
- Three-column task grid
- Full feature set with keyboard shortcuts

### Large Screens (> 1280px)
- Maximum width container
- Optimized content spacing
- Enhanced visual hierarchy

## Features in Detail

### Task Management
- **Create Tasks**: Rich form with validation
- **View Tasks**: Detailed task information with metadata
- **Edit Tasks**: In-place editing with real-time validation
- **Delete Tasks**: Confirmation dialogs for safety
- **Status Updates**: Quick status change buttons

### Filtering and Search
- **Text Search**: Search in task titles and descriptions
- **Status Filter**: Filter by pending, in-progress, completed, cancelled
- **Priority Filter**: Filter by low, medium, high, urgent priority
- **Combined Filters**: Use multiple filters simultaneously

### User Experience
- **Loading States**: Skeleton screens and progress indicators
- **Error Handling**: User-friendly error messages
- **Notifications**: Success and error toast notifications
- **Confirmation Dialogs**: Prevent accidental destructive actions

### Performance
- **Code Splitting**: Lazy-loaded routes for faster initial load
- **Caching**: React Query for intelligent data caching
- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Bundle Optimization**: Webpack optimizations for smaller bundles

## API Integration

The frontend communicates with the serverless backend through RESTful APIs:

```javascript
// Example API usage
import taskService from './services/taskService';

// Get all tasks
const tasks = await taskService.getTasks();

// Create task
const newTask = await taskService.createTask({
  title: 'New Task',
  description: 'Task description',
  priority: 'high'
});

// Update task
const updatedTask = await taskService.updateTask(taskId, {
  status: 'completed'
});
```

## Environment Configuration

### Development
```bash
REACT_APP_API_URL=http://localhost:3000/dev
REACT_APP_STAGE=dev
```

### Production
```bash
REACT_APP_API_URL=https://api.taskmanager.com/prod
REACT_APP_STAGE=prod
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to AWS S3 + CloudFront
```bash
# Using AWS CLI
aws s3 sync build/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m 'Add new feature'`
5. Push to branch: `git push origin feature/new-feature`
6. Submit a pull request

## License

MIT License - see LICENSE file for details
