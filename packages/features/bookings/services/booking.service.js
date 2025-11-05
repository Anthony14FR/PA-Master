import { apiClient } from '@kennelo/services/api/client.service.js';

export const bookingService = {
  async create(bookingData) {
    return apiClient.post('/test/bookings', bookingData);
  },

  async getAll() {
    return apiClient.get('/test/bookings');
  },

  async getDetails(bookingId) {
    return apiClient.get(`/test/bookings/${bookingId}`);
  },

  async getThreadMessages(bookingId) {
    return apiClient.get(`/test/bookings/${bookingId}/thread`);
  },

  async sendThreadMessage(bookingId, content) {
    return apiClient.post(`/test/bookings/${bookingId}/thread/messages`, {
      content,
    });
  },
};
