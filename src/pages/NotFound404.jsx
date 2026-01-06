// SimpleNotFound404.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Mail, Home, CreditCard } from 'lucide-react';

const SimpleNotFound404 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        
        {/* Icône d'erreur */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full border-4 border-white shadow-lg">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Message principal */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Ils nous ont pas payé pour le travail
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Le paiement a été refusé. 
          <br />
          Veuillez contacter notre équipe technique pour résoudre le problème.
        </p>

        {/* Contacts */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Contactez les développeurs
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <a 
                href="mailto:7bhilal.chitou7@gmail.com"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                7bhilal.chitou7@gmail.com
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <a 
                href="mailto:jolidonhoungue30@gmail.com"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                jolidonhoungue30@gmail.com
              </a>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              ⚠️ Toute tentative de fraude sera signalée aux autorités compétentes.
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          
          <Link
            to="/rejoindre"
            className="flex-1 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Réessayer le paiement
          </Link>
        </div>

        {/* Message légal */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MPB - Mouvement Patriotique du Bénin
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleNotFound404;