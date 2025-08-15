// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: 'https://keeper-app-backend-6i1y.onrender.com'
  }
};

// Use development config by default, can be overridden by environment variable
const environment = import.meta.env.MODE || 'development';
export const API_BASE_URL = config[environment].apiUrl;

