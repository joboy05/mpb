import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FileText, 
  Search,
  LogOut,
  User,
  Eye,
  MapPin
} from 'lucide-react';
import { authAPI } from '../../api/auth';
import { postService } from '../../services/postService';
import Navbar from '../../components/users/Navbar';

// ==================== UTILITAIRE D'IMAGES ====================
const getImageUrl = (img) => {
  if (!img) return null;
  
  // Même logique que Card.jsx
  if (img.thumbnailBase64) {
    let base64Data = img.thumbnailBase64;
    if (!base64Data.startsWith('data:')) {
      base64Data = `data:${img.mimetype || img.contentType || 'image/jpeg'};base64,${base64Data}`;
    }
    return base64Data;
  }
  
  if (img.base64) {
    let base64Data = img.base64;
    if (!base64Data.startsWith('data:')) {
      base64Data = `data:${img.mimetype || img.contentType || 'image/jpeg'};base64,${base64Data}`;
    }
    return base64Data;
  }
  
  if (img.data && img.data.startsWith('data:image')) {
    return img.data;
  }
  
  if (img.data && !img.data.startsWith('data:') && img.data.length > 100) {
    const contentType = img.contentType || img.mimetype || 'image/jpeg';
    return `data:${contentType};base64,${img.data}`;
  }
  
  if (img.url && (img.url.startsWith('http://') || img.url.startsWith('https://'))) {
    return img.url;
  }
  
  if (img.url && img.url.startsWith('data:')) {
    return img.url;
  }
  
  return null;
};

// ==================== COMPOSANT POST CARD SIMPLIFIÉ ====================
const PostCard = ({ post }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isEvent = post.type === 'événement';
  const mainImage = post.images?.find(img => img.isMain) || post.images?.[0];
  const imageUrl = mainImage ? getImageUrl(mainImage) : null;
  
  const getPlaceholderColor = () => {
    return isEvent 
      ? 'from-purple-600 to-purple-800' 
      : 'from-[#003366] to-[#002244]';
  };

  return (
    <Link to={`/actualites/${post._id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-[#FFD700]/50">
        
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getPlaceholderColor()}`}>
              {isEvent ? (
                <MapPin className="w-12 h-12 text-white/70" />
              ) : (
                <div className="w-12 h-12 text-white/70 flex items-center justify-center text-4xl">📄</div>
              )}
            </div>
          )}
          
          {/* Badge type */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              isEvent 
                ? 'bg-purple-600/90 text-white' 
                : post.type === 'actualité'
                ? 'bg-blue-600/90 text-white'
                : 'bg-green-600/90 text-white'
            }`}>
              {isEvent ? '📅 Événement' : post.type === 'actualité' ? '📰 Actualité' : '📢 Communiqué'}
            </span>
          </div>
          
          {/* Vues */}
          <div className="absolute top-3 right-3">
            <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.viewCount || 0}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#003366] transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.content && post.content.length > 120 
              ? `${post.content.substring(0, 120)}...` 
              : post.content || "Découvrez cette publication"}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span>{formatDate(post.publishDate || post.createdAt)}</span>
            {post.author && (
              <span className="font-medium">
                Par {post.author.prenom} {post.author.nom}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
const Dashboard = () => {
  const navigate = useNavigate();
  const [currentMember, setCurrentMember] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const member = authAPI.getCurrentMember();
    if (!member) {
      navigate('/login');
      return;
    }
    setCurrentMember(member);
  }, [navigate]);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiParams = {
        page: 1,
        limit: 20,
        sort: '-publishDate'
      };
      
      if (filterType) apiParams.type = filterType;
      
      let response;
      if (postService.getAllPosts) {
        response = await postService.getAllPosts(apiParams);
      } else if (postService.getPosts) {
        response = await postService.getPosts(apiParams);
      } else {
        throw new Error('Service posts non configuré');
      }
      
      let postsData = [];
      if (Array.isArray(response)) {
        postsData = response;
      } else if (response.posts) {
        postsData = response.posts;
      } else if (response.data) {
        postsData = response.data;
      }
      
      setPosts(postsData);
      
    } catch (err) {
      console.error('Erreur chargement:', err);
      
      // Données démo
      const demoPosts = [
        {
          _id: 'demo1',
          title: 'Assemblée Générale du MPB',
          type: 'événement',
          category: 'politique',
          content: 'Le Mouvement Patriotique du Bénin organise son assemblée générale annuelle.',
          publishDate: new Date().toISOString(),
          author: { prenom: 'Jean', nom: 'Doe' },
          viewCount: 42,
          images: []
        },
        {
          _id: 'demo2',
          title: 'Nouvelle Initiative Sociale',
          type: 'actualité',
          category: 'social',
          content: 'Le MPB lance une initiative pour soutenir les communautés rurales.',
          publishDate: new Date(Date.now() - 86400000).toISOString(),
          author: { prenom: 'Marie', nom: 'Kouassi' },
          viewCount: 28,
          images: []
        }
      ];
      
      setPosts(demoPosts);
      setError('Mode développement actif');
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadPosts();
      return;
    }
    
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPosts(filtered);
  };

  const filteredPosts = posts.filter(post => {
    if (!filterType) return true;
    return post.type === filterType;
  });

  if (!currentMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentMember={currentMember} />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#003366] to-[#002244] text-white py-12 shadow-2xl border-b border-[#FFD700]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] bg-clip-text text-transparent">
                Bienvenue, {currentMember.prenom}
              </h1>
              <p className="text-white/80 text-lg">
                {currentMember.membershipNumber} • {currentMember.department || 'Bénin'}
              </p>
            </div>
            {currentMember.role === 'admin' && (
              <Link 
                to="/admin/nouveau-contenu"
                className="px-6 py-3 bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] rounded-xl font-bold hover:shadow-2xl transition-all"
              >
                + Nouveau contenu
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Recherche et filtres */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent"
            />
            <button 
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#002244] text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Rechercher
            </button>
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterType('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === '' 
                  ? 'bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterType('événement')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'événement' 
                  ? 'bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📅 Événements
            </button>
            <button
              onClick={() => setFilterType('actualité')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'actualité' 
                  ? 'bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📰 Actualités
            </button>
            <button
              onClick={() => setFilterType('communiqué')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'communiqué' 
                  ? 'bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📢 Communiqués
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : error ? (
          <div className="bg-blue-50 border-l-4 border-[#FFD700] rounded-xl p-6 text-center">
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun contenu</h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `Aucun résultat pour "${searchQuery}"`
                : 'Aucun contenu disponible'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;