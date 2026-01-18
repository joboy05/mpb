// services/api.js - VERSION BASE64
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 Configuration API:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL
});

// Instance Axios unique
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Timeout plus long pour les images base64
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

  verifyEmail: async (token) => {
    try {
      const response = await apiClient.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de vérification' };
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
  completeProfile: async (profileData) => {
    try {
      const response = await apiClient.post('/members/profile/complete', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de complétion du profil' };
    }
  },

  getProfileStatus: async () => {
    try {
      const response = await apiClient.get('/members/profile/status');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de récupération du statut' };
    }
  },
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
  exportMembers: async (password, format = 'csv') => {
    try {
      const response = await apiClient.post('/admin/export-members',
        { password, format },
        { responseType: 'blob' } // Important pour télécharger le fichier
      );
      return response.data;
    } catch (error) {
      console.error('❌ Erreur export membres:', error);
      throw error.response?.data || { message: 'Erreur lors de l\'export' };
    }
  },

  exportMembersExcel: async (password) => {
    try {
      const response = await apiClient.post('/admin/export-members/excel',
        { password },
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Erreur export Excel:', error);
      throw error.response?.data || { message: 'Erreur lors de l\'export Excel' };
    }
  },

  exportMembersPDF: async (password) => {
    try {
      const response = await apiClient.post('/admin/export-members/pdf',
        { password },
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Erreur export PDF:', error);
      throw error.response?.data || { message: 'Erreur lors de l\'export PDF' };
    }
  }
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

  // Récupérer une publication avec ou sans images complètes
  getPost: async (id, includeFullImages = false) => {
    try {
      const params = includeFullImages ? { includeFullImages: 'true' } : {};
      const response = await apiClient.get(`/posts/${id}`, { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getPost:', error);
      return { success: false, message: 'Erreur de récupération' };
    }
  },

  // Récupérer une image complète
  getFullImage: async (postId, imageId) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getFullImage:', error);
      return { success: false, message: 'Erreur de récupération de l\'image' };
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

  // Ajouter des images à une publication
  addImagesToPost: async (postId, formData) => {
    try {
      const token = localStorage.getItem('mpb_token');
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/images`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // Pas de Content-Type pour FormData
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Erreur addImagesToPost:', error);
      throw error.response?.data || {
        message: 'Erreur lors de l\'ajout des images'
      };
    }
  },

  // Supprimer une image
  deleteImage: async (postId, imageId) => {
    try {
      const response = await apiClient.delete(`/posts/${postId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur deleteImage:', error);
      throw error.response?.data || {
        message: 'Erreur lors de la suppression'
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

  // Fonction pour obtenir l'URL d'une image
  // Dans api.js, modifiez la fonction getImageUrl :
  getImageUrl: (imageData) => {
    if (!imageData) return null;

    // Si thumbnailBase64 existe
    if (imageData.thumbnailBase64) {
      let base64Data = imageData.thumbnailBase64;
      // Vérifier si le préfixe data: est présent
      if (!base64Data.startsWith('data:')) {
        base64Data = `data:${imageData.mimetype || 'image/jpeg'};base64,${base64Data}`;
      }
      return base64Data;
    }

    // Sinon utiliser base64 principal
    if (imageData.base64) {
      let base64Data = imageData.base64;
      if (!base64Data.startsWith('data:')) {
        base64Data = `data:${imageData.mimetype || 'image/jpeg'};base64,${base64Data}`;
      }
      return base64Data;
    }

    return null;
  },

  // Fonction pour obtenir une image complète (lazy loading)
  getFullImageUrl: async (postId, imageId) => {
    try {
      const response = await postService.getFullImage(postId, imageId);
      if (response.success && response.image) {
        return response.image.base64;
      }
      return null;
    } catch (error) {
      console.error('❌ Erreur getFullImageUrl:', error);
      return null;
    }
  }
};

// ============ SERVICE UPLOAD ============
export const uploadService = {
  // Upload d'images en base64
  uploadImages: async (formData) => {
    try {
      const token = localStorage.getItem('mpb_token');
      const response = await axios.post(
        `${API_BASE_URL}/upload/images`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          timeout: 60000 // Timeout long pour les uploads
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Erreur uploadImages:', error);
      throw error.response?.data || {
        message: 'Erreur lors de l\'upload'
      };
    }
  },

  // Convertir un fichier en base64
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  // Optimiser la taille d'une image avant upload
  optimizeImage: async (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculer les nouvelles dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en blob
        canvas.toBlob(
          (blob) => {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          },
          'image/jpeg',
          quality
        );

        // Libérer l'URL
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => resolve(file); // Retourner l'original en cas d'erreur
    });
  }
};

export default apiClient;
