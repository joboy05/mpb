import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, Search, Newspaper, Eye, ThumbsUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import NewsCard from '../components/Card';
import { postService } from '../services/postService';

const NewsList = () => {
  const [contentType, setContentType] = useState('actualités');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);

  const categories = [
    'Tous',
    'politique',
    'social',
    'économique',
    'culturel',
    'éducation',
    'santé',
    'environnement',
    'autre'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      
      if (response.success && response.posts) {
        const posts = response.posts.filter(post => 
          post.status === 'publié' && post.isPublished === true
        );
        
        // Debug des images
        console.log('📊 Analyse des images:');
        posts.forEach((post, index) => {
          if (post.images && post.images.length > 0) {
            const image = post.images[0];
            console.log(`${index + 1}. ${post.title}:`, {
              hasThumbnail: !!image.thumbnailBase64,
              thumbnailStartsWithData: image.thumbnailBase64?.startsWith('data:'),
              thumbnailLength: image.thumbnailBase64?.length,
              mimetype: image.mimetype
            });
          }
        });
        
        setAllPosts(posts);
      } else {
        setAllPosts([]);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les données');
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = contentType === 'actualités' 
      ? allPosts.filter(p => p.type === 'actualité')
      : allPosts.filter(p => p.type === 'événement');
    
    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        if (item.title?.toLowerCase().includes(searchLower)) return true;
        if (item.content?.toLowerCase().includes(searchLower)) return true;
        if (item.tags?.some(tag => tag.toLowerCase().includes(searchLower))) return true;
        if (item.type === 'événement') {
          if (item.eventLocation?.toLowerCase().includes(searchLower)) return true;
          if (item.eventAddress?.toLowerCase().includes(searchLower)) return true;
        }
        return false;
      });
    }
    
    setFilteredContent(filtered);
  }, [contentType, allPosts, selectedCategory, searchQuery]);

  // Calcul des stats
  const stats = {
    totalActualites: allPosts.filter(p => p.type === 'actualité').length,
    totalEvenements: allPosts.filter(p => p.type === 'événement').length,
    totalVues: allPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0),
    totalLikes: allPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] text-white pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Newspaper className="w-8 h-8" />
            </div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-4">
            {contentType === 'actualités' ? 'Actualités' : 'Événements'}
          </h1>
          <p className="text-center text-blue-100 max-w-2xl mx-auto">
            {contentType === 'actualités' 
              ? 'Découvrez toutes nos publications, analyses et positions officielles'
              : 'Participez à nos rencontres et événements à travers le Bénin'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setContentType('actualités')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${contentType === 'actualités' 
                  ? 'bg-[#003366] text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Actualités ({stats.totalActualites})
              </button>
              <button
                onClick={() => setContentType('événements')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${contentType === 'événements' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Événements ({stats.totalEvenements})
              </button>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="text-gray-600 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'Tous' ? 'Toutes catégories' : cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-4 ml-auto">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{stats.totalVues} vues</span>
              </div>
              
            </div>
            
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tous');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-3 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des publications...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200">
            <div className="text-red-500 text-4xl mb-4">!</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Erreur</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004488]"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {filteredContent.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    {filteredContent.length} résultat{filteredContent.length > 1 ? 's' : ''}
                  </h2>
                  <span className="text-sm text-gray-500">
                    Catégorie: {selectedCategory === 'Tous' ? 'Toutes' : selectedCategory}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent.map(item => (
                    <NewsCard key={item._id} article={item} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {contentType === 'actualités' ? (
                    <Newspaper className="w-10 h-10 text-gray-400" />
                  ) : (
                    <Calendar className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucune publication'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Essayez d\'autres termes' : 'Revenez bientôt'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Tous');
                  }}
                  className="px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004488]"
                >
                  Afficher tout
                </button>
              </div>
            )}
          </>
        )}

        {/* Newsletter */}
        <div className="mt-12 bg-gradient-to-r from-[#003366] to-[#0055AA] rounded-xl p-8 text-white">
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-blue-100 mb-6">
              Recevez nos actualités par email
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 rounded text-gray-900"
              />
              <button className="bg-yellow-400 text-[#003366] font-bold px-6 py-2 rounded hover:bg-yellow-500">
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Admin link */}
        <div className="mt-8 text-center">
          <Link 
            to="/admin/dashboard" 
            className="text-[#003366] hover:text-[#0055AA] text-sm font-medium"
          >
            Espace administrateur →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsList;