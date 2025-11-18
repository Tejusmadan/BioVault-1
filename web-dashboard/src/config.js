// API Configuration
// Use REACT_APP_API_URL environment variable if set, otherwise use defaults
const config = {
  development: {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'http://192.168.2.244:3001/api'
  }
};

const env = process.env.NODE_ENV || 'development';

export const API_URL = config[env].API_URL;
export default config[env];
