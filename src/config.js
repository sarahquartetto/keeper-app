// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: 'https://keeper-app-backend-6i1y.onrender.com'
  }
};

// Force production mode for online deployment
const environment = 'production';
export const API_BASE_URL = config[environment].apiUrl;

// Debug logging
console.log('Environment:', environment);
console.log('API URL:', config[environment].apiUrl);

