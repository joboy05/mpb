import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Settings, 
  LogOut, 
  Calendar,
  FileText,
  Image as ImageIcon,
  Bell,
  Lock,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Globe,
  Users,
  BarChart3,
  Activity,
  Award
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { postService } from '../../services/postService';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalViews: 0
  });

  // Données du profil
  const [profile, setProfile] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    role: '',
    dateInscription: '',
    lastLogin: '',
    bio: ''
  });

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfileAndStats();
  }, []);

  const loadProfileAndStats = async () => {
    try {
      setLoading(true);
      
      // Récupérer les données de l'utilisateur depuis le localStorage
      const currentMember = authService.getCurrentMember();
      if (!currentMember) {
        navigate('/login');
        return;
      }

      // Mettre à jour le profil
      setProfile({
        prenom: currentMember.prenom || '',
        nom: currentMember.nom || '',
        email: currentMember.email || '',
        telephone: currentMember.telephone || '',
        adresse: currentMember.adresse || '',
        ville: currentMember.ville || '',
        role: currentMember.role || 'Administrateur',
        dateInscription: currentMember.createdAt || new Date().toISOString(),
        lastLogin: currentMember.lastLogin || new Date().toISOString(),
        bio: currentMember.bio || 'Administrateur du Mouvement Patriotique du Bénin'
      });

      // Charger les statistiques
      await loadStatistics();

    } catch (err) {
      console.error('Erreur chargement profil:', err);
      setError('Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await postService.getAllPosts();
      if (response.success && response.posts) {
        const posts = response.posts;
        
        const totalPosts = posts.length;
        const publishedPosts = posts.filter(p => p.status === 'publié' && p.isPublished).length;
        const draftPosts = posts.filter(p => p.status === 'brouillon').length;
        const totalEvents = posts.filter(p => p.type === 'événement').length;
        
        // Événements à venir
        const upcomingEvents = posts.filter(p => {
          if (p.type !== 'événement' || !p.eventDate) return false;
          return new Date(p.eventDate) >= new Date();
        }).length;
        
        // Total des vues
        const totalViews = posts.reduce((sum, post) => sum + (post.viewCount || 0), 0);

        setStats({
          totalPosts,
          publishedPosts,
          draftPosts,
          totalEvents,
          upcomingEvents,
          totalViews
        });
      }
    } catch (err) {
      console.error('Erreur statistiques:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Simuler la sauvegarde (à adapter avec votre API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour le localStorage
      const updatedMember = {
        ...authService.getCurrentMember(),
        ...profile
      };
      localStorage.setItem('mpb_member', JSON.stringify(updatedMember));
      
      setSuccess('Profil mis à jour avec succès');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      // Simuler le changement de mot de passe (à adapter avec votre API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Mot de passe changé avec succès');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors du changement de mot de passe');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Date invalide';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profil Administrateur</h1>
              <p className="text-gray-600 mt-2">Gérez votre compte et vos paramètres</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tableau de bord
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <div className="font-bold">Erreur :</div>
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
            <div className="font-bold">Succès :</div>
            {success}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Profil */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carte profil */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#003366] to-[#004488] p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {profile.prenom[0]}{profile.nom[0]}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#003366] to-[#004488] text-white p-2 rounded-full">
                      <Shield className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-white text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-1">{profile.prenom} {profile.nom}</h2>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                        {profile.role}
                      </div>
                      <div className="text-sm text-white/80">
                        Membre depuis {formatDate(profile.dateInscription)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          value={profile.prenom}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={profile.nom}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="telephone"
                          value={profile.telephone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          placeholder="+229 XX XX XX XX"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="adresse"
                        value={profile.adresse}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        placeholder="Adresse complète"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="ville"
                        value={profile.ville}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        placeholder="Ville"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio / Description
                      </label>
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        placeholder="Parlez un peu de vous..."
                      />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#003366] to-[#004488] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Enregistrer les modifications
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{profile.email || 'Non défini'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium">{profile.telephone || 'Non défini'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Adresse</p>
                          <p className="font-medium">{profile.adresse || 'Non défini'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Ville</p>
                          <p className="font-medium">{profile.ville || 'Non défini'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Bio / Description</p>
                      <p className="text-gray-700">{profile.bio}</p>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#003366] to-[#004488] text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                        Modifier le profil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#003366]" />
                Statistiques d'activité
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-700">Publications totales</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalPosts}</p>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">
                    {stats.publishedPosts} publiées • {stats.draftPosts} brouillons
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-700">Événements</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.totalEvents}</p>
                    </div>
                  </div>
                  <div className="text-xs text-purple-600">
                    {stats.upcomingEvents} à venir
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-green-700">Vues totales</p>
                      <p className="text-2xl font-bold text-green-900">{stats.totalViews}</p>
                    </div>
                  </div>
                  <div className="text-xs text-green-600">
                    Toutes les publications
                  </div>
                </div>
              </div>
            </div>

            {/* Changement de mot de passe */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#003366]" />
                Sécurité du compte
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleChangePassword}
                  disabled={saving || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Modification...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Changer le mot de passe
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Colonne de droite - Infos et actions */}
          <div className="space-y-8">
            {/* Dernière connexion */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#003366]" />
                Activité récente
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Dernière connexion</p>
                      <p className="text-sm text-gray-600">{formatDate(profile.lastLogin)}</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-[#003366]/5 to-[#004488]/5 rounded-lg border border-[#003366]/10">
                  <p className="text-sm text-gray-600 mb-1">Statut du compte</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="font-semibold text-green-700">Actif</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#003366]" />
                Actions rapides
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/create-post')}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Nouvelle publication</p>
                    <p className="text-sm text-gray-600">Créer un article ou événement</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200 hover:border-green-300 hover:shadow transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Tableau de bord</p>
                    <p className="text-sm text-gray-600">Voir les statistiques</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/admin/members')}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-200 hover:border-purple-300 hover:shadow transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Gérer les membres</p>
                    <p className="text-sm text-gray-600">Administrer les utilisateurs</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Rôle et permissions */}
            <div className="bg-gradient-to-br from-[#003366] to-[#004488] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Rôle Administrateur
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <p className="font-semibold mb-2">Permissions complètes</p>
                  <ul className="text-sm text-white/90 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      Gestion des publications
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      Gestion des événements
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      Administration des membres
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      Accès aux statistiques
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      Modération des contenus
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-white/80">
                    ID: {profile.email.substring(0, 8)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#003366]" />
                Notifications
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-yellow-800">💡 Conseil</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Pensez à mettre à jour régulièrement votre mot de passe pour plus de sécurité.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-800">📊 Statistiques</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Vos publications ont été vues {stats.totalViews} fois.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Compte administrateur • Mouvement Patriotique du Bénin • 
            Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
          </p>
          <p className="mt-2">
            Pour toute assistance, contactez le support technique.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;