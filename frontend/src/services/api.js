import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  enableTOTP: () => api.post('/auth/totp/enable'),
  verifyTOTP: (token) => api.post('/auth/totp/verify', { token }),
  disableTOTP: () => api.post('/auth/totp/disable'),
};

// Event services
export const eventService = {
  getAllEvents: () => api.get('/events'),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  registerForEvent: (eventId) => api.post(`/events/${eventId}/register`),
  getEventAttendees: (id) => api.get(`/events/${id}/attendees`),
  exportAttendees: (id, format) => api.get(`/events/${id}/export?format=${format}`),
};

// Registration services
export const registrationService = {
  getUserRegistrations: () => api.get('/registrations'),
  checkInWithQR: (qrData) => api.post('/registrations/check-in', { qrData }),
  verifyTOTPForCheckIn: (userId, token) => api.post('/registrations/verify-totp', { userId, token }),
};

// Dashboard services
export const dashboardService = {
  getDashboardStats: () => api.get('/dashboard'),
  getEventStats: (id) => api.get(`/dashboard/events/${id}/stats`),
};

export default api;
