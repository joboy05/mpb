import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, UserPlus } from 'lucide-react';

const MembersTable = ({ searchQuery, filteredMembers }) => {
  const navigate = useNavigate();
  
  // Prendre seulement les 5 premiers membres
  const displayedMembers = filteredMembers.slice(0, 5);

  return (
    <div className="relative">
      {/* En-tête simplifié */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Membres récents</h2>
          <button 
            onClick={() => navigate('/admin/membres')}
            className="text-[#003366] hover:text-[#004488] text-sm font-medium flex items-center gap-1"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Tableau simplifié */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600">Membre</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600">Contact</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {displayedMembers.map((member) => (
                <tr key={member._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                        {member.prenom?.charAt(0)}{member.nom?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {member.prenom} {member.nom}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.membershipNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-800">{member.email}</div>
                    <div className="text-xs text-gray-500">
                      {member.phoneCode} {member.telephone}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-800">
                      {new Date(member.dateInscription).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      member.isActive !== false 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isActive !== false ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Message si aucun résultat */}
          {displayedMembers.length === 0 && (
            <div className="text-center py-8 px-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun membre</h3>
              <p className="text-gray-600 text-sm mb-4">
                {searchQuery 
                  ? 'Aucun résultat pour votre recherche'
                  : 'Aucun membre dans la liste'
                }
              </p>
              {!searchQuery && (
                <button 
                  onClick={() => navigate('/admin/ajouter-membre')}
                  className="text-[#003366] hover:text-[#004488] text-sm font-medium flex items-center gap-1 justify-center mx-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  Ajouter un membre
                </button>
              )}
            </div>
          )}

          {/* Lien vers la page complète si plus de 5 membres */}
          {filteredMembers.length > 5 && (
            <div className="px-4 py-3 border-t text-center">
              <button 
                onClick={() => navigate('/admin/membres')}
                className="text-[#003366] hover:text-[#004488] text-sm font-medium flex items-center gap-1 justify-center mx-auto"
              >
                Voir les {filteredMembers.length} membres
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersTable;