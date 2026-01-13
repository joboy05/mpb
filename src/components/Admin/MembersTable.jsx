import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, Download, Users, Shield, Search, 
  Eye, Edit2, Trash2, MoreVertical, CheckCircle, XCircle,
  ChevronRight, UserPlus
} from 'lucide-react';

const MembersTable = ({ searchQuery, filteredMembers }) => {
  const navigate = useNavigate();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMembers(filteredMembers.map(m => m._id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (id) => {
    setSelectedMembers(prev => 
      prev.includes(id) 
        ? prev.filter(memberId => memberId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="relative">
      {/* Header avec effet premium */}
      <div className="mb-6 relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#003366]/5 via-[#004488]/5 to-[#003366]/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Liste des membres</h2>
              <p className="text-gray-600">
                <span className="font-semibold text-[#003366]">{filteredMembers.length}</span> membre{filteredMembers.length !== 1 ? 's' : ''} trouvé{filteredMembers.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Bouton Filtres */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:from-gray-100 hover:to-gray-200 border border-gray-300/50 hover:border-gray-400 transition-all duration-300 group"
              >
                <Filter className="w-4 h-4" />
                Filtres
                {showFilters && (
                  <div className="absolute right-0 mt-12 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-[200px] z-50">
                    {/* Contenu des filtres */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                          <option>Tous</option>
                          <option>Actif</option>
                          <option>Inactif</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                          <option>Tous</option>
                          <option>Admin</option>
                          <option>Membre</option>
                        </select>
                      </div>
                      <button className="w-full bg-gradient-to-r from-[#003366] to-[#004488] text-white py-2 rounded-lg text-sm">
                        Appliquer
                      </button>
                    </div>
                  </div>
                )}
              </button>
              
              {/* Bouton Exporter */}
              <button className="flex items-center gap-2 bg-gradient-to-r from-[#003366] to-[#004488] text-white px-4 py-2.5 rounded-xl hover:from-[#004488] hover:to-[#0055AA] shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Download className="w-4 h-4" />
                Exporter
              </button>
              
              {/* Bouton Ajouter membre */}
              <button 
                onClick={() => navigate('/admin/ajouter-membre')}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] px-4 py-2.5 rounded-xl hover:from-[#FFAA00] hover:to-[#FF9500] shadow-lg hover:shadow-xl transition-all duration-300 group font-semibold"
              >
                <UserPlus className="w-4 h-4" />
                Ajouter un membre
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau premium */}
      <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        {/* En-tête du tableau */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300/50">
                <th className="py-4 px-6 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#003366] focus:ring-[#FFD700]"
                    />
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Membre
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {filteredMembers.slice(0, 10).map((member) => (
                <tr 
                  key={member._id} 
                  className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50 transition-all duration-300 group"
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member._id)}
                      onChange={() => handleSelectMember(member._id)}
                      className="rounded border-gray-300 text-[#003366] focus:ring-[#FFD700]"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-lg mr-4 shadow-inner">
                        {member.prenom?.charAt(0)}{member.nom?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 group-hover:text-[#003366] transition-colors">
                          {member.prenom} {member.nom}
                          {member.role === 'admin' && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {member.membershipNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">{member.email}</div>
                    <div className="text-sm text-gray-500">
                      {member.phoneCode} {member.telephone}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">{member.commune}</div>
                    <div className="text-sm text-gray-500">{member.department}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">
                      {new Date(member.dateInscription).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(member.dateInscription).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        member.isActive !== false 
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
                          : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                      }`}>
                        {member.isActive !== false ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Actif
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactif
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => navigate(`/admin/membres/${member._id}`)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300 group/action"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/membres/${member._id}/edit`)}
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors duration-300 group/action"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {member.role !== 'admin' && (
                        <button 
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-300 group/action"
                          title="Désactiver"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucun résultat */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-16 px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun membre trouvé</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchQuery 
                ? 'Aucun résultat ne correspond à votre recherche. Essayez avec d\'autres termes.'
                : 'Commencez par ajouter des membres à votre organisation.'
              }
            </p>
            {!searchQuery && (
              <button 
                onClick={() => navigate('/admin/ajouter-membre')}
                className="mt-6 bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Ajouter votre premier membre
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredMembers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-300/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Affichage de 1 à 10 sur {filteredMembers.length} membres
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                  Précédent
                </button>
                <button className="px-3 py-1.5 bg-gradient-to-r from-[#003366] to-[#004488] text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                  3
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersTable;