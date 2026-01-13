import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/postService';
import { authAPI } from '../../api/auth';

const CreateContent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState('événement');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Références pour les inputs files
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Données du formulaire
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'événement',
    category: 'politique',
    featured: false,
    tags: ''
  });
  
  // Données événement
  const [eventData, setEventData] = useState({
    eventType: 'meeting',
    eventDate: '',
    eventEndDate: '',
    eventLocation: '',
    eventCity: '',
    eventDepartment: '',
    registrationRequired: false,
    maxParticipants: ''
  });
  
  // Fichiers
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('event')) {
      setEventData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    setError(''); // Effacer les erreurs quand l'utilisateur modifie
  };

  // Gestion de la sélection d'images
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newPreviews = [];
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setError(`L'image "${file.name}" est trop grande (max 10MB)`);
        return;
      }
      
      newImages.push(file);
      const previewUrl = URL.createObjectURL(file);
      newPreviews.push({
        url: previewUrl,
        name: file.name,
        size: file.size
      });
    });
    
    setSelectedImages(prev => [...prev, ...newImages]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Gestion de la sélection de fichiers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setError(`Le fichier "${file.name}" est trop grand (max 10MB)`);
        return;
      }
      
      const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        setError(`Type de fichier non supporté: ${file.name}`);
        return;
      }
      
      validFiles.push(file);
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  // Supprimer une image
  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].url);
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Supprimer un fichier
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Formater la taille
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Obtenir l'icône
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
    if (ext === 'pdf') return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['ppt', 'pptx'].includes(ext)) return '📑';
    return '📎';
  };

  // VALIDATION DU FORMULAIRE
  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) {
      errors.push('Le titre est requis');
    }
    
    if (!formData.content.trim()) {
      errors.push('Le contenu est requis');
    }
    
    if (formData.type === 'événement') {
      if (!eventData.eventDate) {
        errors.push('La date de l\'événement est requise');
      }
      if (!eventData.eventLocation) {
        errors.push('Le lieu de l\'événement est requis');
      }
      if (!eventData.eventCity) {
        errors.push('La ville est requise');
      }
    }
    
    return errors;
  };

  // Soumission du formulaire - VERSION CORRIGÉE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation avant envoi
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }
    
    setLoading(true);

    try {
      // 1. Créer FormData
      const postData = new FormData();
      
      // 2. Ajouter les champs texte (TOUJOURS avec des valeurs)
      postData.append('title', formData.title.trim());
      postData.append('content', formData.content.trim());
      postData.append('type', formData.type);
      postData.append('category', formData.category);
      postData.append('featured', formData.featured);
      postData.append('tags', formData.tags.trim());
      
      // 3. Ajouter les données événement si pertinent
      if (formData.type === 'événement') {
        Object.keys(eventData).forEach(key => {
          if (eventData[key] !== null && eventData[key] !== undefined && eventData[key] !== '') {
            postData.append(key, eventData[key]);
          }
        });
      }
      
      // 4. Ajouter les images
      selectedImages.forEach((image) => {
        postData.append('images', image);
      });
      
      // 5. Ajouter les fichiers
      selectedFiles.forEach((file) => {
        postData.append('files', file);
      });
      
      // 6. DEBUG: Vérifier ce qu'on envoie
      console.log('Envoi FormData:');
      for (let [key, value] of postData.entries()) {
        console.log(key + ':', value);
      }
      
      // 7. Envoyer au serveur
      const response = await postService.createPost(postData);
      
      if (response.success) {
        setSuccess(`${formData.type} créé avec succès !`);
        
        // Nettoyer les URLs de prévisualisation
        imagePreviews.forEach(preview => {
          URL.revokeObjectURL(preview.url);
        });
        
        // Redirection après 2 secondes
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Erreur lors de la création');
      }
      
    } catch (err) {
      console.error('Erreur complète:', err);
      
      // Afficher les erreurs de validation du serveur
      if (err.errors && Array.isArray(err.errors)) {
        setError('Erreurs: ' + err.errors.join(', '));
      } else {
        setError(err.message || 'Erreur lors de la création du contenu');
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si admin
  const currentMember = authAPI.getCurrentMember();
  if (!currentMember || currentMember.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h2>
          <p>Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/admin/posts')}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Retour
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Créer du contenu
            </h1>
          </div>
          <p className="text-gray-600">
            Remplissez tous les champs obligatoires (*)
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="font-bold mb-1">Erreur :</div>
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="font-bold">✅ Succès :</div>
            {success}
          </div>
        )}

        {/* Sélection du type */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Type de contenu *</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'événement', label: 'Événement', icon: '📅' },
              { value: 'actualité', label: 'Actualité', icon: '📰' },
              { value: 'communiqué', label: 'Communiqué', icon: '📢' }
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  setContentType(type.value);
                  setFormData(prev => ({ ...prev, type: type.value }));
                }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  contentType === type.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-bold">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire principal */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Informations principales</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Donnez un titre clair..."
                />
                {!formData.title.trim() && (
                  <p className="text-red-500 text-sm mt-1">Ce champ est obligatoire</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu détaillé *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Décrivez en détail..."
                />
                {!formData.content.trim() && (
                  <p className="text-red-500 text-sm mt-1">Ce champ est obligatoire</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="politique">Politique</option>
                    <option value="social">Social</option>
                    <option value="économique">Économique</option>
                    <option value="culturel">Culturel</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (optionnel)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="séparés par des virgules"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600"
                />
                <label className="text-gray-700">
                  Mettre en avant sur la page d'accueil
                </label>
              </div>
            </div>
          </div>

          {/* Détails de l'événement */}
          {contentType === 'événement' && (
            <div className="bg-blue-50 rounded-xl shadow-lg p-6 border border-blue-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📅</span> Détails de l'événement
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date et heure *
                  </label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={eventData.eventDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'événement
                  </label>
                  <select
                    name="eventType"
                    value={eventData.eventType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="meeting">Réunion</option>
                    <option value="manifestation">Manifestation</option>
                    <option value="conférence">Conférence</option>
                    <option value="assemblée">Assemblée</option>
                    <option value="action_sociale">Action sociale</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={eventData.eventLocation}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ex: Maison des jeunes"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="eventCity"
                    value={eventData.eventCity}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ex: Cotonou"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département
                  </label>
                  <input
                    type="text"
                    name="eventDepartment"
                    value={eventData.eventDepartment}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ex: Littoral"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload d'images (optionnel) */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🖼️</span> Images (optionnel)
            </h2>
            
            <input
              type="file"
              ref={imageInputRef}
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => imageInputRef.current.click()}
              className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors mb-4"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📸</div>
                <p className="font-medium">Cliquez pour ajouter des images</p>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG, GIF • Max 10MB
                </p>
              </div>
            </button>
            
            {/* Prévisualisation */}
            {imagePreviews.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">
                  Images à uploader ({imagePreviews.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview.url}
                        alt={preview.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs"
                      >
                        ✕
                      </button>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {preview.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upload de fichiers (optionnel) */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📎</span> Documents (optionnel)
            </h2>
            
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors mb-4"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📄</div>
                <p className="font-medium">Ajouter des documents</p>
                <p className="text-sm text-gray-500 mt-1">
                  PDF, Word, Excel, PowerPoint, TXT
                </p>
              </div>
            </button>
            
            {/* Liste fichiers */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">
                  Fichiers ({selectedFiles.length})
                </h3>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">
                        {getFileIcon(file.name)}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publication...
                </div>
              ) : (
                `Publier ${contentType}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContent;