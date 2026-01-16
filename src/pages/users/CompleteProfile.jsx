import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, MapPin, Target, Grid, Star, ArrowRight, Loader } from 'lucide-react';
import { memberService, authService } from '../../services/api';
import Navbar from '../../components/users/Navbar'

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null);
  const [formData, setFormData] = useState({
    ville: '',
    ville_mobilisation: '',
    section: '',
    centres_interet_competences: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const member = authService.getCurrentMember();
    if (!member) {
      navigate('/login');
      return;
    }

    // Charger l'état du profil
    loadProfileStatus();
  }, [navigate]);

  const loadProfileStatus = async () => {
    try {
      const response = await memberService.getProfile();
      if (response.success) {
        setProfileStatus(response.profileStatus);
        
        // Pré-remplir les champs si déjà partiellement remplis
        if (response.member) {
          setFormData({
            ville: response.member.ville || '',
            ville_mobilisation: response.member.ville_mobilisation || '',
            section: response.member.section || '',
            centres_interet_competences: response.member.centres_interet_competences || ''
          });
        }
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.ville.trim()) newErrors.ville = 'La ville est requise';
    if (!formData.ville_mobilisation.trim()) newErrors.ville_mobilisation = 'La ville de mobilisation est requise';
    if (!formData.section.trim()) newErrors.section = 'La section est requise';
    if (!formData.centres_interet_competences.trim()) {
      newErrors.centres_interet_competences = 'Vos centres d\'intérêt sont requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await memberService.completeProfile(formData);
      
      if (response.success) {
        setSuccess(true);
        
        // Mettre à jour les données du membre dans le localStorage
        const currentMember = authService.getCurrentMember();
        const updatedMember = {
          ...currentMember,
          ...formData,
          profileCompleted: true
        };
        authService.saveAuthData(localStorage.getItem('mpb_token'), updatedMember);
        
        // Message de succès
        setTimeout(() => {
          alert('🎉 Profil complété avec succès !');
          navigate('/users/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur complétion profil:', error);
      alert(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (!profileStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-8 h-8 animate-spin text-[#003366]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <div className="relative">
              <UserCheck className="w-12 h-12 text-[#003366]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Complétez votre profil
          </h1>
          
          <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-[#003366] mx-auto mb-6"></div>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Pour finaliser votre adhésion, veuillez renseigner ces informations supplémentaires
          </p>
          
          {/* Barre de progression */}
          <div className="max-w-md mx-auto mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profil complet à</span>
              <span className="text-sm font-bold text-[#003366]">{profileStatus.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-[#003366] h-3 rounded-full transition-all duration-500"
                style={{ width: `${profileStatus.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {profileStatus.missingFields.length > 0 
                ? `Champs manquants: ${profileStatus.missingFields.join(', ')}`
                : '✅ Tous les champs sont remplis'
              }
            </p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <UserCheck className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-6">
              ✅ Profil Complété !
            </h2>
            <p className="text-gray-600 mb-8">
              Votre profil est maintenant complet. Redirection vers votre tableau de bord...
            </p>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003366] mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Ville */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Ville actuelle *</span>
                </label>
                <input type="text" name="ville" value={formData.ville} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                    errors.ville ? 'border-red-300' : 'border-gray-300'
                  }`} 
                  placeholder="Ex: Cotonou, Porto-Novo, Parakou..." />
                {errors.ville && <p className="mt-1 text-sm text-red-600">{errors.ville}</p>}
                <p className="text-sm text-gray-500 mt-2">
                  Ville où vous résidez actuellement
                </p>
              </div>

              {/* Ville de mobilisation */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>Ville de mobilisation *</span>
                </label>
                <input type="text" name="ville_mobilisation" value={formData.ville_mobilisation} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                    errors.ville_mobilisation ? 'border-red-300' : 'border-gray-300'
                  }`} 
                  placeholder="Ex: Cotonou, Abomey-Calavi..." />
                {errors.ville_mobilisation && <p className="mt-1 text-sm text-red-600">{errors.ville_mobilisation}</p>}
                <p className="text-sm text-gray-500 mt-2">
                  Ville où vous souhaitez être actif au sein du MPB
                </p>
              </div>

              {/* Section */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Grid className="w-5 h-5" />
                  <span>Section *</span>
                </label>
                <select name="section" value={formData.section} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                    errors.section ? 'border-red-300' : 'border-gray-300'
                  }`}>
                  <option value="">Sélectionnez votre section</option>
                  <option value="Jeunesse">Jeunesse MPB</option>
                  <option value="Femmes">Femmes MPB</option>
                  <option value="Professionnels">Professionnels</option>
                  <option value="Diaspora">Diaspora</option>
                  <option value="Communication">Communication</option>
                  <option value="Logistique">Logistique</option>
                  <option value="Formation">Formation</option>
                  <option value="Autre">Autre</option>
                </select>
                {errors.section && <p className="mt-1 text-sm text-red-600">{errors.section}</p>}
                <p className="text-sm text-gray-500 mt-2">
                  Section du mouvement où vous souhaitez vous impliquer
                </p>
              </div>

              {/* Centres d'intérêt et compétences */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span>Centres d'intérêt & Compétences *</span>
                </label>
                <textarea name="centres_interet_competences" value={formData.centres_interet_competences} 
                  onChange={handleChange} rows="5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent resize-none transition-colors ${
                    errors.centres_interet_competences ? 'border-red-300' : 'border-gray-300'
                  }`} 
                  placeholder="Ex: Communication, Organisation d'événements, Informatique, Sensibilisation, Réseautage..." />
                {errors.centres_interet_competences && (
                  <p className="mt-1 text-sm text-red-600">{errors.centres_interet_competences}</p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Décrivez vos centres d'intérêt et compétences
                  </p>
                  <p className={`text-sm ${formData.centres_interet_competences.length < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {formData.centres_interet_competences.length}/10
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">
                      Pourquoi compléter votre profil ?
                    </h4>
                    <ul className="text-sm text-yellow-700/80 space-y-1">
                      <li>• Accéder à toutes les fonctionnalités du mouvement</li>
                      <li>• Recevoir des invitations aux événements locaux</li>
                      <li>• Être contacté pour des opportunités de bénévolat</li>
                      <li>• Faire partie des statistiques officielles du MPB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <button type="submit" disabled={loading}
                className="w-full group relative bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      Finaliser mon profil
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              {/* Lien pour plus tard */}
              <div className="text-center pt-4 border-t border-gray-200">
                <button type="button" onClick={() => navigate('/users/dashboard')}
                  className="text-gray-600 hover:text-[#003366] font-medium">
                  Compléter plus tard →
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] text-white py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-transparent mx-auto mb-6"></div>
            <p className="text-blue-200/90">
              © 2025 Mouvement Patriotique du Bénin. Tous droits réservés.
            </p>
            <p className="text-blue-200/70 text-sm mt-2">
              Patrie • Jeunesse • Pouvoir
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompleteProfile;