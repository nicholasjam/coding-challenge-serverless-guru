/**
 * Environment configuration for the frontend application
 */

const config = {
  development: {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/dev',
    STAGE: 'dev',
    DEBUG: true,
    ENABLE_ANALYTICS: false,
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://api.taskmanager.com/prod',
    STAGE: 'prod',
    DEBUG: false,
    ENABLE_ANALYTICS: true,
  },
};

// Determine current environment
const getEnvironment = () => {
  const stage = process.env.REACT_APP_STAGE || process.env.NODE_ENV || 'development';
  
  if (stage === 'prod' || stage === 'production') {
    return 'production';
  }
  
  return 'development';
};

const currentEnv = getEnvironment();
const environment = config[currentEnv];

export default {
  ...environment,
  NODE_ENV: process.env.NODE_ENV,
  CURRENT_ENV: currentEnv,
};

export { currentEnv };
