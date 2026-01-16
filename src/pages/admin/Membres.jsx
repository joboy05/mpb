import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService, authService } from '../../services/api';
import * as LucideIcons from 'lucide-react';

const {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Users,
  Shield,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  UserPlus,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  TrendingUp
} = LucideIcons;

const Membres = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('tous');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    recent: 0
  });

  // Vérifier l'authentification UNE SEULE FOIS
  const currentMember = useMemo(() => authService.getCurrentMember(), []);
  const isAdmin = useMemo(() => currentMember?.role === 'admin', [currentMember]);

  // Fonction de chargement STABLE (ne dépend pas de currentMember)
  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Chargement des membres...');
      const response = await adminService.getAllMembersAdmin();
      console.log('📊 Membres reçus:', response);
      
      if (response.success) {
        const membersList = response.members || [];
        setMembers(membersList);
        
        // Calculer les statistiques
        const total = membersList.length;
        const active = membersList.filter(m => m.isActive !== false).length;
        const inactive = membersList.filter(m => m.isActive === false).length;
        const admins = membersList.filter(m => m.role === 'admin').length;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recent = membersList.filter(m => {
          return new Date(m.dateInscription) > weekAgo;
        }).length;
        
        setStats({ total, active, inactive, admins, recent });
      } else {
        setError(response.message || 'Erreur de chargement des membres');
        setMembers([]);
      }
    } catch (err) {
      console.error('❌ Erreur chargement membres:', err);
      setError(err.message || 'Erreur de connexion au serveur');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []); // AUCUNE dépendance - fonction stable

  // Charger les membres UNE SEULE FOIS au montage
  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    loadMembers();
  }, [isAdmin, loadMembers]); // isAdmin est stable grâce à useMemo

  // Filtrage mémorisé
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      if (filter !== 'tous') {
        if (filter === 'actifs' && member.isActive === false) return false;
        if (filter === 'inactifs' && member.isActive !== false) return false;
        if (filter === 'admins' && member.role !== 'admin') return false;
      }
      
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const fullName = `${member.prenom || ''} ${member.nom || ''}`.toLowerCase();
        const email = member.email?.toLowerCase() || '';
        const phone = member.telephone?.toLowerCase() || '';
        const location = `${member.commune || ''} ${member.department || ''}`.toLowerCase();
        
        return fullName.includes(searchLower) || 
               email.includes(searchLower) || 
               phone.includes(searchLower) ||
               location.includes(searchLower);
      }
      
      return true;
    });
  }, [members, filter, searchQuery]);

  const toggleSelectMember = useCallback((memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedMembers(prev => {
      if (prev.length === filteredMembers.length) {
        return [];
      } else {
        return filteredMembers.map(member => member._id);
      }
    });
  }, [filteredMembers]);

  const handleDeleteMember = useCallback(async (memberIdOrArray) => {
    try {
      // Pour la démo, simuler une suppression
      if (Array.isArray(memberIdOrArray)) {
        setMembers(prev => prev.filter(member => !memberIdOrArray.includes(member._id)));
        setSelectedMembers([]);
      } else {
        setMembers(prev => prev.filter(member => member._id !== memberIdOrArray));
        setSelectedMembers(prev => prev.filter(id => id !== memberIdOrArray));
      }
      
      setShowDeleteModal(false);
      setMemberToDelete(null);
      
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert(err.message || 'Erreur lors de la suppression');
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    try {
      if (!dateString) return 'Non renseigné';
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  }, []);

  const formatPhone = useCallback((phoneCode, telephone) => {
    if (!telephone) return 'Non renseigné';
    return `${phoneCode || ''} ${telephone}`.trim();
  }, []);

  // Si pas admin, afficher le message d'erreur
  if (!isAdmin) {
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
                  Gestion des membres
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2">
                  Gérez les membres de votre organisation
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/ajouter-membre')}
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Nouveau membre
              </button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Total
                </div>
              </div>
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Actifs
                </div>
              </div>
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.inactive}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Inactifs
                </div>
              </div>
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.admins}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admins
                </div>
              </div>
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20 shadow-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.recent}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Cette semaine
                </div>
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
                    placeholder="Rechercher un membre..."
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
                    <option value="tous">Tous les membres</option>
                    <option value="actifs">Membres actifs</option>
                    <option value="inactifs">Membres inactifs</option>
                    <option value="admins">Administrateurs</option>
                  </select>
                </div>

                {selectedMembers.length > 0 && (
                  <button
                    onClick={() => {
                      setMemberToDelete(selectedMembers);
                      setShowDeleteModal(true);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer ({selectedMembers.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des membres */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#003366]/5 via-[#004488]/5 to-[#003366]/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {loading ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-4">Chargement des membres...</p>
              </div>
            ) : error ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="text-red-500 text-3xl mb-4">⚠️</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Erreur de chargement</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => loadMembers()}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] px-5 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Réessayer
                </button>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="text-4xl mb-4 text-gray-400">👤</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Aucun membre</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? `Aucun résultat pour "${searchQuery}"`
                    : filter !== 'tous'
                    ? `Aucun membre dans la catégorie "${filter}"`
                    : 'Commencez par ajouter votre premier membre'}
                </p>
                <button
                  onClick={() => navigate('/admin/ajouter-membre')}
                  className="inline-flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Ajouter un membre
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
                      <th className="p-4 w-12">
                        <input
                          type="checkbox"
                          checked={filteredMembers.length > 0 && selectedMembers.length === filteredMembers.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-[#003366] rounded focus:ring-[#FFD700] border-gray-300"
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Membre</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Localisation</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Date d'inscription</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filteredMembers.slice(0, 10).map((member) => (
                      <tr key={member._id} className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50 transition-all duration-300">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member._id)}
                            onChange={() => toggleSelectMember(member._id)}
                            className="w-4 h-4 text-[#003366] rounded focus:ring-[#FFD700] border-gray-300"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                                {member.prenom?.charAt(0) || ''}{member.nom?.charAt(0) || ''}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-800">
                                  {member.prenom || ''} {member.nom || ''}
                                </h3>
                                {member.role === 'admin' && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Admin
                                  </span>
                                )}
                              </div>
                              {member.membershipNumber && (
                                <p className="text-sm text-gray-500 mt-1">
                                  #{member.membershipNumber}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Membre depuis {formatDate(member.dateInscription)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-800">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-sm truncate">{member.email || 'Non renseigné'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{formatPhone(member.phoneCode, member.telephone)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-800">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{member.commune || 'Non renseigné'}</span>
                            </div>
                            {member.department && (
                              <p className="text-sm text-gray-600 pl-6">
                                {member.department}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {formatDate(member.dateInscription)}
                        </td>
                        <td className="p-4">
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
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => navigate(`/admin/membres/${member._id}`)}
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors duration-300"
                            >
                              <Eye className="w-4 h-4" />
                              Voir détails
                            </button>
                           { /*<button
                              onClick={() => navigate(`/admin/membres/${member._id}/edit`)}
                              className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-sm transition-colors duration-300"
                            >
                              <Edit2 className="w-4 h-4" />
                              Modifier
                            </button>*/}
                            {member.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  setMemberToDelete(member._id);
                                  setShowDeleteModal(true);
                                }}
                                className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 text-sm transition-colors duration-300 text-left"
                              >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                              </button>
                            )}
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

        {/* Pagination */}
        {filteredMembers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Affichage de 1 à {Math.min(10, filteredMembers.length)} sur {filteredMembers.length} membres
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg border border-gray-300/50 text-gray-600 hover:bg-gray-50/50 transition-all duration-300">
                Précédent
              </button>
              <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#003366] to-[#004488] text-white">
                1
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-300/50 text-gray-600 hover:bg-gray-50/50 transition-all duration-300">
                2
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-300/50 text-gray-600 hover:bg-gray-50/50 transition-all duration-300">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              {Array.isArray(memberToDelete)
                ? `Êtes-vous sûr de vouloir supprimer ${memberToDelete.length} membre(s) ? Cette action est irréversible.`
                : 'Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setMemberToDelete(null);
                }}
                className="flex-1 border border-gray-300/50 bg-white/50 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50/80 transition-all duration-300 font-medium backdrop-blur-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteMember(memberToDelete)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300"
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

export default Membres;