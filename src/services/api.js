import axios from 'axios';

// Configuration de base
const API_BASE_URL = 'http://localhost:5000/api';

// Instance Axios avec intercepteurs
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token automatiquement
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
    // Gérer les erreurs 401 (non autorisé)
    if (error.response?.status === 401) {
      localStorage.removeItem('mpb_token');
      localStorage.removeItem('mpb_member');
      // Rediriger vers login si pas déjà dessus
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  // Connexion
  login: async (loginData) => {
    try {
      const response = await apiClient.post('/auth/login', loginData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion' };
    }
  },

  // Inscription
  register: async (memberData) => {
    try {
      const response = await apiClient.post('/auth/register', memberData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur d'inscription" };
    }
  },

  // Vérifier le token
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify');
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

  // Sauvegarder les données d'authentification
  saveAuthData: (token, member) => {
    localStorage.setItem('mpb_token', token);
    localStorage.setItem('mpb_member', JSON.stringify(member));
  }
};

// Service des membres
export const memberService = {
  // Récupérer le profil
  getProfile: async () => {
    try {
      const response = await apiClient.get('/members/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération du profil' };
    }
  },

  // Mettre à jour le profil
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/members/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de mise à jour du profil' };
    }
  },

  // Récupérer tous les membres
  getAllMembers: async () => {
    try {
      const response = await apiClient.get('/members/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des membres' };
    }
  }
};

export default apiClient;
// Service admin
export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des stats' };
    }
  },

  // Gestion des membres
  getAllMembersAdmin: async () => {
    try {
      const response = await apiClient.get('/admin/members');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération des membres' };
    }
  },

  // Autres méthodes admin...
};