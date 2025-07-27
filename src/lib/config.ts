export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://esportlab-backend-production.up.railway.app',
  ENABLE_HEATMAP: import.meta.env.VITE_ENABLE_HEATMAP === 'true',
  DEFAULT_TIMEZONE: import.meta.env.VITE_DEFAULT_TIMEZONE || 'Europe/Berlin',
} as const;

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('Environment Configuration:', {
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
    API_BASE_URL: config.API_BASE_URL,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  });
}