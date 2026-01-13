// Configuration de l'application
const config = {
  api: {
    // URL de l'API backend
    baseURL: import.meta.env.VITE_API_URL || 
             window._env_?.REACT_APP_API_URL || 
             'http://localhost:5000/api'
  }
};

// Export pour usage global
export default config;