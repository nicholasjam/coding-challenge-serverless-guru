# Deployment Guide

This document provides step-by-step instructions for deploying the Task Manager application to AWS and hosting platforms.

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ and npm installed
- Serverless Framework CLI installed globally
- GitHub account for CI/CD
- Netlify account (for frontend hosting)

## Backend Deployment

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

### 3. Deploy to Development

```bash
npm run deploy:dev
```

### 4. Deploy to Production

```bash
npm run deploy:prod
```

### 5. Verify Deployment

After deployment, you'll see output similar to:

```
Service Information
service: task-manager-backend
stage: dev
region: us-east-1
stack: task-manager-backend-dev
resources: 12
api keys:
  None
endpoints:
  POST - https://abc123def4.execute-api.us-east-1.amazonaws.com/dev/tasks
  GET - https://abc123def4.execute-api.us-east-1.amazonaws.com/dev/tasks
  GET - https://abc123def4.execute-api.us-east-1.amazonaws.com/dev/tasks/{id}
  PUT - https://abc123def4.execute-api.us-east-1.amazonaws.com/dev/tasks/{id}
  DELETE - https://abc123def4.execute-api.us-east-1.amazonaws.com/dev/tasks/{id}
functions:
  createTask: task-manager-backend-dev-createTask
  getTasks: task-manager-backend-dev-getTasks
  getTask: task-manager-backend-dev-getTask
  updateTask: task-manager-backend-dev-updateTask
  deleteTask: task-manager-backend-dev-deleteTask
```

Copy the API Gateway URL for frontend configuration.

## Frontend Deployment

### 1. Configure Environment

Create `.env.local` in the frontend directory:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
REACT_APP_STAGE=dev
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build for Production

```bash
npm run build
```

### 4. Deploy to Netlify

#### Option A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

#### Option B: GitHub Integration

1. Push code to GitHub repository
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`
   - Environment variables: Add your `REACT_APP_API_URL`

### 5. Alternative: Deploy to AWS S3 + CloudFront

```bash
# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Enable static website hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document error.html

# Deploy files
aws s3 sync build/ s3://your-bucket-name --delete

# Create CloudFront distribution (optional, for CDN)
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

## CI/CD Setup

### 1. GitHub Secrets

Add the following secrets to your GitHub repository:

#### Backend Secrets

- `AWS_ACCESS_KEY_ID` - AWS access key for development
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for development
- `AWS_ACCESS_KEY_ID_PROD` - AWS access key for production
- `AWS_SECRET_ACCESS_KEY_PROD` - AWS secret key for production

#### Frontend Secrets

- `NETLIFY_AUTH_TOKEN` - Netlify personal access token
- `NETLIFY_SITE_ID_DEV` - Netlify site ID for development
- `NETLIFY_SITE_ID_PROD` - Netlify site ID for production
- `REACT_APP_API_URL_DEV` - Development API URL
- `REACT_APP_API_URL_PROD` - Production API URL

### 2. Branch Strategy

- `develop` branch → Deploys to development environment
- `main` branch → Deploys to production environment

### 3. Deployment Workflow

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to GitHub
4. Create pull request to `develop`
5. Merge triggers development deployment
6. Create pull request from `develop` to `main`
7. Merge triggers production deployment

## Environment URLs

After deployment, your applications will be available at:

### Development

- **Backend API**: `https://your-api-id.execute-api.us-east-1.amazonaws.com/dev`
- **Frontend**: `https://dev--your-site-name.netlify.app`

### Production

- **Backend API**: `https://your-api-id.execute-api.us-east-1.amazonaws.com/prod`
- **Frontend**: `https://your-site-name.netlify.app`

## Monitoring and Logging

### CloudWatch Logs

View Lambda function logs:

```bash
# View logs for a specific function
serverless logs -f createTask --stage dev

# Tail logs in real-time
serverless logs -f createTask --stage dev --tail
```

### CloudWatch Metrics

Monitor your application through AWS CloudWatch:

1. Go to AWS CloudWatch console
2. Navigate to Metrics → AWS/Lambda
3. View metrics for your functions
4. Set up alarms for error rates and duration

### API Gateway Monitoring

1. Go to API Gateway console
2. Select your API
3. Navigate to "Monitoring" tab
4. View request counts, latency, and error rates

## Troubleshooting

### Common Backend Issues

1. **Permission Errors**

   - Check IAM roles and policies
   - Ensure Lambda has DynamoDB permissions

2. **CORS Issues**

   - Verify CORS configuration in `serverless.yml`
   - Check response headers in Lambda functions

3. **Cold Start Performance**
   - Consider provisioned concurrency for production
   - Optimize Lambda package size

### Common Frontend Issues

1. **API Connection Errors**

   - Verify `REACT_APP_API_URL` environment variable
   - Check network connectivity
   - Verify CORS configuration

2. **Build Errors**

   - Check Node.js version compatibility
   - Clear node_modules and reinstall dependencies

3. **Deployment Failures**
   - Check build logs in Netlify dashboard
   - Verify environment variables are set correctly

## Security Considerations

### Backend Security

1. **API Rate Limiting**

   - Configure usage plans in API Gateway
   - Set throttling limits per endpoint

2. **Input Validation**

   - All inputs are validated using Joi schemas
   - SQL injection protection through DynamoDB

3. **Authentication** (Optional)
   - Implement AWS Cognito for user authentication
   - Add JWT token validation to Lambda functions

### Frontend Security

1. **Environment Variables**

   - Never commit sensitive data to repository
   - Use environment-specific configurations

2. **Content Security Policy**

   - Configure CSP headers in hosting platform
   - Prevent XSS attacks

3. **HTTPS**
   - Always use HTTPS in production
   - Netlify provides automatic SSL certificates

## Performance Optimization

### Backend Performance

1. **DynamoDB Optimization**

   - Use appropriate read/write capacity
   - Implement caching for frequently accessed data

2. **Lambda Optimization**
   - Minimize cold starts
   - Optimize memory allocation
   - Use connection pooling for external services

### Frontend Performance

1. **Bundle Optimization**

   - Code splitting with React.lazy()
   - Tree shaking to remove unused code
   - Optimize images and assets

2. **Caching Strategy**
   - Browser caching for static assets
   - API response caching with React Query
   - Service worker for offline functionality

## Backup and Disaster Recovery

### Database Backup

1. **DynamoDB Point-in-Time Recovery**

   ```bash
   aws dynamodb put-backup --table-name your-table-name --backup-name backup-name
   ```

2. **Automated Backups**
   - Enable continuous backups in DynamoDB
   - Set up scheduled backups using AWS Lambda

### Code Backup

1. **Version Control**

   - All code stored in GitHub
   - Regular commits and tags for releases

2. **Infrastructure as Code**
   - All AWS resources defined in `serverless.yml`
   - Easy to recreate entire infrastructure

## Cost Optimization

### AWS Cost Management

1. **Monitor Usage**

   - Set up billing alerts
   - Review AWS Cost Explorer regularly

2. **Optimize Resources**
   - Use on-demand pricing for DynamoDB
   - Right-size Lambda memory allocation
   - Clean up unused resources

### Hosting Costs

1. **Netlify**

   - Free tier includes 100GB bandwidth
   - Upgrade to Pro for additional features

2. **Alternative Hosting**
   - AWS S3 + CloudFront for lower costs
   - Vercel for serverless hosting
