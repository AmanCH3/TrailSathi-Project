// App-wide constants
export const APP_NAME = 'TrailSathi'

// Toast configuration
export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'light',
}

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
}

// Query keys for React Query
export const QUERY_KEYS = {
  user: ['user'],
  trails: ['trails'],
  groups: ['groups'],
  payments: ['payments'],
  checklist: ['checklist'],
  analytics: ['analytics'],
}
