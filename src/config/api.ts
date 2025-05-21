// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

export { API_BASE_URL, WS_BASE_URL };

// Helper function to check if server is running
export const checkServerConnection = async () => {
  try {
    console.log('Checking server connection at:', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      console.error('Server health check failed:', response.status, response.statusText);
      throw new Error('Server is not responding properly');
    }
    console.log('Server connection successful');
    return true;
  } catch (error) {
    console.error('Server connection error:', error);
    return false;
  }
};

// Helper function to check WebSocket connection
export const checkWebSocketConnection = async (endpoint: string) => {
  return new Promise<boolean>((resolve) => {
    try {
      console.log('Checking WebSocket connection at:', endpoint);
      const ws = new WebSocket(endpoint);
      
      const timeout = setTimeout(() => {
        ws.close();
        console.error('WebSocket connection timeout');
        resolve(false);
      }, 5000);

      ws.onopen = () => {
        clearTimeout(timeout);
        ws.close();
        console.log('WebSocket connection successful');
        resolve(true);
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error('WebSocket connection error:', error);
        resolve(false);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      resolve(false);
    }
  });
};

export const API_ENDPOINTS = {
  // Health check endpoint
  HEALTH: `${API_BASE_URL}/health`,
  
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD_STATS: `${API_BASE_URL}/admin/dashboard/stats`,
    ANALYTICS: `${API_BASE_URL}/admin/analytics`,
    TENDER_REQUESTS: `${API_BASE_URL}/tender-requests`,
    USERS: `${API_BASE_URL}/admin/users`,
  },

  // WebSocket endpoints
  WS: {
    DASHBOARD_STATS: `${WS_BASE_URL}/ws/dashboard-stats`,
    TENDER_REQUESTS: `${WS_BASE_URL}/ws/tender-requests`,
    WEBSITE_ANALYTICS: `${WS_BASE_URL}/ws/website-analytics`
  }
};

// Add debug logs
console.log('API Base URL:', API_BASE_URL);
console.log('WebSocket Base URL:', WS_BASE_URL);

export default API_ENDPOINTS; 