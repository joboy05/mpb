import axios from 'axios';

// IMPORTANT: En React, les variables d'environnement doivent commencer par REACT_APP_
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('🔧 Configuration API:', API_URL);

// Créer une instance Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token JWT automatiquement
axiosInstance.interceptors.request.use(
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

// Intercepteur pour gérer les erreurs globales
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Erreur API:', error.response?.status, error.message);
    
    // Gérer les erreurs d'authentification
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('mpb_token');
      localStorage.removeItem('mpb_member');
      // Ne rediriger que si on est pas déjà sur la page de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Gérer les autres erreurs
    return Promise.reject(error);
  }
);

export default axiosInstance;