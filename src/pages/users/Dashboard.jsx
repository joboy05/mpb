import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FileText, 
  Bell, 
  Award, 
  TrendingUp,
  MapPin,
  BarChart,
  Filter,
  Shield,
  Home,
  Settings,
  Search,
  LogOut,
  UserCog,
  Mail
} from 'lucide-react';
import { authAPI } from '../../api/auth';
import { postService } from '../../services/postService';

// ==================== UTILITAIRE D'URL D'IMAGES CORRIGÉ ====================
const getImageUrl = (img) => {
  if (!img || !img.url) {
    return 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=MPB+Image';
  }
  
  let url = img.url;
  console.log('URL image reçue:', url); // Debug
  
  // Cas 1: URL complète
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Cas 2: URL commence par /uploads
  if (url.startsWith('/uploads')) {
    // Vérifier si c'est dans images/ ou directement dans uploads/
    const fullUrl = `http://localhost:5000${url}`;
    
    // Test si l'image existe
    fetch(fullUrl, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          console.warn('Image non trouvée:', fullUrl);
          // Essayer avec /uploads/images/
          const alternativeUrl = fullUrl.replace('/uploads/', '/uploads/images/');
          console.log('Essai URL alternative:', alternativeUrl);
        }
      })
      .catch(err => console.error('Erreur test image:', err));
    
    return fullUrl;
  }
  
  // Cas 3: Juste un nom de fichier
  if (url.includes('.')) {
    // Essayer deux chemins possibles
    return `http://localhost:5000/uploads/images/${url}`;
  }
  
  // Fallback
  return 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Image+MPB';
};

const getFileUrl = (file) => {
  if (!file || !file.url) return null;
  
  let url = file.url;
  
  if (url.startsWith('/uploads')) {
    return `http://localhost:5000${url}`;
  }
  
  if (!url.startsWith('http')) {
    return `http://localhost:5000/uploads/${url}`;
  }
  
  return url;
};

// ==================== COMPOSANT POST CARD CORRIGÉ ====================
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
    if (!dateString) return '';
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
          Par {post.author?.prenom || 'Admin'} {post.author?.nom || 'MPB'}
        </span>
        {post.author?.role === 'admin' && (
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
            <span>👑</span> Admin
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="text-gray-700 mb-4 leading-relaxed">
        {post.content && post.content.length > 200 
          ? `${post.content.substring(0, 200)}...` 
          : post.content}
      </div>

      {/* Images - CORRIGÉ AVEC FALLBACK */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {post.images.map((img, index) => {
              const imageUrl = getImageUrl(img);
              
              return (
                <div key={index} className="relative flex-shrink-0">
                  <img 
                    src={imageUrl}
                    alt={img.caption || post.title}
                    className="h-48 w-auto object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity cursor-pointer"
                    onError={(e) => {
                      console.error('Image non chargée:', imageUrl);
                      e.target.onerror = null; // Éviter la boucle infinie
                      // Fallback vers une image placeholder
                      e.target.src = `https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=${encodeURIComponent('Image MPB')}`;
                    }}
                  />
                  {img.caption && (
                    <p className="text-xs text-gray-500 mt-1 text-center">{img.caption}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PDF */}
      {post.pdfUrl && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <a 
            href={getFileUrl({ url: post.pdfUrl })} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <span className="text-lg">📄</span>
            Document PDF à télécharger
          </a>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
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

// ==================== COMPOSANT FILTRES ====================
const Filters = ({ filters, onFilterChange }) => {
  const categories = ['politique', 'social', 'économique', 'culturel', 'éducation', 'santé', 'environnement', 'autre'];
  const types = ['événement', 'actualité', 'communiqué', 'annonce', 'article', 'manifeste', 'programme'];

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select 
            value={filters.category} 
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type spécifique
          </label>
          <select 
            value={filters.type} 
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            <option value="">Tous les types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trier par
          </label>
          <select 
            value={filters.sort} 
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            <option value="-publishDate">Plus récent</option>
            <option value="publishDate">Plus ancien</option>
            <option value="-viewCount">Plus vues</option>
            <option value="-likes">Plus likés</option>
            <option value="-eventDate">Événements proches</option>
          </select>
        </div>
      </div>

      {/* Filtres supplémentaires */}
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
          <input 
            type="checkbox" 
            checked={filters.featured}
            onChange={(e) => onFilterChange('featured', e.target.checked)}
            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
          />
          <span className="font-medium">À la une seulement</span>
        </label>

        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
          <input 
            type="checkbox" 
            checked={filters.withImages || false}
            onChange={(e) => onFilterChange('withImages', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">Avec images</span>
        </label>

        <button
          onClick={() => {
            onFilterChange('category', '');
            onFilterChange('type', '');
            onFilterChange('featured', false);
            onFilterChange('withImages', false);
            onFilterChange('sort', '-publishDate');
          }}
          className="text-gray-600 hover:text-gray-900 font-medium text-sm"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};

// ==================== COMPOSANT SIDEBAR ====================
const Sidebar = ({ currentMember, memberStats, filters, onFilterChange, postCount }) => {
  const departments = [
    'Littoral', 'Atlantique', 'Ouémé', 'Mono', 'Couffo', 
    'Zou', 'Collines', 'Plateau', 'Borgou', 'Alibori', 
    'Donga', 'Atacora'
  ];

  const quickCategories = [
    { name: 'Politique', value: 'politique', icon: '🏛️' },
    { name: 'Événements', value: 'événement', icon: '📅' },
    { name: 'Actualités', value: 'actualité', icon: '📰' },
    { name: 'Social', value: 'social', icon: '👥' },
    { name: 'Économique', value: 'économique', icon: '💰' },
    { name: 'Culturel', value: 'culturel', icon: '🎭' }
  ];

  const upcomingEvents = [
    { title: 'Assemblée Générale Annuelle', date: '2024-12-15', location: 'Cotonou' },
    { title: 'Collecte de fonds', date: '2024-12-20', location: 'Porto-Novo' },
    { title: 'Formation leadership', date: '2024-12-25', location: 'Parakou' }
  ];

  return (
    <div className="space-y-6">
      {/* Profil Membre */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {currentMember?.prenom?.charAt(0)}{currentMember?.nom?.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              {currentMember?.prenom} {currentMember?.nom}
            </h3>
            <p className="text-sm text-gray-600">{currentMember?.membershipNumber}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                {currentMember?.role === 'admin' ? 'Administrateur' : 'Membre'}
              </span>
              <span className="text-xs text-gray-500">
                {currentMember?.department}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Engagements</div>
            <div className="text-lg font-bold text-gray-800">
              {memberStats?.totalEngagements || 0}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Événements</div>
            <div className="text-lg font-bold text-gray-800">
              {memberStats?.eventsAttended || 0}
            </div>
          </div>
        </div>

        <Link 
          to="/mon-profil" 
          className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg text-center transition-colors"
        >
          Voir mon profil complet
        </Link>
      </div>

      {/* Filtres rapides */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtres rapides
        </h3>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Par catégorie</h4>
            <div className="flex flex-wrap gap-2">
              {quickCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onFilterChange('category', cat.value)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filters?.category === cat.value
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Par département</h4>
            <select 
              value={filters?.department || ''}
              onChange={(e) => onFilterChange('department', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            >
              <option value="">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              onFilterChange('category', '');
              onFilterChange('department', '');
            }}
            className="w-full text-gray-600 hover:text-gray-900 font-medium text-sm py-2"
          >
            Effacer les filtres
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Statistiques
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Contenus affichés</span>
            <span className="font-bold text-gray-800">{postCount}</span>
          </div>
          
          {memberStats && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vos likes</span>
                <span className="font-bold text-green-600">{memberStats.totalLikes || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vos commentaires</span>
                <span className="font-bold text-blue-600">{memberStats.totalComments || 0}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Niveau d'engagement: 
                  <span className="ml-2 font-medium text-green-600">
                    {memberStats.engagementLevel || 'Débutant'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Événements à venir */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border border-red-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-600" />
          Événements à venir
        </h3>
        
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-red-100">
              <div className="font-medium text-gray-800 mb-1">{event.title}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
            </div>
          ))}
          
          <Link 
            to="/evenements" 
            className="block text-center text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Voir tous les événements →
          </Link>
        </div>
      </div>

      {/* Actions rapides pour admin */}
      {currentMember?.role === 'admin' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Actions Admin
          </h3>
          
          <div className="space-y-3">
            <Link 
              to="/admin/nouveau-contenu" 
              className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-center transition-colors"
            >
              + Créer un contenu
            </Link>
            <Link 
              to="/admin/membres" 
              className="block bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 rounded-lg text-center transition-colors"
            >
              👥 Gérer les membres
            </Link>
            <Link 
              to="/admin/content" 
              className="block bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-center transition-colors"
            >
              📝 Gérer les publications
            </Link>
          </div>
        </div>
      )}

      {/* Infos mouvement */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Le mouvement
        </h3>
        
        <div className="space-y-3">
          <p className="text-gray-600 text-sm leading-relaxed">
            Le Mouvement Patriotique du Bénin rassemble les citoyens engagés pour 
            le développement et la prospérité de notre nation.
          </p>
          
          <div className="flex gap-4 pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">24K+</div>
              <div className="text-xs text-gray-500">Membres</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">156</div>
              <div className="text-xs text-gray-500">Communes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">12</div>
              <div className="text-xs text-gray-500">Départements</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPOSANT DASHBOARD STATS ====================
const DashboardStats = ({ memberStats }) => {
  if (!memberStats) return null;

  return (
    <div className="flex flex-wrap gap-4">
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
        <div className="text-sm opacity-90">Engagements</div>
        <div className="text-2xl font-bold">{memberStats.totalEngagements || 0}</div>
      </div>
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
        <div className="text-sm opacity-90">Événements</div>
        <div className="text-2xl font-bold">{memberStats.eventsAttended || 0}</div>
      </div>
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
        <div className="text-sm opacity-90">Membre depuis</div>
        <div className="text-lg font-bold">
          {memberStats.joinDate 
            ? new Date(memberStats.joinDate).getFullYear()
            : new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

// ==================== COMPOSANT PRINCIPAL DASHBOARD CORRIGÉ ====================
const Dashboard = () => {
  const navigate = useNavigate();
  const [currentMember, setCurrentMember] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    sort: '-publishDate',
    featured: false,
    withImages: false,
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [memberStats, setMemberStats] = useState({
    totalEngagements: 0,
    eventsAttended: 0,
    totalLikes: 0,
    totalComments: 0,
    engagementLevel: 'Débutant',
    joinDate: new Date().toISOString()
  });

  // Vérifier l'authentification
  useEffect(() => {
    const member = authAPI.getCurrentMember();
    if (!member) {
      navigate('/login');
      return;
    }
    setCurrentMember(member);
    
    // Charger les stats mockées (à remplacer par l'API quand elle sera prête)
    setMemberStats({
      totalEngagements: Math.floor(Math.random() * 50) + 5,
      eventsAttended: Math.floor(Math.random() * 10) + 1,
      totalLikes: Math.floor(Math.random() * 100) + 10,
      totalComments: Math.floor(Math.random() * 30) + 2,
      engagementLevel: ['Débutant', 'Actif', 'Très actif'][Math.floor(Math.random() * 3)],
      joinDate: member.dateInscription || new Date().toISOString()
    });
  }, [navigate]);

  // ==================== CORRECTION : CHARGER LES POSTS VIA API RÉELLE ====================
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { 
        ...filters,
        // Assurez-vous que les paramètres sont au bon format
        sortBy: filters.sort
      };
      
      // Nettoyer les paramètres vides
      if (!params.category) delete params.category;
      if (!params.type) delete params.type;
      if (!params.withImages) delete params.withImages;
      if (params.sort) {
        params.sortBy = params.sort;
        delete params.sort;
      }
      
      console.log('Chargement des posts avec params:', params);
      
      // APPEL API RÉEL - version 1 (getAllPosts)
      let response;
      try {
        response = await postService.getAllPosts(params);
        console.log('Réponse API posts:', response);
      } catch (apiError) {
        console.error('Erreur API posts:', apiError);
        // Fallback à une API alternative si disponible
        if (postService.getPosts) {
          response = await postService.getPosts(params);
        } else {
          throw apiError;
        }
      }
      
      // Vérifier la structure de la réponse
      if (response && (response.posts || response.data)) {
        const postsData = response.posts || response.data || [];
        setPosts(postsData);
        setPagination({
          total: response.total || response.count || postsData.length,
          pages: response.pages || 1,
          currentPage: response.page || 1
        });
      } else {
        console.warn('Structure de réponse API inattendue:', response);
        setPosts([]);
        setPagination({
          total: 0,
          pages: 1,
          currentPage: 1
        });
      }
      
    } catch (err) {
      console.error('Erreur chargement publications:', err);
      
      // Fallback pour le développement - données minimales
      const fallbackPosts = [
        {
          _id: '1',
          title: 'Test Publication',
          type: 'actualité',
          category: 'politique',
          content: 'Ceci est une publication de test pour vérifier l\'affichage.',
          publishDate: new Date().toISOString(),
          author: { prenom: 'Admin', nom: 'MPB', role: 'admin' },
          likes: [],
          dislikes: [],
          viewCount: 0,
          tags: ['test'],
          images: [
            { 
              url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
              caption: 'Image de test'
            }
          ]
        }
      ];
      
      setPosts(fallbackPosts);
      setPagination({
        total: 1,
        pages: 1,
        currentPage: 1
      });
      
      setError('Mode développement : API non disponible, affichage de données de test');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ==================== CORRECTION : RECHERCHE VIA API RÉELLE ====================
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadPosts();
      return;
    }

    try {
      setIsSearching(true);
      
      // APPEL API RÉEL pour la recherche
      let searchResponse;
      if (postService.searchPosts) {
        searchResponse = await postService.searchPosts(searchQuery);
      } else if (postService.getPosts) {
        // Fallback : filtrer localement
        searchResponse = { posts: posts.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        ) };
      } else {
        throw new Error('Service de recherche non disponible');
      }
      
      setPosts(searchResponse.posts || []);
      setPagination({
        total: searchResponse.count || searchResponse.posts?.length || 0,
        pages: 1,
        currentPage: 1
      });
    } catch (err) {
      console.error('Erreur recherche:', err);
      setError(err.message || 'Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  // ==================== CORRECTION : GESTION DES LIKES/DISLIKES ====================
  const handleLike = async (postId) => {
    try {
      // Optimistic UI update
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          const hasLiked = post.likes?.some(like => 
            typeof like === 'object' ? like._id === currentMember._id : like === currentMember._id
          );
          
          return {
            ...post,
            likes: hasLiked 
              ? post.likes.filter(id => 
                  typeof id === 'object' ? id._id !== currentMember._id : id !== currentMember._id
                )
              : [...(post.likes || []), currentMember._id],
            dislikes: post.dislikes?.filter(id => 
              typeof id === 'object' ? id._id !== currentMember._id : id !== currentMember._id
            )
          };
        }
        return post;
      }));
      
      // Appel API réel
      if (postService.likePost) {
        await postService.likePost(postId);
      }
    } catch (error) {
      console.error('Erreur like:', error);
      alert(error.message || 'Erreur lors du like');
      // Recharger les posts pour revenir à l'état initial
      loadPosts();
    }
  };

  const handleDislike = async (postId) => {
    try {
      // Optimistic UI update
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          const hasDisliked = post.dislikes?.some(dislike => 
            typeof dislike === 'object' ? dislike._id === currentMember._id : dislike === currentMember._id
          );
          
          return {
            ...post,
            dislikes: hasDisliked 
              ? post.dislikes.filter(id => 
                  typeof id === 'object' ? id._id !== currentMember._id : id !== currentMember._id
                )
              : [...(post.dislikes || []), currentMember._id],
            likes: post.likes?.filter(id => 
              typeof id === 'object' ? id._id !== currentMember._id : id !== currentMember._id
            )
          };
        }
        return post;
      }));
      
      // Appel API réel
      if (postService.dislikePost) {
        await postService.dislikePost(postId);
      }
    } catch (error) {
      console.error('Erreur dislike:', error);
      alert(error.message || 'Erreur lors du dislike');
      // Recharger les posts pour revenir à l'état initial
      loadPosts();
    }
  };

  // Changement de filtre
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1
    }));
  };

  // Charger les publications
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (!currentMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête selon le rôle */}
      {currentMember.role === 'admin' ? (
        // En-tête Admin
        <div className="bg-gradient-to-r from-[#003366] to-[#0055AA] text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Tableau de bord Administrateur</h1>
                <p className="opacity-90">Gérez les membres et les activités du MPB</p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Link 
                  to="/admin/nouveau-contenu" 
                  className="bg-white text-[#003366] hover:bg-gray-100 font-semibold px-5 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>+</span> Nouveau contenu
                </Link>
                <Link 
                  to="/admin/membres" 
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>👥</span> Gérer les membres
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // En-tête Membre
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Bienvenue, {currentMember.prenom} {currentMember.nom}
                </h1>
                <p className="opacity-90">
                  {currentMember.membershipNumber || 'Membre MPB'} • {currentMember.department || 'Bénin'}
                </p>
              </div>
              <DashboardStats memberStats={memberStats} />
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche commune */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rechercher des événements, actualités, communiqués..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
              />
              <button 
                type="submit" 
                disabled={isSearching}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Recherche...
                  </div>
                ) : (
                  '🔍 Rechercher'
                )}
              </button>
            </div>
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => {
                  setSearchQuery('');
                  loadPosts();
                }}
                className="absolute right-32 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕ Effacer
              </button>
            )}
          </form>
        </div>

        {/* Filtres avec onglets */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Événements & Actualités</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleFilterChange('type', '')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filters.type === '' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => handleFilterChange('type', 'événement')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filters.type === 'événement' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📅 Événements
              </button>
              <button
                onClick={() => handleFilterChange('type', 'actualité')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filters.type === 'actualité' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📰 Actualités
              </button>
              <button
                onClick={() => handleFilterChange('type', 'communiqué')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filters.type === 'communiqué' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📢 Communiqués
              </button>
            </div>
          </div>
          
          {/* Filtres avancés */}
          <Filters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Chargement des contenus...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={loadPosts} 
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg"
                >
                  Réessayer
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucun contenu trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `Aucun résultat pour "${searchQuery}"`
                    : 'Aucun contenu disponible pour le moment.'}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      loadPosts();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg"
                  >
                    Voir tous les contenus
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Statistiques */}
                <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-white rounded-lg border border-gray-200">
                  <span className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-lg">📄</span>
                    {pagination.total} contenu{pagination.total > 1 ? 's' : ''}
                  </span>
                  {searchQuery && (
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <span className="text-lg">🔍</span>
                      Résultats pour "{searchQuery}"
                    </span>
                  )}
                  {filters.featured && (
                    <span className="flex items-center gap-2 text-yellow-600 font-medium">
                      <span className="text-lg">🌟</span>
                      À la une
                    </span>
                  )}
                </div>

                {/* Liste des contenus */}
                <div>
                  {posts.map(post => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onLike={handleLike}
                      onDislike={handleDislike}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar 
              currentMember={currentMember}
              memberStats={memberStats}
              filters={filters}
              onFilterChange={handleFilterChange}
              postCount={pagination.total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;