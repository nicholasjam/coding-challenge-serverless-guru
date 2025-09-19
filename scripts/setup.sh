#!/bin/bash

# Task Manager Application Setup Script
# This script sets up the complete development environment

set -e  # Exit on any error

echo "🚀 Setting up Task Manager Application..."
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_status "Node.js $(node -v) is installed"
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_warning "AWS CLI is not installed. Please install it from https://aws.amazon.com/cli/"
        print_info "You can continue with local development, but deployment will require AWS CLI"
    else
        print_status "AWS CLI $(aws --version | cut -d' ' -f1 | cut -d'/' -f2) is installed"
    fi
}

# Install Serverless Framework globally
install_serverless() {
    if ! command -v serverless &> /dev/null; then
        print_info "Installing Serverless Framework globally..."
        npm install -g serverless
        print_status "Serverless Framework installed"
    else
        print_status "Serverless Framework $(serverless -v | head -n1 | cut -d' ' -f4) is installed"
    fi
}

# Setup backend
setup_backend() {
    print_info "Setting up backend..."
    cd backend
    
    # Install dependencies
    print_info "Installing backend dependencies..."
    npm install
    print_status "Backend dependencies installed"
    
    # Install DynamoDB local
    print_info "Installing DynamoDB Local..."
    npm run dynamodb:install
    print_status "DynamoDB Local installed"
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_info "Setting up frontend..."
    cd frontend
    
    # Install dependencies
    print_info "Installing frontend dependencies..."
    npm install
    print_status "Frontend dependencies installed"
    
    # Create environment file
    if [ ! -f ".env.local" ]; then
        print_info "Creating environment configuration..."
        cat > .env.local << EOF
# API Configuration
REACT_APP_API_URL=http://localhost:3000/dev
REACT_APP_STAGE=dev

# Development settings
REACT_APP_ENABLE_DEBUG=true
EOF
        print_status "Environment file created (.env.local)"
    else
        print_warning "Environment file already exists (.env.local)"
    fi
    
    cd ..
}

# Create development scripts
create_dev_scripts() {
    print_info "Creating development scripts..."
    
    # Create start script for backend
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "Starting backend development server..."
cd backend

# Start DynamoDB Local in background
echo "Starting DynamoDB Local..."
npm run dynamodb:start &
DYNAMODB_PID=$!

# Wait for DynamoDB to start
sleep 5

# Start serverless offline
echo "Starting Serverless Offline..."
npm run offline

# Cleanup on exit
trap "kill $DYNAMODB_PID 2>/dev/null" EXIT
EOF

    # Create start script for frontend
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "Starting frontend development server..."
cd frontend
npm start
EOF

    # Create full dev environment script
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "Starting full development environment..."

# Function to cleanup background processes
cleanup() {
    echo "Cleaning up..."
    jobs -p | xargs -r kill
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend in background
./start-backend.sh &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 10

# Start frontend in background
./start-frontend.sh &
FRONTEND_PID=$!

echo ""
echo "🚀 Development environment is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3000/dev"
echo "🗄️  DynamoDB Admin: http://localhost:8000/shell"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
EOF

    # Make scripts executable
    chmod +x start-backend.sh start-frontend.sh start-dev.sh
    
    print_status "Development scripts created"
}

# Create testing script
create_test_script() {
    cat > run-tests.sh << 'EOF'
#!/bin/bash
echo "Running all tests..."

# Run backend tests
echo "🧪 Running backend tests..."
cd backend
npm test
BACKEND_EXIT_CODE=$?

cd ..

# Run frontend tests
echo "🧪 Running frontend tests..."
cd frontend
npm test -- --coverage --watchAll=false
FRONTEND_EXIT_CODE=$?

cd ..

# Summary
echo ""
echo "📊 Test Summary:"
if [ $BACKEND_EXIT_CODE -eq 0 ]; then
    echo "✅ Backend tests: PASSED"
else
    echo "❌ Backend tests: FAILED"
fi

if [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo "✅ Frontend tests: PASSED"
else
    echo "❌ Frontend tests: FAILED"
fi

# Exit with error if any tests failed
if [ $BACKEND_EXIT_CODE -ne 0 ] || [ $FRONTEND_EXIT_CODE -ne 0 ]; then
    exit 1
fi

echo "🎉 All tests passed!"
EOF

    chmod +x run-tests.sh
    print_status "Test script created"
}

# Create deployment script
create_deploy_script() {
    cat > deploy.sh << 'EOF'
#!/bin/bash
echo "Deploying Task Manager Application..."

STAGE=${1:-dev}

if [ "$STAGE" != "dev" ] && [ "$STAGE" != "prod" ]; then
    echo "Usage: ./deploy.sh [dev|prod]"
    echo "Example: ./deploy.sh dev"
    exit 1
fi

echo "Deploying to: $STAGE"

# Deploy backend
echo "🚀 Deploying backend to $STAGE..."
cd backend
npm run deploy:$STAGE
BACKEND_EXIT_CODE=$?

if [ $BACKEND_EXIT_CODE -ne 0 ]; then
    echo "❌ Backend deployment failed"
    exit 1
fi

# Get API URL
API_URL=$(serverless info --stage $STAGE --verbose | grep -E 'https://.*\.execute-api\.' | awk '{print $2}' | head -1)

cd ..

# Build and deploy frontend
echo "🚀 Building and deploying frontend..."
cd frontend

# Set API URL for build
export REACT_APP_API_URL=$API_URL
export REACT_APP_STAGE=$STAGE

# Build
npm run build
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "📱 Frontend build ready in: frontend/build/"
echo "🔧 Backend API URL: $API_URL"
echo ""
echo "Next steps:"
echo "1. Deploy frontend build to your hosting platform (Netlify, Vercel, S3, etc.)"
echo "2. Configure frontend environment with API URL: $API_URL"
echo "3. Test the deployed application"
EOF

    chmod +x deploy.sh
    print_status "Deployment script created"
}

# Main setup function
main() {
    echo "Starting setup process..."
    echo ""
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    check_node
    check_aws_cli
    install_serverless
    echo ""
    
    # Setup projects
    setup_backend
    echo ""
    setup_frontend
    echo ""
    
    # Create scripts
    create_dev_scripts
    create_test_script
    create_deploy_script
    echo ""
    
    # Final instructions
    print_status "Setup completed successfully! 🎉"
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo ""
    echo "1. Configure AWS credentials (if not already done):"
    echo "   aws configure"
    echo ""
    echo "2. Start development environment:"
    echo "   ./start-dev.sh"
    echo ""
    echo "3. Or start services individually:"
    echo "   ./start-backend.sh  # Backend API + DynamoDB"
    echo "   ./start-frontend.sh # React development server"
    echo ""
    echo "4. Run tests:"
    echo "   ./run-tests.sh"
    echo ""
    echo "5. Deploy to AWS:"
    echo "   ./deploy.sh dev   # Deploy to development"
    echo "   ./deploy.sh prod  # Deploy to production"
    echo ""
    echo "📱 Application URLs (when running locally):"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3000/dev"
    echo "   DynamoDB: http://localhost:8000/shell"
    echo ""
    echo "📚 Documentation:"
    echo "   API Documentation:        docs/API.md"
    echo "   Deployment Guide:         docs/DEPLOYMENT.md"
    echo "   Backend README:           backend/README.md"
    echo "   Frontend README:          frontend/README.md"
    echo ""
    print_status "Happy coding! 🚀"
}

# Run main function
main "$@"
