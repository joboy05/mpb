import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { postService } from '../../services/postService';
import { authService } from '../../services/api';
import * as LucideIcons from 'lucide-react';

// Extraire les icônes nécessaires
const {
  ArrowLeft,
  Calendar,
  FileText,
  Users,
  Upload,
  X,
  Image,
  File,
  Save,
  Tag,
  MapPin,
  Trash2,
  Eye
} = LucideIcons;

const EditContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentType, setContentType] = useState('événement');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'événement',
    category: 'politique',
    tags: '',
    featured: false
  });
  
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
  
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Nettoyer les URLs des prévisualisations à la destruction du composant
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview?.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreviews]);

  // Charger la publication à modifier
  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setError('ID de publication non fourni');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const response = await postService.getPost(id, true); // true pour les images complètes
        
        console.log('📋 Publication chargée:', response);
        
        if (response.success && response.post) {
          const post = response.post;
          
          // Remplir le formulaire
          setFormData({
            title: post.title || '',
            content: post.content || '',
            type: post.type || 'événement',
            category: post.category || 'politique',
            tags: post.tags ? post.tags.join(', ') : '',
            featured: post.featured || false
          });
          
          setContentType(post.type || 'événement');
          
          // Remplir les données d'événement si c'est un événement
          if (post.type === 'événement' && post.eventData) {
            setEventData({
              eventType: post.eventData.eventType || 'meeting',
              eventDate: post.eventData.eventDate || '',
              eventEndDate: post.eventData.eventEndDate || '',
              eventLocation: post.eventData.eventLocation || '',
              eventCity: post.eventData.eventCity || '',
              eventDepartment: post.eventData.eventDepartment || '',
              registrationRequired: post.eventData.registrationRequired || false,
              maxParticipants: post.eventData.maxParticipants || ''
            });
          }
          
          // Gérer les images existantes
          if (post.images && post.images.length > 0) {
            setExistingImages(post.images);
            
            // Créer des prévisualisations pour les images existantes
            const previews = post.images.map(img => ({
              url: img.base64 || img.thumbnailBase64 || `http://localhost:5000${img.url}`,
              name: img.filename || `image_${img._id}`,
              size: 0, // Taille inconnue pour les images existantes
              type: img.mimetype || 'image/jpeg',
              isExisting: true,
              id: img._id
            }));
            
            setImagePreviews(previews);
          }
          
        } else {
          setError(response.message || 'Publication non trouvée');
        }
      } catch (err) {
        console.error('❌ Erreur chargement publication:', err);
        setError(err.message || 'Erreur de chargement de la publication');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

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
    setError('');
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newPreviews = [];
    
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`L'image "${file.name}" est trop grande (max 5MB)`);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError(`Le fichier "${file.name}" n'est pas une image valide`);
        return;
      }
      
      newImages.push(file);
      const previewUrl = URL.createObjectURL(file);
      newPreviews.push({
        url: previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        isExisting: false
      });
    });
    
    if (newImages.length > 0) {
      setSelectedImages(prev => [...prev, ...newImages]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

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
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeImage = (index) => {
    const preview = imagePreviews[index];
    
    if (preview.isExisting) {
      // Marquer l'image existante pour suppression
      setImagesToDelete(prev => [...prev, preview.id]);
    } else {
      // Nettoyer l'URL de la prévisualisation pour les nouvelles images
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }
      
      // Retirer l'image de la liste des nouvelles images
      const newImageIndex = imagePreviews
        .slice(0, index)
        .filter(p => !p.isExisting).length;
      
      setSelectedImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
    
    // Retirer la prévisualisation
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    // Si c'était une image existante, la retirer aussi de la liste
    if (preview.isExisting) {
      setExistingImages(prev => prev.filter(img => img._id !== preview.id));
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation du formulaire
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Créer un FormData pour l'envoi
      const formDataToSend = new FormData();
      
      // Ajouter les données principales
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('featured', formData.featured);
      
      if (formData.tags) {
        formDataToSend.append('tags', formData.tags);
      }
      
      // Ajouter les données d'événement si nécessaire
      if (formData.type === 'événement') {
        formDataToSend.append('eventType', eventData.eventType);
        formDataToSend.append('eventDate', eventData.eventDate);
        formDataToSend.append('eventLocation', eventData.eventLocation);
        formDataToSend.append('eventCity', eventData.eventCity);
        
        if (eventData.eventEndDate) {
          formDataToSend.append('eventEndDate', eventData.eventEndDate);
        }
        if (eventData.eventDepartment) {
          formDataToSend.append('eventDepartment', eventData.eventDepartment);
        }
        if (eventData.maxParticipants) {
          formDataToSend.append('maxParticipants', eventData.maxParticipants);
        }
        formDataToSend.append('registrationRequired', eventData.registrationRequired);
      }
      
      // Ajouter les images à supprimer
      if (imagesToDelete.length > 0) {
        formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }
      
      // Ajouter les nouvelles images
      selectedImages.forEach((image) => {
        formDataToSend.append('newImages', image);
      });
      
      // Ajouter les nouveaux fichiers
      selectedFiles.forEach((file) => {
        formDataToSend.append('newFiles', file);
      });
      
      console.log('📤 Mise à jour des données...');
      
      // Envoyer la mise à jour au backend
      const response = await postService.updatePost(id, formDataToSend);
      
      console.log('✅ Réponse du serveur:', response);
      
      if (response.success) {
        setSuccess('Publication mise à jour avec succès !');
        
        // Nettoyer les prévisualisations des nouvelles images
        imagePreviews.forEach(preview => {
          if (!preview.isExisting && preview.url) {
            URL.revokeObjectURL(preview.url);
          }
        });
        
        // Redirection après 2 secondes
        setTimeout(() => {
          navigate('/admin/posts');
        }, 2000);
      } else {
        setError(response.message || 'Erreur lors de la mise à jour de la publication');
      }
      
    } catch (err) {
      console.error('❌ Erreur mise à jour:', err);
      setError(err.message || err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      setSaving(true);
      await postService.deletePost(id);
      
      setSuccess('Publication supprimée avec succès !');
      setTimeout(() => {
        navigate('/admin/posts');
      }, 1500);
      
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      setError(err.message || 'Erreur lors de la suppression');
    } finally {
      setSaving(false);
    }
  };

  // Vérifier l'authentification avec authService
  const currentMember = authService.getCurrentMember();
  if (!currentMember || currentMember.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003366]/5 via-[#004488]/5 to-[#003366]/5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h2>
          <p className="text-gray-600">Vous devez être administrateur pour accéder à cette page.</p>
          <Link 
            to="/"
            className="mt-4 inline-block text-red-600 hover:text-red-700"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003366]/5 via-[#004488]/5 to-[#003366]/5">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la publication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366]/5 via-[#004488]/5 to-[#003366]/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Bouton de retour */}
        <div className="mb-6">
          <Link
            to="/admin/posts"
            className="inline-flex items-center gap-2 text-[#003366] hover:text-[#004488] transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour à la gestion des publications</span>
          </Link>
        </div>

        {/* En-tête */}
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#FFD700]/10 to-[#FFAA00]/10 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] bg-clip-text text-transparent mb-2">
              Modifier la publication
            </h1>
            <p className="text-gray-600">
              Modifiez les champs souhaités (* = obligatoire)
            </p>
            <p className="text-sm text-blue-600 mt-2">
              ID de la publication: {id}
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="relative mb-6 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gradient-to-br from-red-50/80 to-red-100/60 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl">
              <div className="font-bold mb-1">Erreur :</div>
              {error}
            </div>
          </div>
        )}
        
        {success && (
          <div className="relative mb-6 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gradient-to-br from-green-50/80 to-green-100/60 backdrop-blur-sm border border-green-200/50 text-green-700 px-4 py-3 rounded-xl">
              <div className="font-bold">✅ Succès :</div>
              {success}
            </div>
          </div>
        )}

        {/* Formulaire principal */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#003366] to-[#004488] rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#003366]" />
                Informations principales
              </h2>
              
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
                    className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 placeholder-gray-500"
                    placeholder="Donnez un titre clair et percutant..."
                  />
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
                    className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 placeholder-gray-500 resize-none"
                    placeholder="Décrivez en détail le contenu de votre publication..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de contenu *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, type: e.target.value }));
                        setContentType(e.target.value);
                      }}
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 appearance-none"
                    >
                      <option value="événement">Événement</option>
                      <option value="actualité">Actualité</option>
                      <option value="communiqué">Communiqué</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 appearance-none"
                    >
                      <option value="politique">Politique</option>
                      <option value="social">Social</option>
                      <option value="économique">Économique</option>
                      <option value="culturel">Culturel</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags (optionnel)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 placeholder-gray-500"
                      placeholder="séparés par des virgules"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#FFD700] rounded focus:ring-[#FFD700] border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Mettre à la une</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Détails de l'événement */}
          {contentType === 'événement' && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-gradient-to-br from-blue-50/80 to-blue-100/60 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-xl p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Détails de l'événement
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
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
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
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 appearance-none"
                    >
                      <option value="meeting">Réunion</option>
                      <option value="manifestation">Manifestation</option>
                      <option value="conférence">Conférence</option>
                      <option value="assemblée">Assemblée</option>
                      <option value="action_sociale">Action sociale</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Lieu *
                    </label>
                    <input
                      type="text"
                      name="eventLocation"
                      value={eventData.eventLocation}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
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
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
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
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                      placeholder="Ex: Littoral"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin (optionnel)
                    </label>
                    <input
                      type="datetime-local"
                      name="eventEndDate"
                      value={eventData.eventEndDate}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="registrationRequired"
                        checked={eventData.registrationRequired}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Inscription requise</span>
                    </label>
                  </div>
                  
                  {eventData.registrationRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre maximum de participants
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={eventData.maxParticipants}
                        onChange={handleChange}
                        min="1"
                        className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                        placeholder="Ex: 50"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload d'images */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-purple-600" />
                Images ({imagePreviews.length})
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
                className="w-full p-6 border-2 border-dashed border-gray-300/50 rounded-xl hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-300 mb-4 group/upload"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-gray-800">Ajouter de nouvelles images</p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG, GIF • Max 5MB • Converties en base64
                  </p>
                </div>
              </button>
              
              {imagePreviews.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Images ({imagePreviews.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group/image">
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-full h-32 object-cover rounded-xl border border-gray-300/50 group-hover/image:shadow-lg transition-shadow"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 text-white p-1.5 rounded-full text-xs hover:scale-110 transition-transform"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-xl">
                          <p className="text-xs text-white truncate">
                            {preview.name}
                          </p>
                          <p className="text-xs text-gray-300">
                            {preview.isExisting ? 'Image existante' : formatFileSize(preview.size)}
                          </p>
                          {preview.isExisting && imagesToDelete.includes(preview.id) && (
                            <p className="text-xs text-red-300">(Suppression demandée)</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {imagesToDelete.length > 0 && (
                    <p className="text-sm text-orange-600 mt-3">
                      ⓘ {imagesToDelete.length} image(s) marquée(s) pour suppression
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upload de fichiers */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <File className="w-5 h-5 text-green-600" />
                Documents ({selectedFiles.length})
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
                className="w-full p-6 border-2 border-dashed border-gray-300/50 rounded-xl hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-300 mb-4 group/upload"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-gray-800">Ajouter de nouveaux documents</p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, Word, Excel, PowerPoint, TXT
                  </p>
                </div>
              </button>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">
                    Nouveaux fichiers ({selectedFiles.length})
                  </h3>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-xl border border-gray-300/30 hover:border-gray-400/50 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                          <File className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium hover:scale-110 transition-transform"
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/posts')}
                className="flex-1 border border-gray-300/50 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50/50 transition-all duration-300 font-medium backdrop-blur-sm"
                disabled={saving}
              >
                Annuler
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer
              </button>
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <Link
                to={`/actualites/${id}`}
                target="_blank"
                className="flex-1 border border-blue-300/50 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50/50 transition-all duration-300 font-medium backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Prévisualiser
              </Link>
              
              <button
                type="submit"
                disabled={saving || !formData.title.trim() || !formData.content.trim()}
                className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#003366] border-t-transparent rounded-full animate-spin"></div>
                    Mise à jour en cours...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContent;