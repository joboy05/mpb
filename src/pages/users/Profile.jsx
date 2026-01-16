// src/pages/member/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  Globe,
  Building,
  Target,
  Award,
  Edit2,
  Save,
  X,
  Lock,
  CheckCircle,
  AlertCircle,
  Download,
  Shield,
  Users,
  Star,
  TrendingUp,
  FileText,
  Settings // AJOUTER CET IMPORT
} from 'lucide-react';
import Navbar from '../../components/users/Navbar';
import { memberService } from '../../services/memberService';
import { authService } from '../../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileStatus, setProfileStatus] = useState({
    completed: false,
    missingFields: [],
    progress: 0
  });

  // Données du profil
  const [profile, setProfile] = useState({
    prenom: '',
    nom: '',
    email: '',
    code_telephone: '+229',
    telephone: '',
    age: '',
    pays: 'Bénin',
    departement: '',
    commune: '',
    ville: '',
    ville_mobilisation: '',
    section: '',
    centres_interet_competences: '',
    profession: '',
    disponibilite: '',
    motivation: '',
    role: 'member',
    memberId: '',
    membershipNumber: '',
    dateInscription: '',
    lastLogin: '',
    profileCompleted: false,
    isActive: true,
    status: 'Actif'
  });

  // Données d'édition
  const [editData, setEditData] = useState({
    ville: '',
    ville_mobilisation: '',
    section: '',
    centres_interet_competences: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      // Vérifier si l'utilisateur est connecté
      const token = localStorage.getItem('mpb_token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Récupérer le profil
      const response = await memberService.getProfile();
      
      if (response.success) {
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
          role: member.role || 'member',
          memberId: member.memberId || '',
          membershipNumber: member.membershipNumber || '',
          dateInscription: member.dateInscription || '',
          lastLogin: member.lastLogin || '',
          profileCompleted: member.profileCompleted || false,
          isActive: member.isActive !== undefined ? member.isActive : true,
          status: member.status || 'Actif'
        });

        // Initialiser les données d'édition
        setEditData({
          ville: member.ville || '',
          ville_mobilisation: member.ville_mobilisation || '',
          section: member.section || '',
          centres_interet_competences: member.centres_interet_competences || ''
        });

        // Mettre à jour le statut du profil
        if (response.profileStatus) {
          setProfileStatus(response.profileStatus);
        }
      } else {
        setError(response.message || 'Impossible de charger le profil');
      }
    } catch (err) {
      console.error('Erreur chargement profil:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Vérifier les champs requis
      if (!editData.ville || !editData.ville_mobilisation || !editData.section || !editData.centres_interet_competences) {
        setError('Tous les champs sont requis pour compléter votre profil');
        return;
      }

      const response = await memberService.updateProfile(editData);
      
      if (response.success) {
        setSuccess(response.message || 'Profil mis à jour avec succès !');
        
        // Mettre à jour le profil local
        setProfile(prev => ({
          ...prev,
          ville: editData.ville,
          ville_mobilisation: editData.ville_mobilisation,
          section: editData.section,
          centres_interet_competences: editData.centres_interet_competences,
          profileCompleted: true
        }));

        // Mettre à jour le statut
        if (response.profileStatus) {
          setProfileStatus(response.profileStatus);
        }

        setIsEditing(false);
        
        // Rafraîchir le profil
        setTimeout(() => {
          loadProfile();
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

  const handleCompleteProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await memberService.completeProfile(editData);
      
      if (response.success) {
        setSuccess(response.message || '✅ Profil complété avec succès !');
        
        // Mettre à jour le profil
        setProfile(prev => ({
          ...prev,
          ...editData,
          profileCompleted: true
        }));

        if (response.profileStatus) {
          setProfileStatus(response.profileStatus);
        }

        setIsEditing(false);
        
        setTimeout(() => {
          loadProfile();
        }, 1000);
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Erreur lors de la complétion du profil');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Date invalide';
    }
  };

  const formatDateTime = (dateString) => {
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

  const calculateDaysSinceJoin = () => {
    if (!profile.dateInscription) return 0;
    try {
      const joinDate = new Date(profile.dateInscription);
      const today = new Date();
      const diffTime = Math.abs(today - joinDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      return 0;
    }
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600 mt-2">
                Gérez vos informations personnelles et votre compte
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Tableau de bord
              </button>
              {profile.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004488] transition-colors text-sm font-medium"
                >
                  Espace Admin
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages d'alerte */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold">Attention :</div>
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
            {/* Carte profil */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#003366] to-[#004488] p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm">
                        {profile.prenom?.[0]}{profile.nom?.[0]}
                      </div>
                      {profile.profileCompleted && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {profile.prenom} {profile.nom}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold text-white">
                          {profile.role === 'admin' ? 'Administrateur' : 'Membre'}
                        </span>
                        {profile.isActive ? (
                          <span className="bg-green-500/20 px-3 py-1 rounded-full text-sm font-semibold text-green-300">
                            Compte actif
                          </span>
                        ) : (
                          <span className="bg-red-500/20 px-3 py-1 rounded-full text-sm font-semibold text-red-300">
                            Compte inactif
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-white/80 text-sm text-center md:text-right">
                    <p>Membre MPB depuis {formatDate(profile.dateInscription)}</p>
                    <p className="mt-1">Dernière connexion : {formatDateTime(profile.lastLogin)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Barre de progression du profil */}
                {!profile.profileCompleted && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <h3 className="font-bold text-yellow-800">Complétez votre profil</h3>
                      </div>
                      <span className="text-sm font-semibold text-yellow-700">
                        {profileStatus.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${profileStatus.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-yellow-700">
                      {profileStatus.missingFields.length > 0 ? (
                        <>
                          Champs manquants : {profileStatus.missingFields.join(', ')}
                          <button
                            onClick={() => setIsEditing(true)}
                            className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Compléter maintenant →
                          </button>
                        </>
                      ) : (
                        'Votre profil est presque complet !'
                      )}
                    </p>
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <Edit2 className="w-5 h-5" />
                        Informations post-connexion
                      </h3>
                      <p className="text-sm text-blue-700">
                        Ces informations nous aident à mieux vous connaître et à vous proposer des activités adaptées.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville de résidence *
                        </label>
                        <input
                          type="text"
                          name="ville"
                          value={editData.ville}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          placeholder="Ex: Cotonou"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville de mobilisation *
                        </label>
                        <input
                          type="text"
                          name="ville_mobilisation"
                          value={editData.ville_mobilisation}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          placeholder="Ex: Cotonou"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section d'appartenance *
                        </label>
                        <input
                          type="text"
                          name="section"
                          value={editData.section}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          placeholder="Ex: Jeunesse, Communication, etc."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Centres d'intérêt / Compétences *
                        </label>
                        <input
                          type="text"
                          name="centres_interet_competences"
                          value={editData.centres_interet_competences}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                          placeholder="Ex: Communication, Organisation d'événements, etc."
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving || !editData.ville || !editData.ville_mobilisation || !editData.section || !editData.centres_interet_competences}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#003366] to-[#004488] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Enregistrement...
                          </>
                        ) : profile.profileCompleted ? (
                          <>
                            <Save className="w-5 h-5" />
                            Mettre à jour le profil
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Compléter mon profil
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditData({
                            ville: profile.ville,
                            ville_mobilisation: profile.ville_mobilisation,
                            section: profile.section,
                            centres_interet_competences: profile.centres_interet_competences
                          });
                        }}
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
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-800">{profile.email}</p>
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
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Âge</p>
                          <p className="font-medium text-gray-800">{profile.age} ans</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Profession</p>
                          <p className="font-medium text-gray-800">{profile.profession}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Disponibilité</p>
                          <p className="font-medium text-gray-800">{profile.disponibilite}</p>
                        </div>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div>
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        Localisation
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-600">Département</p>
                          <p className="font-medium">{profile.departement}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-600">Commune</p>
                          <p className="font-medium">{profile.commune}</p>
                        </div>
                        {profile.ville && (
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-600">Ville de résidence</p>
                            <p className="font-medium">{profile.ville}</p>
                          </div>
                        )}
                        {profile.ville_mobilisation && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-600">Ville de mobilisation</p>
                            <p className="font-medium">{profile.ville_mobilisation}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informations post-connexion */}
                    {(profile.section || profile.centres_interet_competences) && (
                      <div>
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-gray-500" />
                          Engagement MPB
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {profile.section && (
                            <div className="p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-600 mb-1">Section d'appartenance</p>
                              <p className="font-medium text-blue-800">{profile.section}</p>
                            </div>
                          )}
                          {profile.centres_interet_competences && (
                            <div className="p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200">
                              <p className="text-sm text-green-600 mb-1">Centres d'intérêt / Compétences</p>
                              <p className="font-medium text-green-800">{profile.centres_interet_competences}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Motivation */}
                    {profile.motivation && (
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          Motivation personnelle
                        </h3>
                        <p className="text-gray-700 italic">"{profile.motivation}"</p>
                      </div>
                    )}

                    {/* Identifiants */}
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-gray-500" />
                        Identifiants de membre
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">ID Membre</p>
                          <p className="font-mono text-sm text-gray-800">{profile.memberId}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Numéro d'adhésion</p>
                          <p className="font-mono text-sm text-gray-800">{profile.membershipNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#003366] to-[#004488] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                      >
                        <Edit2 className="w-5 h-5" />
                        {profile.profileCompleted ? 'Modifier mon profil' : 'Compléter mon profil'}
                      </button>
                      <button
                        onClick={() => {
                          // Générer une carte de membre (PDF)
                          alert('Fonctionnalité de génération de carte de membre bientôt disponible !');
                        }}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        Carte de membre
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques personnelles */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#003366]" />
                Mon activité
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">Jours d'adhésion</p>
                  <p className="text-2xl font-bold text-blue-900">{calculateDaysSinceJoin()}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <p className="text-sm text-green-700 mb-1">Statut du compte</p>
                  <p className="text-2xl font-bold text-green-900">{profile.isActive ? 'Actif' : 'Inactif'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <p className="text-sm text-purple-700 mb-1">Profil</p>
                  <p className="text-2xl font-bold text-purple-900">{profile.profileCompleted ? 'Complet' : 'Incomplet'}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                  <p className="text-sm text-yellow-700 mb-1">Niveau d'engagement</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {profile.disponibilite.includes('plein') ? 'Élevé' : 
                     profile.disponibilite.includes('jours') ? 'Moyen' : 'Basique'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            {/* État du profil */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#003366]" />
                État de votre profil
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-green-800">Complétude</p>
                    <span className="text-lg font-bold text-green-700">
                      {profileStatus.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${profileStatus.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    {profile.profileCompleted 
                      ? '✅ Votre profil est complet !' 
                      : `📝 ${4 - profileStatus.missingFields.length} champs sur 4 remplis`
                    }
                  </p>
                </div>
                
                {profileStatus.missingFields.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-800 mb-2">Champs à compléter :</p>
                    <ul className="space-y-1 text-sm">
                      {profileStatus.missingFields.map(field => (
                        <li key={field} className="flex items-center gap-2 text-yellow-700">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          {field === 'ville' && 'Ville de résidence'}
                          {field === 'ville_mobilisation' && 'Ville de mobilisation'}
                          {field === 'section' && 'Section d\'appartenance'}
                          {field === 'centres_interet_competences' && 'Centres d\'intérêt'}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-3 w-full py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
                    >
                      Compléter maintenant
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rôle et participation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#003366]" />
                Votre rôle dans le MPB
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-800 mb-1">Type de membre</p>
                  <p className="text-blue-700">{profile.role === 'admin' ? 'Administrateur' : 'Membre actif'}</p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200">
                  <p className="font-semibold text-green-800 mb-1">Disponibilité</p>
                  <p className="text-green-700">{profile.disponibilite}</p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-200">
                  <p className="font-semibold text-purple-800 mb-1">Profession</p>
                  <p className="text-purple-700">{profile.profession}</p>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#003366]" />
                Actions rapides
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/events')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Voir les événements</p>
                    <p className="text-sm text-gray-600">Activités à venir</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/members')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Voir les membres</p>
                    <p className="text-sm text-gray-600">Communauté MPB</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Paramètres</p>
                    <p className="text-sm text-gray-600">Gérer mon compte</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Infos de contact support */}
            <div className="bg-gradient-to-br from-[#003366] to-[#004488] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Besoin d'aide ?</h3>
              
              <div className="space-y-3">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-white/90">
                    Pour toute question concernant votre compte ou votre profil, contactez notre équipe :
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-white/70" />
                    <span className="text-sm">support@mpb.bj</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-white/70" />
                    <span className="text-sm">+229 XX XX XX XX</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Fonctionnalité de contact
                    alert('Page de contact bientôt disponible !');
                  }}
                  className="w-full mt-2 py-2 bg-white text-[#003366] rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Contacter le support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              Mouvement Patriotique du Bénin • Profil de {profile.prenom} {profile.nom}
            </p>
            <p>
              Membre depuis le {formatDate(profile.dateInscription)} • 
              ID: {profile.memberId} • 
              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;