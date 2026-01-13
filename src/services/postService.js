// Import direct comme votre authAPI
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper pour ajouter le token (sans Content-Type pour FormData)
const getAuthHeader = () => {
  const token = localStorage.getItem('mpb_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper SPÉCIAL pour FormData (sans Content-Type)
/*
const getFormDataAuthHeader = () => {
  const token = localStorage.getItem('mpb_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};*/

export const postService = {
  // Récupérer toutes les publications
  getAllPosts: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`, { 
        params,
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des publications' };
    }
  },

  // Récupérer une publication
  getPost: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération de la publication' };
    }
  },

  // Liker une publication
  likePost: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${id}/like`, 
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors du like' };
    }
  },

  // Disliker une publication
  dislikePost: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${id}/dislike`, 
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors du dislike' };
    }
  },

  // Récupérer les interactions
  getPostInteractions: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${id}/interactions`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des interactions' };
    }
  },

  // Rechercher des publications
  searchPosts: async (query, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/search`, { 
        params: { q: query, ...params },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de recherche' };
    }
  },

  // Récupérer par catégorie
  getPostsByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/category/${category}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération par catégorie' };
    }
  },

  // Créer une publication (admin) - VERSION CORRIGÉE POUR FormData
  createPost: async (postData) => {
    try {
      const token = localStorage.getItem('mpb_token');
      
      // Si c'est un FormData (avec fichiers)
      if (postData instanceof FormData) {
        const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            // NE PAS mettre 'Content-Type' ! Axios le fait automatiquement pour FormData
          }
        });
        return response.data;
      } 
      // Si c'est un objet JSON normal
      else {
        const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      }
    } catch (error) {
      console.error('Erreur createPost:', error.response?.data || error);
      throw error.response?.data || { 
        message: 'Erreur de création de publication',
        error: error.message 
      };
    }
  },

  // Mettre à jour une publication (admin)
  updatePost: async (id, postData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/posts/${id}`, postData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de mise à jour de publication' };
    }
  },

  // Supprimer une publication (admin)
  deletePost: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de suppression de publication' };
    }
  },

  // Toggle featured (admin)
  toggleFeatured: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${id}/feature`, 
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la modification' };
    }
  },

  // Statistiques (admin)
  getPostsStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/stats/summary`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des statistiques' };
    }
  }
};