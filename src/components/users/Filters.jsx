import React from 'react';

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
            checked={filters.withImages}
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

export default Filters;