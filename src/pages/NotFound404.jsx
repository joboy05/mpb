import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Mail, Phone, Home, ArrowLeft } from 'lucide-react';

const SimpleNotFound404 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Icône de maintenance */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
                <Settings className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
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
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 mb-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Besoin d'assistance ?
            </h2>
            <p className="text-center text-gray-600 mb-4 text-sm">
              Pour toute urgence, contactez notre équipe technique
            </p>
            
            <div className="space-y-3">
              <a 
                href="mailto:7bhilal.chitou7@gmail.com"
                className="flex items-center justify-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-slate-200 group"
              >
                <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-gray-700 font-medium">7bhilal.chitou7@gmail.com</span>
              </a>
              
              <a 
                href="mailto:jolidonhoungue30@gmail.com"
                className="flex items-center justify-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-slate-200 group"
              >
                <Mail className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-gray-700 font-medium">jolidonhoungue30@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Bouton retour */}
          <div className="flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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