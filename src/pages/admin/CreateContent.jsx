import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postService } from '../../services/postService';
import { authService } from '../../services/api';
import * as LucideIcons from 'lucide-react';

const {
  ArrowLeft,
  FileText,
  Upload,
  X,
  Image: ImageIcon,
  Plus,
  Tag,
  Calendar,
  Clock,
  MapPin,
  Home,
  Phone,
  Mail
} = LucideIcons;

const CreateActualite = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectCount, setRedirectCount] = useState(3);
  
  const imageInputRef = useRef(null);
  
  // Ajouter un état pour le type de publication
  const [postType, setPostType] = useState('actualité');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'politique',
    tags: '',
    // Champs pour événements
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventAddress: '',
    eventCity: '',
    eventContact: ''
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Nettoyer l'URL de prévisualisation
  useEffect(() => {
    return () => {
      if (imagePreview?.url) {
        URL.revokeObjectURL(imagePreview.url);
      }
    };
  }, [imagePreview]);

  // Gérer le compte à rebours de redirection
  useEffect(() => {
    let interval;
    if (showSuccessModal && redirectCount > 0) {
      interval = setInterval(() => {
        setRedirectCount(prev => prev - 1);
      }, 1000);
    } else if (redirectCount === 0) {
      handleRedirect();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showSuccessModal, redirectCount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      setError(`L'image "${file.name}" est trop grande (max 5MB)`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError(`Le fichier "${file.name}" n'est pas une image valide`);
      return;
    }
    
    if (imagePreview?.url) {
      URL.revokeObjectURL(imagePreview.url);
    }
    
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview({
      url: previewUrl,
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    setError('');
  };

  const removeImage = () => {
    if (imagePreview?.url) {
      URL.revokeObjectURL(imagePreview.url);
    }
    
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
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
    
    // Validation spécifique aux événements
    if (postType === 'événement') {
      if (!formData.eventDate) {
        errors.push('La date de l\'événement est requise');
      }
      if (!formData.eventLocation) {
        errors.push('Le lieu de l\'événement est requis');
      }
      if (!formData.eventAddress) {
        errors.push('L\'adresse de l\'événement est requise');
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    setRedirectCount(3);
    
    try {
      const formDataToSend = new FormData();
      
      // Ajouter les données principales
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('type', postType);
      
      if (formData.tags) {
        formDataToSend.append('tags', formData.tags);
      }
      
      // Ajouter les données spécifiques aux événements
      if (postType === 'événement') {
        formDataToSend.append('eventDate', formData.eventDate);
        formDataToSend.append('eventTime', formData.eventTime || '');
        formDataToSend.append('eventLocation', formData.eventLocation);
        formDataToSend.append('eventAddress', formData.eventAddress);
        formDataToSend.append('eventCity', formData.eventCity || '');
        formDataToSend.append('eventContact', formData.eventContact || '');
      }
      
      if (selectedImage) {
        formDataToSend.append('images', selectedImage);
      }
      
      console.log('📤 Envoi de la publication...');
      
      // Envoyer au backend
      const response = await postService.createPost(formDataToSend);
      
      console.log('✅ Réponse du serveur:', response);
      
      if (response.success) {
        // Afficher le modal de succès
        setShowSuccessModal(true);
        setSuccess('Publication créée avec succès !');
        
        // Réinitialiser le formulaire
        setFormData({
          title: '',
          content: '',
          category: 'politique',
          tags: '',
          eventDate: '',
          eventTime: '',
          eventLocation: '',
          eventAddress: '',
          eventCity: '',
          eventContact: ''
        });
        
        // Nettoyer l'image
        if (imagePreview?.url) {
          URL.revokeObjectURL(imagePreview.url);
        }
        setSelectedImage(null);
        setImagePreview(null);
        
      } else {
        setError(response.message || 'Erreur lors de la création');
      }
      
    } catch (err) {
      console.error('❌ Erreur création:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Une erreur est survenue lors de la création';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    setShowSuccessModal(false);
    navigate('/admin/posts');
  };

  const cancelRedirect = () => {
    setShowSuccessModal(false);
    setRedirectCount(3);
  };

  // Vérifier l'authentification
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366]/5 via-[#004488]/5 to-[#003366]/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Bouton de retour */}
        <div className="mb-6">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-[#003366] hover:text-[#004488] transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour au tableau de bord</span>
          </Link>
        </div>

        {/* En-tête */}
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#FFD700]/10 to-[#FFAA00]/10 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] bg-clip-text text-transparent mb-2">
              Créer une nouvelle publication
            </h1>
            <p className="text-gray-600">
              Remplissez tous les champs obligatoires (*)
            </p>
          </div>
        </div>

        {/* Type de publication */}
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#003366]" />
              Type de publication
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPostType('actualité')}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  postType === 'actualité'
                    ? 'border-[#003366] bg-gradient-to-r from-[#003366]/10 to-[#004488]/10 text-[#003366] font-semibold'
                    : 'border-gray-300/50 hover:border-gray-400 text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">📰 Actualité</div>
                  <p className="text-sm text-gray-600">Publication d'information</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setPostType('événement')}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  postType === 'événement'
                    ? 'border-purple-600 bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-700 font-semibold'
                    : 'border-gray-300/50 hover:border-gray-400 text-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">🎪 Événement</div>
                  <p className="text-sm text-gray-600">Meeting, réunion, manifestation</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Messages d'erreur/succès */}
        {error && (
          <div className="relative mb-6 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gradient-to-br from-red-50/80 to-red-100/60 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl">
              <div className="font-bold mb-1">Erreur :</div>
              {error}
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations principales */}
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
                    Titre de la publication *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 placeholder-gray-500"
                    placeholder={`Donnez un titre clair pour ${postType === 'événement' ? 'l\'événement' : 'l\'actualité'}...`}
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
                    placeholder={`Rédigez le contenu complet de votre ${postType}...`}
                  />
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
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 appearance-none"
                    >
                      <option value="politique">Politique</option>
                      <option value="social">Social</option>
                      <option value="économique">Économique</option>
                      <option value="culturel">Culturel</option>
                      <option value="éducation">Éducation</option>
                      <option value="santé">Santé</option>
                      <option value="environnement">Environnement</option>
                      <option value="autre">Autre</option>
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
                      placeholder="séparés par des virgules (ex: actualité, politique, élections)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Événement (uniquement si type = événement) */}
          {postType === 'événement' && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Informations sur l'événement
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date de l'événement *
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Heure (optionnel)
                      </label>
                      <input
                        type="time"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Lieu de l'événement *
                    </label>
                    <input
                      type="text"
                      name="eventLocation"
                      value={formData.eventLocation}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                      placeholder="Ex: Salle des fêtes, Parc municipal, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Adresse complète *
                    </label>
                    <input
                      type="text"
                      name="eventAddress"
                      value={formData.eventAddress}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                      placeholder="Numéro, rue, code postal"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville (optionnel)
                      </label>
                      <input
                        type="text"
                        name="eventCity"
                        value={formData.eventCity}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                        placeholder="Ville"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact (optionnel)
                      </label>
                      <input
                        type="text"
                        name="eventContact"
                        value={formData.eventContact}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                        placeholder="Téléphone ou email"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload d'image */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                Image d'illustration (optionnel)
              </h2>
              
              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative group/image">
                      <img
                        src={imagePreview.url}
                        alt={imagePreview.name}
                        className="w-full h-64 object-cover rounded-xl border border-gray-300/50 group-hover/image:shadow-lg transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-4 right-4 bg-gradient-to-br from-red-500 to-red-600 text-white p-2 rounded-full hover:scale-110 transition-transform"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-xl">
                        <p className="text-sm text-white font-medium truncate">
                          {imagePreview.name}
                        </p>
                        <p className="text-xs text-gray-300">
                          {formatFileSize(imagePreview.size)} • Cliquez pour changer d'image
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current.click()}
                      className="w-full p-4 border-2 border-dashed border-blue-300/50 text-blue-600 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 font-medium"
                    >
                      Changer d'image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current.click()}
                    className="w-full p-8 border-2 border-dashed border-gray-300/50 rounded-xl hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-300 group/upload"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="font-medium text-gray-800 text-lg">Ajouter une image</p>
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG, GIF • Max 5MB • Stockée en base64
                      </p>
                      <p className="text-xs text-blue-600 mt-3">
                        ⓘ Vous ne pouvez sélectionner qu'une seule image
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-8 py-3 border border-gray-300/50 text-gray-700 rounded-xl hover:bg-gray-50/50 transition-all duration-300 font-medium backdrop-blur-sm"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#003366] border-t-transparent rounded-full animate-spin"></div>
                  Publication en cours...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Publier {postType === 'événement' ? "l'événement" : "l'actualité"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de succès */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-slideUp">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Succès !</h3>
              <p className="text-gray-600 mb-6">
                Votre {postType} a été publié avec succès.
              </p>
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Redirection automatique dans :</div>
                <div className="text-4xl font-bold text-[#003366] animate-pulse">
                  {redirectCount}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelRedirect}
                  className="flex-1 px-4 py-3 border border-gray-300/50 text-gray-700 rounded-xl hover:bg-gray-50/50 transition-all duration-300 font-medium"
                >
                  Rester ici
                </button>
                <button
                  onClick={handleRedirect}
                  className="flex-1 bg-gradient-to-r from-[#003366] to-[#004488] text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Voir toutes les publications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateActualite;