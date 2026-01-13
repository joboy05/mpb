import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api/auth';

// Fonctions utilitaires pour les fichiers
const getFileIcon = (filename) => {
  if (!filename) return '📎';
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
  if (ext === 'pdf') return '📄';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['xls', 'xlsx'].includes(ext)) return '📊';
  if (['ppt', 'pptx'].includes(ext)) return '📑';
  if (ext === 'txt') return '📄';
  return '📎';
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const PostCard = ({ post, onLike, onDislike }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const currentMember = authAPI.getCurrentMember();

  const handleLike = async () => {
    if (!currentMember || isLiking || isDisliking) return;
    
    setIsLiking(true);
    try {
      await onLike(post._id);
    } catch (error) {
      console.error('Erreur like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!currentMember || isLiking || isDisliking) return;
    
    setIsDisliking(true);
    try {
      await onDislike(post._id);
    } catch (error) {
      console.error('Erreur dislike:', error);
    } finally {
      setIsDisliking(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const userLiked = currentMember && post.likes?.some(like => 
    typeof like === 'object' ? like._id === currentMember._id : like === currentMember._id
  );
  const userDisliked = currentMember && post.dislikes?.some(dislike => 
    typeof dislike === 'object' ? dislike._id === currentMember._id : dislike === currentMember._id
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Badge de type */}
      <div className="mb-4">
        {post.type === 'événement' && (
          <div className="border-l-4 border-red-600 pl-4">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
              📅 Événement
            </span>
            {post.eventDate && (
              <div className="text-gray-600 text-sm mt-1">
                {new Date(post.eventDate).toLocaleDateString('fr-FR')}
                {post.eventLocation && ` • ${post.eventLocation}`}
              </div>
            )}
          </div>
        )}
        
        {post.type === 'actualité' && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
            📰 Actualité
          </span>
        )}
        
        {post.type === 'communiqué' && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
            📢 Communiqué
          </span>
        )}
      </div>

      {/* Titre et date */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 hover:text-red-600 transition-colors">
          <Link to={`/post/${post._id}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <div className="text-gray-500 text-sm">
          {formatDate(post.publishDate)}
        </div>
      </div>

      {/* Auteur */}
      <div className="flex items-center gap-2 text-gray-600 mb-3">
        <span className="font-medium">
          Par {post.author?.prenom} {post.author?.nom}
        </span>
        {post.author?.role === 'admin' && (
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
            <span>👑</span> Admin
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="text-gray-700 mb-4 leading-relaxed">
        {post.content.length > 200 
          ? `${post.content.substring(0, 200)}...` 
          : post.content}
      </div>

      {/* ============ SECTION IMAGES ============ */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {post.images.map((img, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img 
                  src={`http://localhost:5000${img.url}`}
                  alt={img.caption || post.title}
                  className="h-48 w-auto object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity cursor-pointer"
                  onClick={() => window.open(`http://localhost:5000${img.url}`, '_blank')}
                />
                {img.caption && (
                  <p className="text-xs text-gray-500 mt-1 text-center">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {post.images.length} photo{post.images.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* ============ SECTION FICHIERS ============ */}
      {post.files && post.files.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <span>📎</span> Documents joints ({post.files.length})
          </h4>
          <div className="space-y-2">
            {post.files.map((file, index) => (
              <a
                key={index}
                href={`http://localhost:5000${file.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                download
              >
                <div className="text-2xl">
                  {getFileIcon(file.filename || file.originalName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate group-hover:text-blue-600">
                    {file.originalName || file.filename}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                    {file.fileType && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {file.fileType.toUpperCase()}
                      </span>
                    )}
                    {file.downloads > 0 && (
                      <span className="text-xs text-gray-500">
                        📥 {file.downloads} téléchargement{file.downloads > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-blue-600 text-lg">↓</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Interactions */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex gap-4 mb-4 sm:mb-0">
          <button 
            onClick={handleLike}
            disabled={!currentMember || isLiking || isDisliking}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              userLiked 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${(!currentMember || isLiking || isDisliking) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-lg">👍</span>
            <span className="font-semibold">{post.likes?.length || 0}</span>
            {isLiking && <span className="animate-pulse">...</span>}
          </button>

          <button 
            onClick={handleDislike}
            disabled={!currentMember || isLiking || isDisliking}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              userDisliked 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${(!currentMember || isLiking || isDisliking) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-lg">👎</span>
            <span className="font-semibold">{post.dislikes?.length || 0}</span>
            {isDisliking && <span className="animate-pulse">...</span>}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-gray-600 text-sm">
            <span>👁️</span>
            <span>{post.viewCount || 0} vues</span>
          </span>
          <Link 
            to={`/post/${post._id}`} 
            className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
          >
            Lire la suite
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;