import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Mail, Home, ArrowLeft } from 'lucide-react';

const SimpleNotFound404 = () => {
  const handleEmailClick = (email, isPrimary) => {
    const subject = encodeURIComponent("Demande d'assistance - Site en maintenance");
    const body = encodeURIComponent(
      `Bonjour,\n\nJe vous contacte concernant le site du Mouvement Patriotique du Bénin qui est actuellement en maintenance.\n\nJe souhaiterais obtenir des informations sur :\n- La durée estimée de la maintenance\n- L'état d'avancement des travaux\n- [Votre question spécifique ici]\n\nCordialement,\n[Votre nom]`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          {/* Icône de maintenance */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-900 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full shadow-lg">
                <Settings className="w-12 h-12 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>

          {/* Message principal */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Maintenance en cours
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Notre site est actuellement en maintenance technique.
            </p>
            <p className="text-gray-500">
              Nous travaillons à améliorer votre expérience. Merci de votre patience.
            </p>
          </div>

          {/* Section contact */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Besoin d'assistance ?
            </h2>
            <p className="text-center text-gray-600 mb-4 text-sm">
              Pour toute urgence, contactez notre équipe technique
            </p>
            
            <div className="space-y-3">
              {/* Email principal - plus visible */}
              <button
                onClick={() => handleEmailClick('jolidonhoungue30@gmail.com', true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
              >
                <Mail className="w-5 h-5 text-blue-900 group-hover:scale-110 transition-transform" />
                <span className="text-blue-900 font-semibold text-lg">jolidonhoungue30@gmail.com</span>
              </button>
              
              {/* Email secondaire */}
              <button
                onClick={() => handleEmailClick('7bhilal.chitou7@gmail.com', false)}
                className="w-full flex items-center justify-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 group"
              >
                <Mail className="w-4 h-4 text-blue-900 group-hover:scale-110 transition-transform" />
                <span className="text-gray-700 font-medium">7bhilal.chitou7@gmail.com</span>
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-900 text-center">
                💡 Un message pré-rempli s'ouvrira automatiquement
              </p>
            </div>
          </div>

          {/* Bouton retour */}
          <div className="flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-800 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} MPB - Mouvement Patriotique du Bénin
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Merci de votre compréhension
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleNotFound404;


