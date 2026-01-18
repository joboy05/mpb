import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock, AlertCircle, Phone, Globe, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/api';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Email
    code_telephone: '+', // Changé de phoneCode à code_telephone
    phoneNumber: '',
    password: ''
  });
  const [loginType, setLoginType] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setFormData(prev => ({
      ...prev,
      identifier: '',
      phoneNumber: '',
      code_telephone: '+'
    }));
    setError('');
  };

  const handlePhoneCodeChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+')) value = '+' + value.replace(/[^0-9]/g, '');
    if (value === '') value = '+';
    const numbersOnly = value.slice(1).replace(/[^0-9]/g, '');
    if (numbersOnly.length <= 4) {
      setFormData(prev => ({ ...prev, code_telephone: '+' + numbersOnly }));
    }
  };

  const validatePhoneCode = (code) => /^\+\d{1,4}$/.test(code);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let loginData;

      if (loginType === 'email') {
        if (!formData.identifier.trim()) {
          setError('Veuillez entrer votre email');
          setLoading(false);
          return;
        }

        loginData = {
          identifier: formData.identifier.trim().toLowerCase(),
          password: formData.password,
          loginType: 'email'
        };
      } else {
        if (!validatePhoneCode(formData.code_telephone)) {
          setError('Code pays invalide. Format: +XX ou +XXX');
          setLoading(false);
          return;
        }

        if (!formData.phoneNumber.trim()) {
          setError('Veuillez entrer votre numéro de téléphone');
          setLoading(false);
          return;
        }

        // CORRECTION : Envoyer code_telephone (pas phoneCode)
        loginData = {
          identifier: formData.phoneNumber,
          code_telephone: formData.code_telephone, // Champ corrigé
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          loginType: 'phone'
        };
      }

      const response = await authService.login(loginData);

      if (response.success) {
        authService.saveAuthData(response.token, response.member);

        const welcomeMessage = response.member.role === 'admin'
          ? `👑 Bienvenue Administrateur ${response.member.prenom} !`
          : `✅ Bienvenue ${response.member.prenom} !`;

        alert(welcomeMessage);

        // VÉRIFICATION PROFIL COMPLET
        if (response.member.role !== 'admin') {
          if (response.member.profileStatus && !response.member.profileStatus.completed) {
            window.location.href = '/profile/complete';
            return;
          }
          if (!response.member.profileCompleted) {
            window.location.href = '/profile/complete';
            return;
          }
        }

        // Redirection
        if (response.member.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/users/dashboard';
        }
      } else {
        setError(response.message || 'Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-[#003366]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#003366] flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-lg flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#003366] to-[#0055AA] bg-clip-text text-transparent">
              Connexion
            </span>
          </h2>
        </div>

        <div className="flex gap-3 mb-6">
          <button type="button" onClick={() => handleLoginTypeChange('email')}
            className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-300 ${loginType === 'email'
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 shadow-sm'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" /><span>Email</span>
            </div>
          </button>
          <button type="button" onClick={() => handleLoginTypeChange('phone')}
            className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-300 ${loginType === 'phone'
              ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700 shadow-sm'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /><span>Téléphone</span>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-red-600 font-medium">Erreur de connexion</p>
                <p className="text-red-600/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {loginType === 'email' ? (
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /><span>Email</span>
                </label>
                <input type="email" name="identifier" value={formData.identifier} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
                  required placeholder="Ex: jean.dupont@gmail.com" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="group">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" /><span>Téléphone</span>
                  </label>

                  <div className="flex gap-2 items-start">
                    <div className="relative w-28 flex-shrink-0">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" name="code_telephone" value={formData.code_telephone} onChange={handlePhoneCodeChange}
                        className="w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent text-center font-mono"
                        placeholder="+229" required maxLength={5} />
                    </div>

                    <div className="flex-1">
                      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                        placeholder="Ex: 01 61 23 45 67" required />
                    </div>
                  </div>

                  {formData.code_telephone && formData.phoneNumber && validatePhoneCode(formData.code_telephone) && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Numéro complet : </span>
                      <span className="font-semibold text-[#003366] font-mono">
                        {formData.code_telephone} {formData.phoneNumber}
                      </span>
                    </div>
                  )}

                  {formData.code_telephone && !validatePhoneCode(formData.code_telephone) && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        ⚠️ Format code pays invalide. Exemples : <code className="font-mono bg-yellow-100 px-1 rounded">+229</code>, <code className="font-mono bg-yellow-100 px-1 rounded">+33</code>, <code className="font-mono bg-yellow-100 px-1 rounded">+1</code>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" /><span>Mot de passe</span>
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
                  required placeholder="Votre mot de passe" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#003366]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember"
                className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]" />
              <label htmlFor="remember" className="text-sm text-gray-700">Se souvenir de moi</label>
            </div>
            <a href="#" className="text-sm text-[#003366] font-semibold hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <button type="submit" disabled={loading}
            className="w-full group relative bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </span>
          </button>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Pas encore membre ?{' '}
              <Link to="/register" className="font-semibold bg-gradient-to-r from-[#003366] to-[#0055AA] bg-clip-text text-transparent hover:underline">
                S'inscrire maintenant
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;