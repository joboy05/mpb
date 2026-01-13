import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper pour ajouter le token
const getAuthHeader = () => {
  const token = localStorage.getItem('mpb_token');
  return token ? { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  } : {};
};

export const uploadService = {
  // Upload multiple de fichiers
  uploadFiles: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload/upload`,
        formData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'upload' };
    }
  },

  // Upload une seule image
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return uploadFiles(formData);
  },

  // Upload un seul fichier
  uploadDocument: async (documentFile) => {
    const formData = new FormData();
    formData.append('file', documentFile);
    
    return uploadFiles(formData);
  },

  // Formater la taille de fichier
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Vérifier le type de fichier
  getFileType: (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const documentTypes = {
      'pdf': 'PDF',
      'doc': 'Word',
      'docx': 'Word',
      'xls': 'Excel',
      'xlsx': 'Excel',
      'ppt': 'PowerPoint',
      'pptx': 'PowerPoint',
      'txt': 'Texte'
    };
    
    if (imageTypes.includes(ext)) return 'image';
    if (documentTypes[ext]) return documentTypes[ext];
    return 'other';
  },

  // Obtenir l'icône selon le type
  getFileIcon: (filename) => {
    const type = uploadService.getFileType(filename);
    switch(type) {
      case 'image': return '🖼️';
      case 'PDF': return '📄';
      case 'Word': return '📝';
      case 'Excel': return '📊';
      case 'PowerPoint': return '📑';
      case 'Texte': return '📄';
      default: return '📎';
    }
  }
};