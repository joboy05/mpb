import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FileText, 
  Bell, 
  Award, 
  TrendingUp,
  MapPin,
  BarChart
} from 'lucide-react';

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
    { title: 'Assemblée générale', date: '2024-12-15', location: 'Cotonou' },
    { title: 'Collecte de fonds', date: '2024-12-20', location: 'Porto-Novo' },
    { title: 'Formation leadership', date: '2024-12-25', location: 'Parakou' }
  ];

  return (
    <div className="space-y-6">
      {/* Profil Membre */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {currentMember.prenom?.charAt(0)}{currentMember.nom?.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              {currentMember.prenom} {currentMember.nom}
            </h3>
            <p className="text-sm text-gray-600">{currentMember.membershipNumber}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                {currentMember.role === 'admin' ? 'Administrateur' : 'Membre'}
              </span>
              <span className="text-xs text-gray-500">
                {currentMember.department}
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
                    filters.category === cat.value
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
              value={filters.department || ''}
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
      {currentMember.role === 'admin' && (
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
              to="/admin/analytics" 
              className="block bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-center transition-colors"
            >
              📊 Statistiques avancées
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

export default Sidebar;