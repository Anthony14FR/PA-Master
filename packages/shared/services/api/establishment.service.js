import { apiClient } from './client.service.js';

export const establishmentService = {
  async getAll(page = 1, perPage = 12) {
    return apiClient.get(`/test/establishments?page=${page}&per_page=${perPage}`);
  },

  async getDetails(uuid) {
    return apiClient.get(`/test/establishments/${uuid}`);
  },
};
