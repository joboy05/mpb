// Import direct sans configuration complexe
import axios from 'axios';

// URL directe
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authAPI = {
  // Connexion
  login: async (loginData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion' };
    }
  },

  // Inscription
  register: async (memberData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, memberData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur d'inscription" };
    }
  },

  // Vérifier le token
  verifyToken: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token invalide' };
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('mpb_token');
    localStorage.removeItem('mpb_member');
    localStorage.removeItem('current_member');
  },

  // Vérifier si connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('mpb_token');
  },

  // Récupérer le membre courant
  getCurrentMember: () => {
    const memberStr = localStorage.getItem('mpb_member');
    return memberStr ? JSON.parse(memberStr) : null;
  },

  // Sauvegarder les informations d'authentification
  saveAuthData: (token, member) => {
    localStorage.setItem('mpb_token', token);
    localStorage.setItem('mpb_member', JSON.stringify(member));
  }
};