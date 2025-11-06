import { apiClient } from '@kennelo/services/api/client.service.js';

export const adminUserService = {
  /**
   * Get paginated list of all users
   * @param {number} page - Page number
   * @returns {Promise} API response with users data
   */
  async getAllUsers(page = 1) {
    return apiClient.get(`/users?page=${page}`);
  },

  /**
   * Get a single user by ID
   * @param {string} userId - User UUID
   * @returns {Promise} API response with user data
   */
  async getUser(userId) {
    return apiClient.get(`/users/${userId}`);
  },

  /**
   * Delete a user account
   * @param {string} userId - User UUID
   * @returns {Promise} API response
   */
  async deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`);
  },
};
