import React from 'react';
import { Check, FileText, Bell, Calendar } from 'lucide-react';

const MemberBenefits = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-yellow-400/10 to-[#003366]/10 rounded-full"></div>
        
        <h2 className="text-2xl font-bold text-[#003366] mb-8 flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-xl flex items-center justify-center shadow-lg">
            <Check className="w-7 h-7 text-white" />
          </div>
          <span className="bg-gradient-to-r from-[#003366] to-[#0055AA] bg-clip-text text-transparent">
            Vos avantages
          </span>
        </h2>
        
        <div className="space-y-8">
          <div className="flex items-start gap-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-[#003366] to-[#0055AA] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#003366] mb-2 text-lg">Carte de membre numérique</h3>
              <p className="text-gray-600">Obtenez votre carte officielle avec QR Code permanent</p>
              <div className="mt-2 inline-flex items-center gap-1 text-sm text-yellow-600 font-medium">
                <span>✔</span>
                <span>Valable à vie</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#003366] mb-2 text-lg">Actualités exclusives</h3>
              <p className="text-gray-600">Accès prioritaire aux analyses et décisions internes du mouvement</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-[#003366] to-[#0055AA] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#003366] mb-2 text-lg">Participation prioritaire</h3>
              <p className="text-gray-600">Accès garanti à nos événements, formations et activités locales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberBenefits;