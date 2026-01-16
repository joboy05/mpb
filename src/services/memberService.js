// src/services/memberService.js
import api from './api';

export const memberService = {
  getProfile: async () => {
    try {
      const response = await api.get('/members/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/members/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  completeProfile: async (profileData) => {
    try {
      const response = await api.post('/members/complete-profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error completing profile:', error);
      throw error;
    }
  }
};