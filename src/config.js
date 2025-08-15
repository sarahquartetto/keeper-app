// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: 'https://keeper-app-backend-6i1y.onrender.com'
  }
};

// Determine environment - use production for builds, development for dev server
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
const environment = isProduction ? 'production' : 'development';
export const API_BASE_URL = config[environment].apiUrl;

// Debug logging
console.log('isProduction:', isProduction);
console.log('Environment:', environment);
console.log('API URL:', config[environment].apiUrl);

