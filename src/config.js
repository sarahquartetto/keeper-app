// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: 'https://your-backend-url.onrender.com' // We'll update this after deploying backend
  }
};

// Use development config by default, can be overridden by environment variable
const environment = import.meta.env.MODE || 'development';
export const API_BASE_URL = config[environment].apiUrl;

