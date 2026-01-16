import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { postService } from '../../services/postService';
import { authService } from '../../services/api';
import * as LucideIcons from 'lucide-react';

// Extraire les icônes nécessaires
const {
  ArrowLeft,
  FileText,
  Upload,
  X,
  Image: ImageIcon,
  Save,
  Tag,
  Trash2,
  Eye
} = LucideIcons;

const EditActualite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const imageInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'politique',
    tags: '',
    featured: false,
    status: 'publié'
  });
  
  const [existingImage, setExistingImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(false);

  // Nettoyer l'URL de prévisualisation
  useEffect(() => {
    return () => {
      if (imagePreview?.url && !imagePreview.isExisting) {
        URL.revokeObjectURL(imagePreview.url);
      }
    };
  }, [imagePreview]);

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
        
        const response = await postService.getPost(id);
        
        console.log('📋 Actualité chargée:', response);
        
        if (response.success && response.post) {
          const post = response.post;
          
          // Remplir le formulaire
          setFormData({
            title: post.title || '',
            content: post.content || '',
            category: post.category || 'politique',
            tags: post.tags ? post.tags.join(', ') : '',
            featured: post.featured || false,
            status: post.status || 'publié'
          });
          
          // Gérer l'image existante
          if (post.images && post.images.length > 0) {
            const mainImage = post.images.find(img => img.isMain) || post.images[0];
            if (mainImage) {
              setExistingImage(mainImage);
              setImagePreview({
                url: mainImage.thumbnailBase64 || mainImage.base64,
                name: mainImage.filename || `image_${mainImage._id}`,
                size: mainImage.size || 0,
                type: mainImage.mimetype || 'image/jpeg',
                isExisting: true,
                id: mainImage._id
              });
            }
          }
          
        } else {
          setError(response.message || 'Actualité non trouvée');
        }
      } catch (err) {
        console.error('❌ Erreur chargement actualité:', err);
        setError(err.message || 'Erreur de chargement de l\'actualité');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const file = files[0]; // Prendre seulement le premier fichier
    
    // Vérifier la taille
    if (file.size > 5 * 1024 * 1024) {
      setError(`L'image "${file.name}" est trop grande (max 5MB)`);
      return;
    }
    
    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      setError(`Le fichier "${file.name}" n'est pas une image valide`);
      return;
    }
    
    // Nettoyer l'ancienne prévisualisation si elle existe
    if (imagePreview?.url && !imagePreview.isExisting) {
      URL.revokeObjectURL(imagePreview.url);
    }
    
    // Marquer l'image existante pour suppression
    if (existingImage) {
      setImageToDelete(true);
    }
    
    // Créer une nouvelle prévisualisation
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview({
      url: previewUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      isExisting: false
    });
    
    setError('');
  };

  const removeImage = () => {
    if (imagePreview) {
      // Nettoyer l'URL si c'est une nouvelle image
      if (!imagePreview.isExisting && imagePreview.url) {
        URL.revokeObjectURL(imagePreview.url);
      }
      
      // Marquer l'image existante pour suppression
      if (imagePreview.isExisting) {
        setImageToDelete(true);
      }
    }
    
    setSelectedImage(null);
    setImagePreview(null);
    
    // Réinitialiser l'input file
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const restoreExistingImage = () => {
    if (existingImage) {
      setImageToDelete(false);
      setSelectedImage(null);
      setImagePreview({
        url: existingImage.thumbnailBase64 || existingImage.base64,
        name: existingImage.filename || `image_${existingImage._id}`,
        size: existingImage.size || 0,
        type: existingImage.mimetype || 'image/jpeg',
        isExisting: true,
        id: existingImage._id
      });
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
      formDataToSend.append('category', formData.category);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('status', formData.status);
      
      if (formData.tags) {
        formDataToSend.append('tags', formData.tags);
      }
      
      // Gestion des images
      if (imageToDelete && existingImage) {
        formDataToSend.append('imageToDelete', existingImage._id);
      }
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }
      
      console.log('📤 Mise à jour des données...');
      
      // Envoyer la mise à jour au backend
      const response = await postService.updatePost(id, formDataToSend);
      
      console.log('✅ Réponse du serveur:', response);
      
      if (response.success) {
        setSuccess('Actualité mise à jour avec succès !');
        
        // Nettoyer la prévisualisation
        if (imagePreview && !imagePreview.isExisting && imagePreview.url) {
          URL.revokeObjectURL(imagePreview.url);
        }
        
        // Redirection après 2 secondes
        setTimeout(() => {
          navigate('/admin/posts');
        }, 2000);
      } else {
        setError(response.message || 'Erreur lors de la mise à jour de l\'actualité');
      }
      
    } catch (err) {
      console.error('❌ Erreur mise à jour:', err);
      setError(err.message || err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      setSaving(true);
      await postService.deletePost(id);
      
      setSuccess('Actualité supprimée avec succès !');
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
          <p className="text-gray-600">Chargement de l\'actualité...</p>
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
              Modifier l'actualité
            </h1>
            <p className="text-gray-600">
              Modifiez les champs souhaités (* = obligatoire)
            </p>
            <p className="text-sm text-blue-600 mt-2">
              ID de l'actualité: {id}
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
                    rows={10}
                    className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 placeholder-gray-500 resize-none"
                    placeholder="Décrivez en détail le contenu de votre actualité..."
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800 appearance-none"
                    >
                      <option value="publié">Publié</option>
                      <option value="brouillon">Brouillon</option>
                      <option value="archivé">Archivé</option>
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

          {/* Upload d'image */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Image d'illustration
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
                          {imagePreview.isExisting ? 'Image existante' : formatFileSize(imagePreview.size)}
                        </p>
                        {imageToDelete && imagePreview.isExisting && (
                          <p className="text-xs text-red-300">(Suppression demandée)</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current.click()}
                        className="flex-1 p-3 border-2 border-dashed border-purple-300/50 text-purple-600 rounded-xl hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 font-medium"
                      >
                        Changer d'image
                      </button>
                      
                      {imagePreview.isExisting && imageToDelete && (
                        <button
                          type="button"
                          onClick={restoreExistingImage}
                          className="flex-1 p-3 border-2 border-blue-300/50 text-blue-600 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 font-medium"
                        >
                          Restaurer l'image
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current.click()}
                    className="w-full p-8 border-2 border-dashed border-gray-300/50 rounded-xl hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-300 group/upload"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="font-medium text-gray-800 text-lg">Ajouter une image</p>
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG, GIF • Max 5MB • Stockée en base64
                      </p>
                      <p className="text-xs text-purple-600 mt-3">
                        ⓘ Vous ne pouvez sélectionner qu'une seule image
                      </p>
                    </div>
                  </button>
                )}
                
                {!imagePreview && existingImage && (
                  <p className="text-sm text-orange-600">
                    ⓘ L'image existante sera supprimée si vous n'en ajoutez pas de nouvelle
                  </p>
                )}
              </div>
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

export default EditActualite;