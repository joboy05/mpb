import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, MapPin, Image as ImageIcon } from 'lucide-react';

const Card = ({ article }) => {
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  // Détecter si c'est un événement
  const isEvent = article.type === 'événement';
  
  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = () => {
    if (!article.images || article.images.length === 0) {
      return null;
    }
    
    const mainImage = article.images.find(img => img.isMain) || article.images[0];
    if (!mainImage) return null;
    
    // Utiliser thumbnailBase64 d'abord
    if (mainImage.thumbnailBase64) {
      let base64Data = mainImage.thumbnailBase64;
      if (!base64Data.startsWith('data:')) {
        base64Data = `data:${mainImage.mimetype || 'image/jpeg'};base64,${base64Data}`;
      }
      return base64Data;
    }
    
    // Sinon utiliser base64 principal
    if (mainImage.base64) {
      let base64Data = mainImage.base64;
      if (!base64Data.startsWith('data:')) {
        base64Data = `data:${mainImage.mimetype || 'image/jpeg'};base64,${base64Data}`;
      }
      return base64Data;
    }
    
    return null;
  };

  const imageUrl = getImageUrl();
  
  // Placeholder avec couleur selon le type
  const getPlaceholderColor = () => {
    return isEvent 
      ? 'from-purple-600 to-purple-800' 
      : 'from-[#003366] to-[#0055AA]';
  };

  return (
    <Link to={`/actualites/${article._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
        
        {/* Section Image */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          {imageUrl ? (
            <div className="relative w-full h-full">
              <img 
                src={imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                  if (placeholder) placeholder.style.display = 'flex';
                }}
                loading="lazy"
              />
              {/* Placeholder qui apparaît en cas d'erreur */}
              <div className={`image-placeholder hidden w-full h-full items-center justify-center bg-gradient-to-br ${getPlaceholderColor()}`}>
                {isEvent ? (
                  <MapPin className="w-12 h-12 text-white/70" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-white/70" />
                )}
              </div>
            </div>
          ) : (
            // Placeholder par défaut si pas d'image
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getPlaceholderColor()}`}>
              {isEvent ? (
                <MapPin className="w-16 h-16 text-white/80" />
              ) : (
                <ImageIcon className="w-16 h-16 text-white/80" />
              )}
            </div>
          )}
          
          {/* Badge Catégorie */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              isEvent 
                ? 'bg-purple-600/90 text-white' 
                : 'bg-[#003366]/90 text-white'
            }`}>
              {isEvent ? 'Événement' : article.category || 'Actualité'}
            </span>
          </div>
          
          {/* Date de publication */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
              <Calendar className="w-3 h-3" />
              <span className="text-xs font-medium">
                {formatDate(article.publishDate || article.createdAt)}
              </span>
            </div>
          </div>
          
          {/* Compteur de vues */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm text-[#003366] px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount || 0}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 flex-grow flex flex-col">
          
          {/* Titre */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#003366] transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          {/* Extrait du contenu */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {article.content && article.content.length > 150 
              ? `${article.content.substring(0, 150)}...` 
              : article.content || "Découvrez cette publication"}
          </p>

          {/* Métadonnées */}
          <div className="space-y-3 mt-auto">
            {/* Auteur */}
            {article.author && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-8 h-8 bg-gradient-to-br from-[#003366] to-[#004488] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {article.author.prenom?.[0] || article.author.nom?.[0] || 'A'}
                </div>
                <div>
                  <span className="font-medium">
                    {article.author.prenom} {article.author.nom}
                  </span>
                </div>
              </div>
            )}
            
            {/* Compteur de vues */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{article.viewCount || 0} vues</span>
              </div>
              
              {/* Tags count */}
              {article.tags && article.tags.length > 0 && (
                <span className="text-xs text-gray-400">
                  {article.tags.length} tag{article.tags.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Tags visibles */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {article.tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {article.tags.length > 2 && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
                    +{article.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bouton Lire */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isEvent
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-200'
                : 'bg-gradient-to-r from-[#003366] to-[#004488] text-white hover:shadow-lg hover:shadow-blue-200'
            }`}>
              <span>{isEvent ? 'Voir les détails' : 'Lire l\'article'}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;