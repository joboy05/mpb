// services/api.js - VERSION CORRIGÉE
import axios from 'axios';

// Utilise ton .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 Configuration API:', { 
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL 
});

// Instance Axios unique
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mpb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mpb_token');
      localStorage.removeItem('mpb_member');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ SERVICE AUTH ============
export const authService = {
  login: async (loginData) => {
    try {
      const response = await apiClient.post('/auth/login', loginData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur login:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Erreur de connexion' };
    }
  },

  register: async (memberData) => {
    try {
      const response = await apiClient.post('/auth/register', memberData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      throw error.response?.data || { message: "Erreur d'inscription" };
    }
  },

  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token invalide' };
    }
  },

  logout: () => {
    localStorage.removeItem('mpb_token');
    localStorage.removeItem('mpb_member');
    localStorage.removeItem('current_member');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('mpb_token');
  },

  getCurrentMember: () => {
    const memberStr = localStorage.getItem('mpb_member');
    return memberStr ? JSON.parse(memberStr) : null;
  },

  saveAuthData: (token, member) => {
    localStorage.setItem('mpb_token', token);
    localStorage.setItem('mpb_member', JSON.stringify(member));
  }
};

// ============ SERVICE MEMBERS ============
export const memberService = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/members/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération du profil' };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/members/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de mise à jour du profil' };
    }
  },

  getAllMembers: async () => {
    try {
      const response = await apiClient.get('/members/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des membres' };
    }
  }
};

// ============ SERVICE ADMIN ============
export const adminService = {
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des stats' };
    }
  },

  getAllMembersAdmin: async () => {
    try {
      const response = await apiClient.get('/admin/members');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des membres' };
    }
  },
};

// ============ SERVICE POSTS ============
export const postService = {
  // Récupérer toutes les publications
  getAllPosts: async (params = {}) => {
    try {
      const response = await apiClient.get('/posts', { params });
      console.log('📡 Réponse posts:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAllPosts:', error.response?.data || error.message);
      return { 
        success: false, 
        posts: [],
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  },

  // Récupérer une publication
  getPost: async (id) => {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getPost:', error);
      return { success: false, message: 'Erreur de récupération' };
    }
  },

  // Créer une publication (admin)
  createPost: async (postData) => {
    try {
      let config = {
        headers: {}
      };
      
      const token = localStorage.getItem('mpb_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Si c'est FormData, laisser axios gérer le Content-Type
      if (postData instanceof FormData) {
        // Rien à faire, axios le gère automatiquement
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
      
      const response = await apiClient.post('/posts', postData, config);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur createPost:', error.response?.data || error);
      throw error.response?.data || { 
        message: 'Erreur de création de publication'
      };
    }
  },

  // Récupérer les posts récents
  getRecentPosts: async (limit = 3) => {
    try {
      const response = await apiClient.get(`/posts/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getRecentPosts:', error);
      return { success: false, posts: [] };
    }
  },

  // Récupérer les posts à la une
  getFeaturedPosts: async () => {
    try {
      const response = await apiClient.get('/posts/featured');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getFeaturedPosts:', error);
      return { success: false, posts: [] };
    }
  },

  // Fonction pour les images
  // Dans services/api.js, modifie getImageUrl :
getImageUrl: (imagePath) => {
  if (!imagePath) return null;
  
  // Avec proxy, utilise le chemin relatif directement
  if (imagePath.startsWith('/uploads')) {
    return imagePath; // Vite proxy va rediriger vers localhost:5000
  }
  
  // Pour les anciens chemins
  if (imagePath.includes('images-')) {
    return `/uploads/images/posts/${imagePath}`;
  }
  
  return imagePath;
}
};

// Export par défaut
export default apiClient;