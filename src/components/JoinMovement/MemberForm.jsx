import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, Check, Phone, Loader } from 'lucide-react';
import CountrySelect from './CountrySelect';
import BeninLocation from './BeninLocation';
import YearSelect from './YearSelect';
import { authService } from '../../services/api'; // Import du service Axios

const MemberForm = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phoneCode: '+229',
    telephone: '',
    birthYear: '',
    pays: 'Bénin',
    department: '',
    commune: '',
    disponibilite: '',
    profession: '',
    motivation: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleCountryChange = (countryName) => {
    setFormData(prev => ({
      ...prev,
      pays: countryName,
      department: '',
      commune: ''
    }));
  };

  const handlePhoneCodeChange = (phoneCode) => {
    setFormData(prev => ({
      ...prev,
      phoneCode
    }));
  };

  const handleDepartmentChange = (department) => {
    setFormData(prev => ({
      ...prev,
      department,
      commune: ''
    }));
  };

  const handleCommuneChange = (commune) => {
    setFormData(prev => ({
      ...prev,
      commune
    }));
  };

  const calculateAge = (birthYear) => {
    if (!birthYear) return null;
    return currentYear - parseInt(birthYear);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    else if (formData.nom.trim().length < 2) newErrors.nom = 'Minimum 2 caractères';
    
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    else if (formData.prenom.trim().length < 2) newErrors.prenom = 'Minimum 2 caractères';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Format d\'email invalide';
    
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    
    const birthYear = parseInt(formData.birthYear);
    const age = calculateAge(formData.birthYear);
    if (!formData.birthYear) newErrors.birthYear = 'L\'année de naissance est requise';
    else if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
      newErrors.birthYear = `Année invalide (1900-${currentYear})`;
    } else if (age < 16) newErrors.birthYear = 'Minimum 16 ans';
    
    if (formData.pays === 'Bénin') {
      if (!formData.department) newErrors.department = 'Le département est requis';
      if (!formData.commune) newErrors.commune = 'La commune est requise';
    } else if (!formData.commune.trim()) newErrors.commune = 'La ville/région est requise';
    
    if (!formData.profession) newErrors.profession = 'La profession est requise';
    if (!formData.disponibilite) newErrors.disponibilite = 'La disponibilité est requise';
    
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmation requise';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.motivation.trim()) newErrors.motivation = 'La motivation est requise';
    else if (formData.motivation.trim().length < 20) newErrors.motivation = 'Minimum 20 caractères';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Préparer les données pour l'API
      const memberData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneCode: formData.phoneCode,
        telephone: formData.telephone.trim(),
        birthYear: parseInt(formData.birthYear),
        pays: formData.pays,
        department: formData.department,
        commune: formData.commune,
        profession: formData.profession,
        disponibilite: formData.disponibilite,
        motivation: formData.motivation.trim(),
        password: formData.password
      };
      
      // Appel API avec Axios
      const result = await authService.register(memberData);
      
      // Sauvegarder le token et les données
      authService.saveAuthData(result.token, result.member);
      
      // Message de succès
      alert(`🎉 Inscription réussie !\nBienvenue ${result.member.prenom} !\nNuméro de membre: ${result.member.membershipNumber}`);
      
      // Rediriger
      navigate('/carte-membre', { state: { memberData: result.member } });
      
    } catch (error) {
      console.error('Erreur inscription:', error);
      
      // Gérer les erreurs spécifiques d'Axios
      if (error.message.includes('déjà utilisé') || error.message?.includes('email')) {
        setErrors({ email: 'Cet email est déjà utilisé' });
      } else if (error.message) {
        alert(error.message || "Erreur d'inscription");
      } else {
        alert('Erreur de connexion au serveur. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const disponibilites = [
    'Quelques heures par semaine',
    '1-2 jours par semaine',
    '3-4 jours par semaine',
    'Temps plein',
    'Weekends uniquement'
  ];

  const professions = [
    'Étudiant', 'Employé', 'Fonctionnaire', 'Entrepreneur', 'Commerçant',
    'Agriculteur', 'Artisan', 'Profession libérale', 'Retraité', 'Sans emploi', 'Autre'
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-[#003366]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#003366] flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-lg flex items-center justify-center shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#003366] to-[#0055AA] bg-clip-text text-transparent">
              Créer un compte
            </span>
          </h2>
          <div className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
            🎯 Inscription
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champs nom/prénom */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                  errors.nom ? 'border-red-300' : 'border-gray-300'
                }`} placeholder="Votre nom" />
              {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                  errors.prenom ? 'border-red-300' : 'border-gray-300'
                }`} placeholder="Votre prénom" />
              {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`} placeholder="exemple@email.com" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Pays */}
          <CountrySelect
            value={formData.pays}
            onChange={handleCountryChange}
            onPhoneCodeChange={handlePhoneCodeChange}
          />

          {/* Téléphone */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" /> <span>Téléphone *</span>
            </label>
            <div className="flex">
              <div className="inline-flex items-center px-4 border border-r-0 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-l-lg font-medium min-w-[100px]">
                {formData.phoneCode}
              </div>
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
                placeholder="XX XX XX XX"
                className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent ${
                  errors.telephone ? 'border-red-300' : 'border-gray-300'
                }`} />
            </div>
            {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
          </div>

          {/* Année de naissance */}
          <div className="group">
            <YearSelect
              value={formData.birthYear}
              onChange={(year) => {
                setFormData(prev => ({ ...prev, birthYear: year }));
                if (errors.birthYear) setErrors(prev => ({ ...prev, birthYear: '' }));
              }}
              label="Année de naissance *"
              minAge={18}
            />
            {errors.birthYear && <p className="mt-1 text-sm text-red-600">{errors.birthYear}</p>}
            
            {formData.birthYear && !errors.birthYear && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Âge : </span>
                <span className="text-[#003366] font-semibold">
                  {calculateAge(formData.birthYear)} ans
                </span>
                {calculateAge(formData.birthYear) < 18 && (
                  <span className="ml-2 text-yellow-600 text-xs bg-yellow-50 px-2 py-1 rounded">
                    Mineur
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Localisation Bénin */}
          {formData.pays === 'Bénin' && (
            <BeninLocation
              department={formData.department}
              commune={formData.commune}
              onDepartmentChange={handleDepartmentChange}
              onCommuneChange={handleCommuneChange}
              errors={errors}
            />
          )}

          {/* Localisation autre pays */}
          {formData.pays && formData.pays !== 'Bénin' && (
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville/Région *</label>
              <input type="text" name="commune" value={formData.commune} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                  errors.commune ? 'border-red-300' : 'border-gray-300'
                }`} placeholder="Votre ville ou région" />
              {errors.commune && <p className="mt-1 text-sm text-red-600">{errors.commune}</p>}
            </div>
          )}

          {/* Profession et disponibilité */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession *</label>
              <select name="profession" value={formData.profession} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                  errors.profession ? 'border-red-300' : 'border-gray-300'
                }`}>
                <option value="">Sélectionnez...</option>
                {professions.map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
              {errors.profession && <p className="mt-1 text-sm text-red-600">{errors.profession}</p>}
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité *</label>
              <select name="disponibilite" value={formData.disponibilite} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                  errors.disponibilite ? 'border-red-300' : 'border-gray-300'
                }`}>
                <option value="">Choisir...</option>
                {disponibilites.map(dispo => (
                  <option key={dispo} value={dispo}>{dispo}</option>
                ))}
              </select>
              {errors.disponibilite && <p className="mt-1 text-sm text-red-600">{errors.disponibilite}</p>}
            </div>
          </div>

          {/* Mots de passe */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`} placeholder="Minimum 8 caractères" />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmation *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`} placeholder="Retapez votre mot de passe" />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Motivation */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Motivation *</label>
            <textarea name="motivation" value={formData.motivation} onChange={handleChange} rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent resize-none transition-colors ${
                errors.motivation ? 'border-red-300' : 'border-gray-300'
              }`} placeholder="Pourquoi souhaitez-vous rejoindre le Mouvement Patriotique du Bénin ?" />
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-500">Minimum 20 caractères</p>
              <p className={`text-sm ${
                formData.motivation.length < 20 ? 'text-red-600' : 'text-green-600'
              }`}>{formData.motivation.length}/20</p>
            </div>
            {errors.motivation && <p className="mt-1 text-sm text-red-600">{errors.motivation}</p>}
          </div>

          {/* Confidentialité */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Confidentialité garantie</h4>
                <p className="text-sm text-yellow-700/80">
                  Vos informations sont sécurisées et utilisées uniquement pour votre adhésion au mouvement.
                </p>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input type="checkbox" id="conditions"
              className="w-5 h-5 text-[#003366] border-gray-300 rounded focus:ring-[#003366] mt-1 flex-shrink-0" required />
            <label htmlFor="conditions" className="text-sm text-gray-700">
              J'accepte les{' '}
              <a href="#" className="text-[#003366] font-semibold hover:underline">conditions d'utilisation</a>
              {' '}et la{' '}
              <a href="#" className="text-[#003366] font-semibold hover:underline">politique de confidentialité</a>
              {' '}du Mouvement Patriotique du Bénin *
            </label>
          </div>

          {/* Bouton de soumission */}
          <button type="submit" disabled={loading}
            className="w-full group relative bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  Valider mon inscription
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </span>
          </button>

          {/* Lien de connexion */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Déjà membre ?{' '}
              <a href="/rejoindre" className="font-semibold bg-gradient-to-r from-[#003366] to-[#0055AA] bg-clip-text text-transparent hover:underline">
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;