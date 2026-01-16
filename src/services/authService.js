// src/services/authService.js
import api from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success && response.data.token) {
        localStorage.setItem('mpb_token', response.data.token);
        localStorage.setItem('mpb_member', JSON.stringify(response.data.member));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('mpb_token');
    localStorage.removeItem('mpb_member');
  },

  getCurrentMember: () => {
    const memberStr = localStorage.getItem('mpb_member');
    return memberStr ? JSON.parse(memberStr) : null;
  },

  isAdmin: () => {
    const member = authService.getCurrentMember();
    return member && member.role === 'admin';
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }
};