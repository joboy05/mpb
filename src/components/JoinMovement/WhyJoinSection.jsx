import React from 'react';
import { Check } from 'lucide-react';

const WhyJoinSection = () => {
  return (
    <div className="bg-gradient-to-br from-[#003366] via-[#004488] to-[#003366] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
      {/* Effet de particules */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
          <Check className="w-5 h-5 text-yellow-400" />
        </div>
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
          Pourquoi nous rejoindre ?
        </span>
      </h3>
      
      <ul className="space-y-4 relative z-10">
        <li className="flex items-center gap-4 group">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-white/90 group-hover:text-white transition-colors">Faire partie d'une communauté engagée pour le Bénin</span>
        </li>
        <li className="flex items-center gap-4 group">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-white/90 group-hover:text-white transition-colors">Contribuer activement au développement national</span>
        </li>
        <li className="flex items-center gap-4 group">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-white/90 group-hover:text-white transition-colors">Bénéficier de formations exclusives et d'accompagnement</span>
        </li>
        <li className="flex items-center gap-4 group">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-white/90 group-hover:text-white transition-colors">Participer aux décisions et orientations du mouvement</span>
        </li>
      </ul>
    </div>
  );
};

export default WhyJoinSection;