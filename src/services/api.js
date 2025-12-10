import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add language header
    const lang = localStorage.getItem('language') || 'fr';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Une erreur est survenue';
    return Promise.reject({ message, status: error.response?.status });
  }
);

// Events API
export const eventsApi = {
  getPublicEvents: (params = {}) => api.get('/events/public', { params }),
  getEventBySlug: (slug) => api.get(`/events/public/${slug}`),
};

// Tickets API
export const ticketsApi = {
  getTicketTypes: (eventId) => api.get(`/tickets/event/${eventId}/types`),
  purchaseTickets: (data) => api.post('/tickets/purchase', data),
  getOrderByNumber: (orderNumber, email) =>
    api.get(`/tickets/order/${orderNumber}`, { params: { email } }),
  verifyTicket: (data) => api.post('/tickets/verify', data),
};

// Payments API
export const paymentsApi = {
  initiatePayment: (data) => api.post('/payments/initiate', data),
  getPaymentStatus: (transactionId) => api.get(`/payments/status/${transactionId}`),
  verifyPayment: (data) => api.post('/payments/verify', data),
  processDonation: (data) => api.post('/payments/donate', data),
};

// Content API (from CMS)
export const contentApi = {
  getPublicContent: (key, lang) => api.get(`/content/public/${key}`, { params: { lang } }),
  getPageContent: (pageSlug, lang, eventId) =>
    api.get(`/content/public/page/${pageSlug}`, { params: { lang, eventId } }),
  getEventContent: (eventId, lang) =>
    api.get(`/content/public/event/${eventId}`, { params: { lang } }),
};

export default api;
