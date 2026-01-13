import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Image as ImageIcon, Loader } from 'lucide-react';
import { postService } from '../services/api';

const NewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadError, setImageLoadError] = useState({});

  useEffect(() => {
    fetchPosts();
    
    // Auto-slide
    const interval = setInterval(() => {
      if (posts.length > 1) {
        setCurrentSlide((prev) => (prev + 1) % posts.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [posts.length]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      console.log('📊 Réponse API posts:', response);
      
      if (response.success && response.posts) {
        // Filtrer seulement les posts publiés
        const publishedPosts = response.posts.filter(post => 
          post.status === 'publié' && post.isPublished === true
        );
        
        console.log('📸 Posts avec images base64:', publishedPosts.map(post => ({
          title: post.title,
          hasImages: post.images && post.images.length > 0,
          firstImage: post.images?.[0] ? {
            hasThumbnail: !!post.images[0].thumbnailBase64,
            thumbnailSize: post.images[0].thumbnailBase64 ? post.images[0].thumbnailBase64.length : 0
          } : null
        })));
        
        setPosts(publishedPosts);
      } else {
        setError(response.message || 'Erreur de chargement des posts');
      }
    } catch (err) {
      console.error('❌ Erreur fetchPosts:', err);
      setError('Impossible de charger les actualités');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = (post, index = 0) => {
    if (!post.images || post.images.length === 0) {
      console.log(`📭 Pas d'images pour: ${post.title}`);
      return null;
    }
    
    const image = post.images[index];
    if (!image) return null;
    
    // Vérifier si l'image a déjà échoué au chargement
    const imageKey = `${post._id}-${index}`;
    if (imageLoadError[imageKey]) {
      return null;
    }
    
    // Utiliser la fonction du service
    const imageUrl = postService.getImageUrl(image);
    
    console.log(`🖼️ Image pour ${post.title}:`, {
      hasThumbnail: !!image.thumbnailBase64,
      hasBase64: !!image.base64,
      url: imageUrl?.substring(0, 50) + '...'
    });
    
    return imageUrl;
  };

  // Gérer les erreurs de chargement d'image
  const handleImageError = (postId, imageIndex, e) => {
    console.error(`❌ Erreur chargement image pour post ${postId}:`, e);
    setImageLoadError(prev => ({
      ...prev,
      [`${postId}-${imageIndex}`]: true
    }));
  };

  // Image placeholder
  const getPlaceholderUrl = (title, index) => {
    const colors = ['003366', '0055AA', '0077CC', '0099EE'];
    const color = colors[index % colors.length];
    const text = encodeURIComponent(title?.substring(0, 20) || 'MPB');
    return `https://via.placeholder.com/800x400/${color}/FFFFFF?text=${text}`;
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Loading state
  if (loading) {
    return (
      <section id="actualites" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#003366] mb-4">
              Actualités du mouvement
            </h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 animate-spin text-[#003366]" />
            <span className="ml-3 text-gray-600">Chargement des actualités...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="actualites" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#003366] mb-4">
              Actualités du mouvement
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-4 py-2 bg-[#003366] text-white rounded hover:bg-[#0055AA] transition"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No posts state
  if (posts.length === 0) {
    return (
      <section id="actualites" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#003366] mb-4">
              Actualités du mouvement
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
              <ImageIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">
                Aucune actualité publiée pour le moment.
              </p>
              <p className="text-sm text-gray-600">
                Revenez bientôt pour découvrir nos dernières nouvelles.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentPost = posts[currentSlide];
  const currentImageUrl = getImageUrl(currentPost, 0);

  return (
    <section id="actualites" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#003366] mb-4">
            Actualités du mouvement
          </h2>
          <p className="text-gray-600">
            {posts.length} publication{posts.length > 1 ? 's' : ''} récente{posts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Carousel */}
        <div className="mb-12">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <div className="h-80 md:h-96 relative">
              {/* Image du carousel */}
              {currentImageUrl ? (
                <img 
                  src={currentImageUrl}
                  alt={currentPost.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={(e) => {
                    handleImageError(currentPost._id, 0, e);
                    e.target.src = getPlaceholderUrl(currentPost.title, currentSlide);
                  }}
                  loading="lazy"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, #003366, #0055AA)`
                  }}
                >
                  <div className="text-center text-white">
                    <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-bold px-4">{currentPost.title}</p>
                    <p className="mt-2 opacity-75">Aucune image disponible</p>
                  </div>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Contenu du carousel */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {currentPost.type || 'Actualité'}
                  </span>
                  <span className="text-sm text-white/90">
                    {formatDate(currentPost.publishDate)}
                  </span>
                  {currentPost.category && (
                    <span className="text-sm text-white/90">
                      • {currentPost.category}
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  {currentPost.title}
                </h3>
                
                <p className="text-white/90 mb-4 max-w-2xl line-clamp-2 md:line-clamp-3">
                  {currentPost.content?.substring(0, 200)}...
                </p>
                
                <div className="flex justify-between items-center">
                  <div>
                    {currentPost.author && (
                      <p className="text-sm text-white/80">
                        Par {currentPost.author.prenom} {currentPost.author.nom}
                      </p>
                    )}
                  </div>
                  
                  <Link 
                    to={`/actualites/${currentPost._id}`}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>Lire l'article</span>
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation dots */}
          {posts.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-8 bg-[#003366]' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Voir l'actualité ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Liste des posts récents */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post, index) => {
            const imageUrl = getImageUrl(post, 0);
            
            return (
              <div 
                key={post._id} 
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Image container */}
                <div className="h-56 overflow-hidden bg-gray-100 relative">
                  {imageUrl ? (
                    <img 
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        handleImageError(post._id, 0, e);
                        e.target.src = getPlaceholderUrl(post.title, index);
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, #003366, #0055AA)`
                      }}
                    >
                      <ImageIcon className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-[#003366] px-3 py-1 rounded-full text-xs font-bold">
                      {post.type || 'Actualité'}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-[#0055AA]">
                      {post.category || 'Politique'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.publishDate)}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-[#003366] transition-colors">
                    {post.title}
                  </h4>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.content?.substring(0, 150)}...
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {post.author && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#003366] flex items-center justify-center text-white text-xs font-bold">
                            {post.author.prenom?.[0]}{post.author.nom?.[0]}
                          </div>
                          <span className="text-sm text-gray-600">
                            {post.author.prenom}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to={`/actualites/${post._id}`}
                      className="flex items-center gap-1 text-[#003366] hover:text-[#0055AA] text-sm font-semibold transition-colors"
                    >
                      <span>Lire</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Voir plus */}
        {posts.length > 3 && (
          <div className="text-center mt-12">
            <Link 
              to="/actualites"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#0055AA] transition-colors font-semibold"
            >
              <span>Voir toutes les actualités</span>
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
