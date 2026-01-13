import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/postService';
import { authAPI } from '../../api/auth';
import { ArrowLeft, Search, Filter, Trash2, Edit, Eye, Calendar, FileText, Users, Star, Plus } from 'lucide-react';

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('tous');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const currentMember = authAPI.getCurrentMember();

  const loadPosts = useCallback(async () => {
    if (!currentMember || currentMember.role !== 'admin') {
      setLoading(false);
      return;
    }

    if (initialLoadDone && posts.length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await postService.getAllPosts();
      setPosts(response.posts || []);
      setInitialLoadDone(true);
    } catch (err) {
      console.error('Erreur chargement publications:', err);
      setError(err.message || 'Erreur de chargement des publications');
    } finally {
      setLoading(false);
    }
  }, [currentMember, initialLoadDone, posts.length]);

  useEffect(() => {
    let mounted = true;

    const fetchPosts = async () => {
      if (mounted) {
        await loadPosts();
      }
    };

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, [loadPosts]);

  const filteredPosts = React.useMemo(() => {
    return posts.filter(post => {
      if (filter !== 'tous' && post.type !== filter) return false;
      if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [posts, filter, searchQuery]);

  const toggleSelectPost = useCallback((postId) => {
    setSelectedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post._id));
    }
  }, [filteredPosts, selectedPosts.length]);

  const handleDeletePost = useCallback(async (postIdOrArray) => {
    try {
      if (Array.isArray(postIdOrArray)) {
        await Promise.all(postIdOrArray.map(id => 
          postService.deletePost(id).catch(err => {
            console.error(`Erreur suppression post ${id}:`, err);
          })
        ));
        setPosts(prev => prev.filter(post => !postIdOrArray.includes(post._id)));
        setSelectedPosts([]);
      } else {
        await postService.deletePost(postIdOrArray);
        setPosts(prev => prev.filter(post => post._id !== postIdOrArray));
        setSelectedPosts(prev => prev.filter(id => id !== postIdOrArray));
      }
      
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert(err.message || 'Erreur lors de la suppression');
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  }, []);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] bg-clip-text text-transparent">
                  Gestion des publications
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2">
                  Gérez les événements, actualités et communiqués
                </p>
              </div>
              <Link
                to="/admin/evenements"
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle publication
              </Link>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">{posts.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {posts.filter(p => p.type === 'événement').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Événements</div>
              </div>
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {posts.filter(p => p.type === 'actualité').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Actualités</div>
              </div>
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {posts.filter(p => p.featured).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">À la une</div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de contrôle */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#003366] to-[#004488] rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Recherche */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-gray-800"
                  />
                </div>
              </div>

              {/* Filtres et actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-12 pr-4 py-3 border border-gray-300/50 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent appearance-none text-gray-800"
                  >
                    <option value="tous">Tous les types</option>
                    <option value="événement">Événements</option>
                    <option value="actualité">Actualités</option>
                    <option value="communiqué">Communiqués</option>
                  </select>
                </div>

                {selectedPosts.length > 0 && (
                  <button
                    onClick={() => {
                      setPostToDelete(selectedPosts);
                      setShowDeleteModal(true);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer ({selectedPosts.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des publications */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#003366]/5 via-[#004488]/5 to-[#003366]/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {loading ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-4">Chargement des publications...</p>
              </div>
            ) : error ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="text-red-500 text-3xl mb-4">⚠️</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Erreur de chargement</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={loadPosts}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] px-5 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Réessayer
                </button>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="text-4xl mb-4 text-gray-400">📭</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Aucune publication</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? `Aucun résultat pour "${searchQuery}"`
                    : filter !== 'tous'
                    ? `Aucune publication de type "${filter}"`
                    : 'Commencez par créer votre première publication'}
                </p>
                <Link
                  to="/admin/evenements"
                  className="inline-flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer une publication
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
                      <th className="p-4 w-12">
                        <input
                          type="checkbox"
                          checked={filteredPosts.length > 0 && selectedPosts.length === filteredPosts.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-[#003366] rounded focus:ring-[#FFD700] border-gray-300"
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Publication</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Statistiques</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filteredPosts.map((post) => (
                      <tr key={post._id} className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50 transition-all duration-300">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedPosts.includes(post._id)}
                            onChange={() => toggleSelectPost(post._id)}
                            className="w-4 h-4 text-[#003366] rounded focus:ring-[#FFD700] border-gray-300"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            {post.images && post.images.length > 0 && (
                              <div className="flex-shrink-0">
                                <img
                                  src={post.images[0].url?.startsWith('http') 
                                    ? post.images[0].url 
                                    : `http://localhost:5000${post.images[0].url}`}
                                  alt={post.title}
                                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-300/50"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNGM0YzRjMiLz48dGV4dCB4PSIzMiIgeT0iMzQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSI+SU1HPC90ZXh0Pjwvc3ZnPg==';
                                  }}
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-gray-800 truncate">
                                {post.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {post.content?.substring(0, 100)}...
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  Par {post.author?.prenom || 'Anonyme'} {post.author?.nom || ''}
                                </span>
                                {post.featured && (
                                  <span className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 px-2 py-1 rounded-full border border-yellow-300/50">
                                    <Star className="w-3 h-3 inline mr-1" />
                                    À la une
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            post.type === 'événement' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300/50' :
                            post.type === 'actualité' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300/50' :
                            'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300/50'
                          }`}>
                            {post.type === 'événement' ? <Calendar className="w-3 h-3 inline mr-1" /> :
                             post.type === 'actualité' ? <FileText className="w-3 h-3 inline mr-1" /> :
                             <Users className="w-3 h-3 inline mr-1" />}
                            {post.type}
                          </span>
                          {post.eventDate && (
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate(post.eventDate)}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {formatDate(post.publishDate || post.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                              <span title="J'aime">👍 {post.likes?.length || 0}</span>
                              <span title="Je n'aime pas">👎 {post.dislikes?.length || 0}</span>
                              <span title="Vues">👁️ {post.viewCount || 0}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {post.images?.length || 0} image{post.images?.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-2">
                            <Link
                              to={`/admin/content/edit/${post._id}`}
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors duration-300"
                            >
                              <Edit className="w-4 h-4" />
                              Modifier
                            </Link>
                            <Link
                              to={`/actualites/${post._id}`}
                              target="_blank"
                              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm transition-colors duration-300"
                            >
                              <Eye className="w-4 h-4" />
                              Prévisualiser
                            </Link>
                            <button
                              onClick={() => {
                                setPostToDelete(post._id);
                                setShowDeleteModal(true);
                              }}
                              className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 text-sm transition-colors duration-300 text-left"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="relative bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full animate-scaleIn border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              {Array.isArray(postToDelete)
                ? `Êtes-vous sûr de vouloir supprimer ${postToDelete.length} publication(s) ? Cette action est irréversible.`
                : 'Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPostToDelete(null);
                }}
                className="flex-1 border border-gray-300/50 bg-white/50 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50/80 transition-all duration-300 font-medium backdrop-blur-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeletePost(postToDelete)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ManagePosts;