import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Mail, Home, ArrowLeft, Search } from 'lucide-react';

const SimpleNotFound404 = () => {
  const handleEmailClick = (email) => {
    const subject = encodeURIComponent("Problème d'accès - Page introuvable");
    const body = encodeURIComponent(
      `Bonjour,\n\nJe vous contacte car j'ai rencontré une erreur 404 sur le site du Mouvement Patriotique du Bénin.\n\nURL concernée : ${window.location.href}\n\nDescription du problème :\n[Décrivez ce que vous cherchiez]\n\nCordialement,\n[Votre nom]`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        {/* Grande icône 404 */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-blue-900 mb-4 tracking-tight">
            404
          </h1>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full shadow-lg">
              <AlertCircle className="w-10 h-10 text-blue-900" />
            </div>
          </div>
        </div>

        {/* Message principal */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page introuvable
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <p className="text-gray-500">
            Vérifiez l'URL ou retournez à l'accueil pour continuer votre navigation.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-800 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-blue-900 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Search className="w-5 h-5" />
            Explorer le site
          </Link>
        </div>

        {/* Section contact en bas */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600 mb-4">
            Si le problème persiste, contactez notre équipe technique :
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => handleEmailClick('jolidonhoungue30@gmail.com')}
              className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-500 transition-all shadow-sm hover:shadow-md group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              jolidonhoungue30@gmail.com
            </button>
            
            <span className="text-gray-400 hidden sm:inline">•</span>
            
            <button
              onClick={() => handleEmailClick('7bhilal.chitou7@gmail.com')}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-900 font-medium transition-colors group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              7bhilal.chitou7@gmail.com
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} MPB - Mouvement Patriotique du Bénin
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleNotFound404;