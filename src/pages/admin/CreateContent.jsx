import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postService } from '../../services/postService';
import { authAPI } from '../../api/auth';
import { ArrowLeft, Calendar, FileText, Users, Upload, X, Image as ImageIcon, File, Plus, Star, Tag, MapPin } from 'lucide-react';

const CreateContent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    tags: ''
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
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].url);
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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
    setError('');
    setSuccess('');
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }
    
    setLoading(true);

    try {
      const postData = new FormData();
      
      postData.append('title', formData.title.trim());
      postData.append('content', formData.content.trim());
      postData.append('type', formData.type);
      postData.append('category', formData.category);
      postData.append('tags', formData.tags.trim());
      
      if (formData.type === 'événement') {
        Object.keys(eventData).forEach(key => {
          if (eventData[key] !== null && eventData[key] !== undefined && eventData[key] !== '') {
            postData.append(key, eventData[key]);
          }
        });
      }
      
      selectedImages.forEach((image) => {
        postData.append('images', image);
      });
      
      selectedFiles.forEach((file) => {
        postData.append('files', file);
      });
      
      const response = await postService.createPost(postData);
      
      if (response.success) {
        setSuccess(`${formData.type} créé avec succès !`);
        
        imagePreviews.forEach(preview => {
          URL.revokeObjectURL(preview.url);
        });
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Erreur lors de la création');
      }
      
    } catch (err) {
      console.error('Erreur complète:', err);
      
      if (err.errors && Array.isArray(err.errors)) {
        setError('Erreurs: ' + err.errors.join(', '));
      } else {
        setError(err.message || 'Erreur lors de la création du contenu');
      }
      
    } finally {
      setLoading(false);
    }
  };

  const currentMember = authAPI.getCurrentMember();
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

        {/* Sélection du type */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#003366] to-[#004488] rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Type de contenu *</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'événement', label: 'Événement', icon: <Calendar className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
                { value: 'actualité', label: 'Actualité', icon: <FileText className="w-6 h-6" />, color: 'from-green-500 to-green-600' },
                { value: 'communiqué', label: 'Communiqué', icon: <Users className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setContentType(type.value);
                    setFormData(prev => ({ ...prev, type: type.value }));
                  }}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                    contentType === type.value
                      ? 'border-[#003366] bg-gradient-to-br from-white to-gray-50 shadow-lg'
                      : 'border-gray-200/50 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center text-white mx-auto mb-3`}>
                    {type.icon}
                  </div>
                  <div className="font-bold text-gray-800">{type.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

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
                    className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 placeholder-gray-500 resize-none"
                    placeholder="Décrivez en détail le contenu de votre publication..."
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
                </div>
              </div>
            </div>
          )}

          {/* Upload d'images */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Images (optionnel)
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
                  <p className="font-medium text-gray-800">Cliquez pour ajouter des images</p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG, GIF • Max 10MB
                  </p>
                </div>
              </button>
              
              {imagePreviews.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Images à uploader ({imagePreviews.length})
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
                        </div>
                      </div>
                    ))}
                  </div>
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
                Documents (optionnel)
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
                  <p className="font-medium text-gray-800">Ajouter des documents</p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, Word, Excel, PowerPoint, TXT
                  </p>
                </div>
              </button>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">
                    Fichiers ({selectedFiles.length})
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
                  Publier {contentType}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateContent;