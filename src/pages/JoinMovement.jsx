// JoinMovement.jsx - Maintenant page de connexion
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import MemberBenefits from '../components/JoinMovement/MemberBenefits';
import WhyJoinSection from '../components/JoinMovement/WhyJoinSection';
import LoginForm from '../components/JoinMovement/LoginForm';
import InfoSection from '../components/JoinMovement/InfoSection';

const JoinMovement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <ScrollToTop />
      
      <div className="max-w-6xl mx-auto mt-20 px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <div className="relative">
              <UserPlus className="w-10 h-10 text-[#003366]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Accès Membre
          </h1>
          
          <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-[#003366] mx-auto mb-6"></div>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connectez-vous à votre espace membre pour accéder à tous les avantages
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Section gauche : Avantages */}
          <div className="space-y-8">
            <MemberBenefits />
            <WhyJoinSection />
          </div>

          {/* Section droite : Formulaire de connexion */}
          <LoginForm />
        </div>

        {/* Section info supplémentaire */}
        <InfoSection />
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

export default JoinMovement;