import { apiClient } from '@kennelo/services/api/client.service.js';

export const conversationService = {
  async getAll() {
    return apiClient.get('/test/conversations');
  },

  async getOrCreate(establishmentId) {
    return apiClient.post('/test/conversations', {
      establishment_id: establishmentId,
    });
  },

  async getMessages(conversationId, page = 1) {
    return apiClient.get(`/test/conversations/${conversationId}/messages?page=${page}`);
  },

  async sendMessage(conversationId, content) {
    return apiClient.post(`/test/conversations/${conversationId}/messages`, {
      content,
    });
  },

  async markAsRead(conversationId) {
    return apiClient.post(`/test/conversations/${conversationId}/read`);
  },
};
