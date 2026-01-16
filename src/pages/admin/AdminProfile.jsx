// src/pages/admin/AdminProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Settings,
  LogOut,
  Calendar,
  FileText,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Users,
  BarChart3,
  Activity,
  Award,
  Globe,
  Building,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { authService } from '../../services/authService';
import { memberService } from '../../services/memberService';
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
    totalMembers: 0,
    activeMembers: 0,
    totalPosts: 0,
    recentRegistrations: 0,
    completedProfiles: 0
  });

  // Données du profil
  const [profile, setProfile] = useState({
    prenom: '',
    nom: '',
    email: '',
    code_telephone: '',
    telephone: '',
    age: '',
    pays: '',
    departement: '',
    commune: '',
    ville: '',
    ville_mobilisation: '',
    section: '',
    centres_interet_competences: '',
    profession: '',
    disponibilite: '',
    motivation: '',
    role: '',
    memberId: '',
    membershipNumber: '',
    dateInscription: '',
    lastLogin: '',
    profileCompleted: false,
    isActive: true,
    status: 'Actif'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfileData();
    loadDashboardStats();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');

      // Vérifier si l'utilisateur est connecté
      const token = localStorage.getItem('mpb_token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Récupérer le profil depuis l'API
      const response = await memberService.getProfile();
      
      if (response.success && response.member) {
        const member = response.member;
        setProfile({
          prenom: member.prenom || '',
          nom: member.nom || '',
          email: member.email || '',
          code_telephone: member.code_telephone || '+229',
          telephone: member.telephone || '',
          age: member.age || '',
          pays: member.pays || 'Bénin',
          departement: member.departement || '',
          commune: member.commune || '',
          ville: member.ville || '',
          ville_mobilisation: member.ville_mobilisation || '',
          section: member.section || '',
          centres_interet_competences: member.centres_interet_competences || '',
          profession: member.profession || '',
          disponibilite: member.disponibilite || '',
          motivation: member.motivation || '',
          role: member.role || 'admin',
          memberId: member.memberId || '',
          membershipNumber: member.membershipNumber || '',
          dateInscription: member.dateInscription || '',
          lastLogin: member.lastLogin || '',
          profileCompleted: member.profileCompleted || false,
          isActive: member.isActive !== undefined ? member.isActive : true,
          status: member.status || 'Actif'
        });
      } else {
        setError('Impossible de charger le profil');
      }
    } catch (err) {
      console.error('Erreur chargement profil:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Récupérer les statistiques depuis l'API admin
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mpb_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats({
            totalMembers: data.stats.totalMembers || 0,
            activeMembers: data.stats.activeMembers || 0,
            totalPosts: data.stats.totalPosts || 0,
            recentRegistrations: data.stats.recentRegistrations || 0,
            completedProfiles: data.stats.completedProfiles || 0
          });
        }
      }
    } catch (err) {
      console.error('Erreur statistiques:', err);
      // Ne pas bloquer l'interface si les stats échouent
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Préparer les données de mise à jour
      const updates = {
        prenom: profile.prenom,
        nom: profile.nom,
        code_telephone: profile.code_telephone,
        telephone: profile.telephone,
        age: parseInt(profile.age),
        departement: profile.departement,
        commune: profile.commune,
        ville: profile.ville,
        ville_mobilisation: profile.ville_mobilisation,
        section: profile.section,
        centres_interet_competences: profile.centres_interet_competences,
        profession: profile.profession,
        disponibilite: profile.disponibilite,
        motivation: profile.motivation
      };

      const response = await memberService.updateProfile(updates);
      
      if (response.success) {
        setSuccess('Profil mis à jour avec succès !');
        setIsEditing(false);
        
        // Rafraîchir les données
        setTimeout(() => {
          loadProfileData();
        }, 1000);
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Appel API pour changer le mot de passe
      const response = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        setSuccess('Mot de passe changé avec succès !');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
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

  const formatAge = (age) => {
    return age ? `${age} ans` : 'Non spécifié';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">Chargement de votre profil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header avec navigation */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil Administrateur</h1>
              <p className="text-gray-600 mt-2">Gérez votre compte et vos informations personnelles</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Tableau de bord
              </button>
              <button
                onClick={() => navigate('/admin/membres')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Gérer les membres
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Messages d'alerte */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold">Erreur :</div>
                <div>{error}</div>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl animate-fadeIn">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold">Succès :</div>
                <div>{success}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carte profil détaillée */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#003366] to-[#004488] p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm">
                        {profile.prenom?.[0]}{profile.nom?.[0]}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                        <Shield className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {profile.prenom} {profile.nom}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold text-white">
                          {profile.role === 'admin' ? 'Administrateur' : profile.role}
                        </span>
                        {profile.isActive && (
                          <span className="bg-green-500/20 px-3 py-1 rounded-full text-sm font-semibold text-green-300">
                            Compte actif
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-white/80 text-sm text-center md:text-right">
                    <p>Membre depuis {formatDate(profile.dateInscription)}</p>
                    <p className="mt-1">Dernière connexion : {formatDate(profile.lastLogin)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          value={profile.prenom}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={profile.nom}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Âge *
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={profile.age}
                          onChange={handleProfileChange}
                          min="16"
                          max="100"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profession *
                        </label>
                        <select
                          name="profession"
                          value={profile.profession}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          required
                        >
                          <option value="">Sélectionnez</option>
                          <option value="Étudiant">Étudiant</option>
                          <option value="Employé">Employé</option>
                          <option value="Fonctionnaire">Fonctionnaire</option>
                          <option value="Entrepreneur">Entrepreneur</option>
                          <option value="Commerçant">Commerçant</option>
                          <option value="Agriculteur">Agriculteur</option>
                          <option value="Artisan">Artisan</option>
                          <option value="Profession libérale">Profession libérale</option>
                          <option value="Retraité">Retraité</option>
                          <option value="Sans emploi">Sans emploi</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <div className="flex gap-2">
                          <select
                            name="code_telephone"
                            value={profile.code_telephone}
                            onChange={handleProfileChange}
                            className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          >
                            <option value="+229">+229</option>
                            <option value="+33">+33</option>
                            <option value="+1">+1</option>
                          </select>
                          <input
                            type="tel"
                            name="telephone"
                            value={profile.telephone}
                            onChange={handleProfileChange}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Disponibilité *
                        </label>
                        <select
                          name="disponibilite"
                          value={profile.disponibilite}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          required
                        >
                          <option value="">Sélectionnez</option>
                          <option value="Quelques heures par semaine">Quelques heures par semaine</option>
                          <option value="1-2 jours par semaine">1-2 jours par semaine</option>
                          <option value="3-4 jours par semaine">3-4 jours par semaine</option>
                          <option value="Temps plein">Temps plein</option>
                          <option value="Weekends uniquement">Weekends uniquement</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Département *
                        </label>
                        <input
                          type="text"
                          name="departement"
                          value={profile.departement}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commune *
                        </label>
                        <input
                          type="text"
                          name="commune"
                          value={profile.commune}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          required
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
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville de mobilisation
                        </label>
                        <input
                          type="text"
                          name="ville_mobilisation"
                          value={profile.ville_mobilisation}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section
                        </label>
                        <input
                          type="text"
                          name="section"
                          value={profile.section}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Centres d'intérêt / Compétences
                        </label>
                        <input
                          type="text"
                          name="centres_interet_competences"
                          value={profile.centres_interet_competences}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motivation *
                      </label>
                      <textarea
                        name="motivation"
                        value={profile.motivation}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        required
                        minLength={20}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Minimum 20 caractères ({profile.motivation?.length || 0}/20)
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#003366] to-[#004488] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
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
                    {/* Informations de base */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Nom complet</p>
                          <p className="font-medium text-gray-800">{profile.prenom} {profile.nom}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Profession</p>
                          <p className="font-medium text-gray-800">{profile.profession || 'Non spécifié'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Âge</p>
                          <p className="font-medium text-gray-800">{formatAge(profile.age)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium text-gray-800">{profile.code_telephone} {profile.telephone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Localisation</p>
                          <p className="font-medium text-gray-800">
                            {profile.departement}, {profile.commune}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Building className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Ville</p>
                          <p className="font-medium text-gray-800">{profile.ville || 'Non spécifié'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Informations supplémentaires */}
                    {(profile.section || profile.ville_mobilisation) && (
                      <div className="grid md:grid-cols-2 gap-6">
                        {profile.section && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600">Section d'appartenance</p>
                            <p className="font-medium text-blue-800">{profile.section}</p>
                          </div>
                        )}
                        {profile.ville_mobilisation && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600">Ville de mobilisation</p>
                            <p className="font-medium text-green-800">{profile.ville_mobilisation}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {profile.centres_interet_competences && (
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-600 mb-1">Centres d'intérêt / Compétences</p>
                        <p className="text-gray-800">{profile.centres_interet_competences}</p>
                      </div>
                    )}

                    <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Motivation personnelle</p>
                      <p className="text-gray-700 italic">"{profile.motivation}"</p>
                    </div>

                    {/* Identifiants système */}
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">ID Membre</p>
                        <p className="font-mono text-sm text-gray-700">{profile.memberId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Numéro d'adhésion</p>
                        <p className="font-mono text-sm text-gray-700">{profile.membershipNumber}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#003366] to-[#004488] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                      >
                        <Edit2 className="w-5 h-5" />
                        Modifier mon profil
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
                Vue d'ensemble de la plateforme
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">Total membres</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalMembers}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <p className="text-sm text-green-700 mb-1">Membres actifs</p>
                  <p className="text-2xl font-bold text-green-900">{stats.activeMembers}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <p className="text-sm text-purple-700 mb-1">Nouvelles inscriptions</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.recentRegistrations}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                  <p className="text-sm text-yellow-700 mb-1">Profils complets</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.completedProfiles}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            {/* État du compte */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#003366]" />
                État du compte
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Statut</p>
                      <p className="text-sm text-gray-600">{profile.status}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 ${profile.isActive ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`}></div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 mb-1">Complétude du profil</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${profile.profileCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: profile.profileCompleted ? '100%' : '75%' }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {profile.profileCompleted ? '100%' : '75%'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    {profile.profileCompleted ? 'Profil complet ✓' : 'Informations post-connexion manquantes'}
                  </p>
                </div>
              </div>
            </div>

            {/* Accès rapides */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#003366]" />
                Accès rapides
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/admin/create-post')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Créer une publication</p>
                    <p className="text-sm text-gray-600">Article ou événement</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/admin/posts')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Gérer les publications</p>
                    <p className="text-sm text-gray-600">Tous les contenus</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/admin/membres')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Gérer les membres</p>
                    <p className="text-sm text-gray-600">{stats.totalMembers} membres</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Rôle administrateur */}
            <div className="bg-gradient-to-br from-[#003366] to-[#004488] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Permissions administrateur
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <p className="font-semibold mb-2 text-white/90">Droits d'accès :</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      Administration complète
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      Gestion des utilisateurs
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      Modération des contenus
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      Accès aux statistiques
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      Configuration système
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-2">
            Mouvement Patriotique du Bénin • Plateforme d'administration
          </p>
          <p>
            ID Session: {profile.memberId} • 
            Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;