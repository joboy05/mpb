// Remplacer DashboardFooter.jsx par :

import React from 'react';

const DashboardFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-[#003366] to-[#004488] border-t border-[#FFD700]/30 mt-8">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[#CCDDFF]">
              © {new Date().getFullYear()} Mouvement Patriotique du Bénin. Tous droits réservés.
            </p>
            <p className="text-xs text-[#CCDDFF]/60 mt-1">
              Version 1.0.0 • Dernière mise à jour: Aujourd'hui
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="/admin/aide" className="text-sm text-[#CCDDFF] hover:text-[#FFD700] transition-colors">
              Aide
            </a>
            <a href="/admin/confidentialite" className="text-sm text-[#CCDDFF] hover:text-[#FFD700] transition-colors">
              Confidentialité
            </a>
            <a href="/admin/conditions" className="text-sm text-[#CCDDFF] hover:text-[#FFD700] transition-colors">
              Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;