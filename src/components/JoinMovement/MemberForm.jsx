// components/JoinMovement/MemberForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, Check, Phone, Calendar } from 'lucide-react';
import CountrySelect from './CountrySelect';
import BeninLocation from './BeninLocation';
import YearSelect from './YearSelect';

const MemberForm = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phoneCode: '+229', // Par défaut Bénin
    telephone: '',
    birthYear: '', // Changé de 'age' à 'birthYear'
    pays: 'Bénin', // Par défaut Bénin
    department: '',
    commune: '',
    disponibilite: '',
    profession: '',
    motivation: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (countryName) => {
    setFormData(prev => ({
      ...prev,
      pays: countryName,
      department: '', // Réinitialiser si pays change
      commune: '' // Réinitialiser si pays change
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
      commune: '' // Réinitialiser la commune quand le département change
    }));
  };

  const handleCommuneChange = (commune) => {
    setFormData(prev => ({
      ...prev,
      commune
    }));
  };

  // Calculer l'âge à partir de l'année de naissance
  const calculateAge = (birthYear) => {
    if (!birthYear) return null;
    return currentYear - parseInt(birthYear);
  };

  const generateMembershipNumber = () => {
    const prefix = 'MPB-';
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const year = new Date().getFullYear();
    return `${prefix}${year}-${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation de l'année de naissance
    const birthYear = parseInt(formData.birthYear);
    const age = calculateAge(formData.birthYear);
    
    if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
      alert(`Veuillez entrer une année de naissance valide (1900-${currentYear})`);
      return;
    }
    
    if (age < 16) {
      alert('Vous devez avoir au moins 16 ans pour vous inscrire');
      return;
    }

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Validation spécifique pour le Bénin
    if (formData.pays === 'Bénin' && (!formData.department || !formData.commune)) {
      alert('Veuillez sélectionner votre département et commune pour le Bénin');
      return;
    }

    // Générer un ID de membre unique
    const memberId = 'MPB' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Créer un objet avec toutes les données du membre
    const memberData = {
      ...formData,
      age: age, // Ajouter l'âge calculé
      memberId,
      dateInscription: new Date().toISOString(),
      status: 'Actif',
      membershipNumber: generateMembershipNumber(),
      subscriptionDate: new Date().toLocaleDateString('fr-FR'),
      permanent: true
    };
    
    // Sauvegarder dans localStorage
    const members = JSON.parse(localStorage.getItem('mpb_members') || '[]');
    
    if (members.some(member => member.email === formData.email)) {
      alert('Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.');
      return;
    }
    
    members.push(memberData);
    localStorage.setItem('mpb_members', JSON.stringify(members));
    localStorage.setItem('current_member', JSON.stringify(memberData));
    
    // Rediriger
    navigate('/carte-membre', { state: { memberData } });
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

  // Générer les années de naissance possibles (1900 à présent - 16 ans)
  const birthYears = [];
  const minBirthYear = 1900;
  const maxBirthYear = currentYear - 16;
  
  for (let year = maxBirthYear; year >= minBirthYear; year--) {
    birthYears.push(year);
  }

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
                required
                placeholder="Votre nom"
              />
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
                required
                placeholder="Votre prénom"
              />
            </div>
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
              required
              placeholder="exemple@email.com"
            />
          </div>

          {/* Pays avec recherche intelligente */}
          <CountrySelect
            value={formData.pays}
            onChange={handleCountryChange}
            onPhoneCodeChange={handlePhoneCodeChange}
          />

          {/* Téléphone avec code pays dynamique */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Téléphone</span>
            </label>
            <div className="flex">
              <div className="inline-flex items-center px-4 border border-r-0 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-l-lg font-medium min-w-[100px]">
                {formData.phoneCode}
              </div>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="XX XX XX XX"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Année de naissance */}
          <div className="group">
<div className="group">
  <YearSelect
    value={formData.birthYear}
    onChange={(year) => setFormData(prev => ({ ...prev, birthYear: year }))}
    label="Année de naissance"
    minAge={18}
  />
</div>
            
            {/* Afficher l'âge calculé */}
            {formData.birthYear && (
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

          {/* Si pays = Bénin, afficher départements et communes */}
          {formData.pays === 'Bénin' && (
            <BeninLocation
              department={formData.department}
              commune={formData.commune}
              onDepartmentChange={handleDepartmentChange}
              onCommuneChange={handleCommuneChange}
            />
          )}

          {/* Si autre pays, afficher un champ texte simple pour la ville */}
          {formData.pays && formData.pays !== 'Bénin' && (
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville/Région
              </label>
              <input
                type="text"
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
                required
                placeholder="Votre ville ou région"
              />
            </div>
          )}

          {/* Profession et disponibilité */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession
              </label>
              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
                required
              >
                <option value="">Sélectionnez...</option>
                {professions.map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilité
              </label>
              <select
                name="disponibilite"
                value={formData.disponibilite}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
                required
              >
                <option value="">Choisir...</option>
                {disponibilites.map(dispo => (
                  <option key={dispo} value={dispo}>{dispo}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mots de passe */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
                required
                placeholder="Minimum 8 caractères"
                minLength="8"
              />
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
                required
                placeholder="Retapez votre mot de passe"
              />
            </div>
          </div>

          {/* Motivation */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivation
            </label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors resize-none"
              placeholder="Pourquoi souhaitez-vous rejoindre le Mouvement Patriotique du Bénin ?"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Minimum 20 caractères</p>
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
            <input
              type="checkbox"
              id="conditions"
              className="w-5 h-5 text-[#003366] border-gray-300 rounded focus:ring-[#003366] mt-1"
              required
            />
            <label htmlFor="conditions" className="text-sm text-gray-700">
              J'accepte les{' '}
              <a href="#" className="text-[#003366] font-semibold hover:underline">conditions d'utilisation</a>
              {' '}et la{' '}
              <a href="#" className="text-[#003366] font-semibold hover:underline">politique de confidentialité</a>
              {' '}du Mouvement Patriotique du Bénin
            </label>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            className="w-full group relative bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3">
              Valider mon inscription
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
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