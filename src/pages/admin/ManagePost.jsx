import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/postService';
import { authAPI } from '../../api/auth';

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

  // Charger les publications une seule fois
  const loadPosts = useCallback(async () => {
    // Empêcher le chargement si pas admin
    if (!currentMember || currentMember.role !== 'admin') {
      setLoading(false);
      return;
    }

    // Empêcher le rechargement si déjà chargé
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

  // Effet de chargement initial
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

  // Filtrer les publications (mémorisé)
  const filteredPosts = React.useMemo(() => {
    return posts.filter(post => {
      // Filtre par type
      if (filter !== 'tous' && post.type !== filter) return false;
      
      // Filtre par recherche
      if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    });
  }, [posts, filter, searchQuery]);

  // Gérer la sélection d'un post
  const toggleSelectPost = useCallback((postId) => {
    setSelectedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  }, []);

  // Sélectionner/désélectionner tous
  const toggleSelectAll = useCallback(() => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post._id));
    }
  }, [filteredPosts, selectedPosts.length]);

  // Supprimer une ou plusieurs publications
  const handleDeletePost = useCallback(async (postIdOrArray) => {
    try {
      if (Array.isArray(postIdOrArray)) {
        // Suppression multiple
        await Promise.all(postIdOrArray.map(id => 
          postService.deletePost(id).catch(err => {
            console.error(`Erreur suppression post ${id}:`, err);
            // Continuer avec les autres même si une échoue
          })
        ));
        // Filtrer les posts supprimés
        setPosts(prev => prev.filter(post => !postIdOrArray.includes(post._id)));
        setSelectedPosts([]);
      } else {
        // Suppression unique
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

  // Toggle featured
  const handleToggleFeatured = useCallback(async (postId, currentFeatured) => {
    try {
      await postService.toggleFeatured(postId);
      // Mettre à jour localement pour éviter de recharger
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? { ...post, featured: !currentFeatured }
          : post
      ));
    } catch (err) {
      console.error('Erreur toggle featured:', err);
      alert(err.message || 'Erreur lors de la modification');
    }
  }, []);

  // Formater la date
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

  // Vérifier l'accès admin
  if (!currentMember || currentMember.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Gestion des publications
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2">
                Gérez les événements, actualités et communiqués
              </p>
            </div>
            <Link
              to="/admin/evenements"
              className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-colors"
            >
              <span className="mr-2">+</span>
              Nouvelle publication
            </Link>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{posts.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {posts.filter(p => p.type === 'événement').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Événements</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {posts.filter(p => p.type === 'actualité').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Actualités</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                {posts.filter(p => p.featured).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">À la une</div>
            </div>
          </div>
        </div>

        {/* Barre de contrôle */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Recherche */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Rechercher par titre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Filtres et actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="tous">Tous les types</option>
                <option value="événement">Événements</option>
                <option value="actualité">Actualités</option>
                <option value="communiqué">Communiqués</option>
              </select>

              {selectedPosts.length > 0 && (
                <button
                  onClick={() => {
                    setPostToDelete(selectedPosts);
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Supprimer ({selectedPosts.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tableau des publications */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Chargement des publications...</p>
            </div>
          ) : error ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="text-red-500 text-3xl mb-4">⚠️</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadPosts}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-6 sm:p-12 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Aucune publication</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `Aucun résultat pour "${searchQuery}"`
                  : filter !== 'tous'
                  ? `Aucune publication de type "${filter}"`
                  : 'Commencez par créer votre première publication'}
              </p>
              <Link
                to="/admin/content/create"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Créer une publication
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 w-12">
                      <input
                        type="checkbox"
                        checked={filteredPosts.length > 0 && selectedPosts.length === filteredPosts.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Publication</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Statistiques</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post._id)}
                          onChange={() => toggleSelectPost(post._id)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Image miniature */}
                          {post.images && post.images.length > 0 && (
                            <div className="flex-shrink-0">
                              <img
                                src={post.images[0].url?.startsWith('http') 
                                  ? post.images[0].url 
                                  : `http://localhost:5000${post.images[0].url}`}
                                alt={post.title}
                                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
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
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  🌟 À la une
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          post.type === 'événement' ? 'bg-red-100 text-red-800' :
                          post.type === 'actualité' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
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
                          <div className="flex items-center gap-3 text-sm">
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
                            className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                          >
                            ✏️ Modifier
                          </Link>
                          <button
                            onClick={() => handleToggleFeatured(post._id, post.featured)}
                            className={`text-sm inline-flex items-center gap-1 text-left ${post.featured ? 'text-yellow-600' : 'text-gray-600'}`}
                          >
                            {post.featured ? '★ Retirer' : '☆ Mettre en avant'}
                          </button>
                          <button
                            onClick={() => {
                              setPostToDelete(post._id);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 text-sm inline-flex items-center gap-1 text-left"
                          >
                            🗑️ Supprimer
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

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-scaleIn">
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
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeletePost(postToDelete)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePosts;