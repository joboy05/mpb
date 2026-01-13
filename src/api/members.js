import axiosInstance from './axiosConfig';

export const membersAPI = {
  // Récupérer le profil du membre connecté
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/members/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération du profil' };
    }
  },

  // Mettre à jour le profil
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/members/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de mise à jour du profil' };
    }
  },

  // Récupérer tous les membres (admin)
  getAllMembers: async () => {
    try {
      const response = await axiosInstance.get('/members/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des membres' };
    }
  }
};