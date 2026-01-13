import React from 'react';
import { Crown, Shield, Star } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="relative mb-8">
      {/* Effets décoratifs */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#FFD700]/10 to-[#FFAA00]/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-[#00AAFF]/10 to-[#0055AA]/10 rounded-full blur-2xl"></div>
      
      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FFAA00] flex items-center justify-center shadow-lg">
            <Crown className="w-8 h-8 text-[#003366]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] bg-clip-text text-transparent">
              Tableau de bord Administrateur
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Gérez les membres et les activités du <span className="font-semibold text-[#003366]">Mouvement Patriotique du Bénin</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#003366]/10 to-[#004488]/10 rounded-full border border-[#003366]/20">
            <Shield className="w-4 h-4 text-[#003366]" />
            <span className="text-sm font-medium text-[#003366]">Administration sécurisée</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700]/10 to-[#FFAA00]/10 rounded-full border border-[#FFD700]/20">
            <Star className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm font-medium text-[#003366]">Interface premium</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;