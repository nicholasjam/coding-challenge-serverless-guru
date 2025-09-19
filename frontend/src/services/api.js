import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/dev';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data);
      
      // Create a user-friendly error message
      const message = data?.error?.message || data?.message || 'An error occurred';
      error.userMessage = message;
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      error.userMessage = 'Unable to connect to server. Please check your internet connection.';
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      error.userMessage = error.message || 'An unexpected error occurred';
    }
    
    return Promise.reject(error);
  }
);

export default api;
