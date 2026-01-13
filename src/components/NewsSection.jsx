// components/NewsSection.js - VERSION AVEC DEBOGAGE
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { postService } from '../services/api';

const NewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      console.log('📊 Réponse API:', response);
      
      if (response.success && response.posts) {
        const publishedPosts = response.posts.filter(post => 
          post.status === 'publié' && post.isPublished === true
        );
        console.log('📸 Posts avec images:', publishedPosts.map(p => ({
          title: p.title,
          images: p.images,
          imageUrl: p.images?.[0]?.url
        })));
        setPosts(publishedPosts);
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // Fonction SIMPLE pour les images
  const getImageUrl = (post) => {
    if (!post.images || post.images.length === 0) {
      console.log('📭 Pas d\'images pour:', post.title);
      return null;
    }
    
    const image = post.images[0];
    if (!image || !image.url) {
      console.log('📭 Pas d\'URL pour:', post.title);
      return null;
    }
    
    // Utilise la fonction du service
    const url = postService.getImageUrl(image.url);
    console.log('🖼️ Image URL pour', post.title, ':', url);
    return url;
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <section id="actualites" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-4">
            Actualités du mouvement
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto"></div>
        </div>
      </section>
    );
  }

  // Si pas de posts, affiche un message
  if (posts.length === 0) {
    return (
      <section id="actualites" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-4">
            Actualités du mouvement
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
            <ImageIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-4">
              Aucune publication n'a encore été créée.
            </p>
            <p className="text-sm text-gray-600">
              Connectez-vous en tant qu'administrateur pour créer des publications.
            </p>
          </div>
        </div>
      </section>
    );
  }

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
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <div className="h-80 md:h-96">
              {posts[currentSlide] && (() => {
                const post = posts[currentSlide];
                const imageUrl = getImageUrl(post);
                
                console.log('🎨 Carousel image pour', post.title, ':', imageUrl);
                
                return (
                  <>
                    {imageUrl ? (
                      <img 
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('❌ Erreur chargement image:', e);
                          e.target.src = 'https://via.placeholder.com/800x400/003366/FFFFFF?text=MPB';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[#003366] to-[#0055AA] flex items-center justify-center">
                        <div className="text-center text-white">
                          <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                          <p className="text-xl font-bold">{post.title}</p>
                          <p className="mt-2 opacity-75">Aucune image disponible</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">
                          {post.type || 'Actualité'}
                        </span>
                        <span className="text-sm">
                          {formatDate(post.publishDate)}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">
                        {post.title}
                      </h3>
                      <p className="text-white/90 mb-4 max-w-2xl line-clamp-2">
                        {post.content?.substring(0, 150)}...
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
          
          {posts.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full ${
                    index === currentSlide ? 'w-8 bg-[#003366]' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Liste des posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => {
            const imageUrl = getImageUrl(post);
            
            return (
              <div key={post._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden bg-gray-100">
                  {imageUrl ? (
                    <img 
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('❌ Erreur image card:', e);
                        e.target.src = 'https://via.placeholder.com/400x300/003366/FFFFFF?text=MPB';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#003366] to-[#0055AA] flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-semibold text-[#003366]">
                      {post.type || 'Actualité'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.publishDate)}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.content?.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between">
                    {post.eventLocation && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        <span>{post.eventLocation}</span>
                      </div>
                    )}
                    <Link 
                      to={`/actualites/${post._id}`}
                      className="text-[#003366] hover:text-[#0055AA] text-sm font-semibold"
                    >
                      Lire plus
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;