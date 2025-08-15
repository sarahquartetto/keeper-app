// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: 'https://keeper-app-backend-6i1y.onrender.com'
  }
};

// Use production config by default for deployed versions
const environment = import.meta.env.MODE || 'production';
export const API_BASE_URL = config[environment].apiUrl;

