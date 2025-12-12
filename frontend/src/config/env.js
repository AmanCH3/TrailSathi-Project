// Environment configuration
export const ENV = {
  API_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
}
