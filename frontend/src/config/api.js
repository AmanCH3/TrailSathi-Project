import { ENV } from './env'

// API configuration
export const API_CONFIG = {
  baseURL: ENV.API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// API endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE: '/auth/google',
  },
  // Trails
  TRAILS: {
    BASE: '/trails',
    BY_ID: (id) => `/trails/${id}`,
  },
  // Groups
  GROUPS: {
    BASE: '/groups',
    BY_ID: (id) => `/groups/${id}`,
    MEMBERS: (id) => `/groups/${id}/members`,
  },
  // Payments
  PAYMENTS: {
    BASE: '/payments',
    ESEWA: '/payments/esewa',
    VERIFY: '/payments/verify',
  },
  // Profile
  PROFILE: {
    BASE: '/profile',
    UPDATE: '/profile/update',
  },
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
    TRAILS: '/admin/trails',
    GROUPS: '/admin/groups',
  },
}

export const API_BASE_URL = ENV.API_URL
