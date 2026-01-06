import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Filter, Search, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import { newsData, categories } from '../data/newsData';

const NewsList = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = newsData.filter(article => {
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto mt-20 px-4 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#0055AA] rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Actualités du Mouvement
          </h1>
          
          <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-[#003366] mx-auto mb-6"></div>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Toutes les dernières activités, événements et initiatives du Mouvement Patriotique du Bénin
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Barre de recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une actualité..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-4">
              <Filter className="text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent"
              >
                <option value="Tous">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Statistiques */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Total articles :</span>
              <span className="ml-2 font-semibold text-[#003366]">{newsData.length}</span>
            </div>
            <div className="bg-yellow-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Catégorie :</span>
              <span className="ml-2 font-semibold text-[#003366]">{selectedCategory}</span>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Résultats :</span>
              <span className="ml-2 font-semibold text-[#003366]">{filteredNews.length}</span>
            </div>
          </div>
        </div>

        {/* Liste des articles */}
        {filteredNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600">Essayez avec d'autres termes de recherche ou une autre catégorie</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tous');
              }}
              className="mt-4 px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004488] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-r from-[#003366] to-[#0055AA] rounded-2xl p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Restez informé</h3>
            <p className="text-blue-100 mb-6">
              Inscrivez-vous à notre newsletter pour recevoir les dernières actualités directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#003366] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition-shadow">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsList;