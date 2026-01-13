import React from 'react';
import { Calendar, Mail, FileText, Users, Bell } from 'lucide-react';
// Modifier les gradients pour correspondre au thème :
const QuickActions = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-r from-[#003366]/10 to-[#004488]/10 rounded-xl p-6 border border-[#003366]/20 backdrop-blur-sm">
        <h3 className="font-bold text-lg text-[#003366] mb-4">Actions rapides</h3>
        <div className="space-y-3">
          <button className="w-full text-left bg-white border border-[#003366]/20 text-[#003366] px-4 py-3 rounded-lg hover:bg-[#003366]/5 hover:border-[#FFD700] transition-all duration-300 flex items-center">
            <Calendar className="w-5 h-5 mr-3 text-[#003366]" />
            Créer un événement
          </button>
          <button className="w-full text-left bg-white border border-[#003366]/20 text-[#003366] px-4 py-3 rounded-lg hover:bg-[#003366]/5 hover:border-[#FFD700] transition-all duration-300 flex items-center">
            <Mail className="w-5 h-5 mr-3 text-[#003366]" />
            Envoyer un email groupé
          </button>
          <button className="w-full text-left bg-white border border-[#003366]/20 text-[#003366] px-4 py-3 rounded-lg hover:bg-[#003366]/5 hover:border-[#FFD700] transition-all duration-300 flex items-center">
            <FileText className="w-5 h-5 mr-3 text-[#003366]" />
            Générer un rapport
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFAA00]/10 rounded-xl p-6 border border-[#FFD700]/20 backdrop-blur-sm">
        <h3 className="font-bold text-lg text-[#003366] mb-4">Statistiques rapides</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#003366]">Taux d'inscription ce mois</p>
            <div className="flex items-center">
              <div className="flex-1 h-2 bg-[#003366]/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFAA00] rounded-full w-3/4"></div>
              </div>
              <span className="ml-3 text-lg font-bold text-[#003366]">75%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-[#003366]">Membres par département (Top 3)</p>
            <ul className="mt-2 space-y-2">
              <li className="flex justify-between text-sm text-[#003366]">
                <span>Littoral</span>
                <span className="font-semibold">42%</span>
              </li>
              <li className="flex justify-between text-sm text-[#003366]">
                <span>Atlantique</span>
                <span className="font-semibold">28%</span>
              </li>
              <li className="flex justify-between text-sm text-[#003366]">
                <span>Ouémé</span>
                <span className="font-semibold">15%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#00AAFF]/10 to-[#0055AA]/10 rounded-xl p-6 border border-[#00AAFF]/20 backdrop-blur-sm">
        <h3 className="font-bold text-lg text-[#003366] mb-4">Dernières activités</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#FFAA00] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <Users className="w-4 h-4 text-[#003366]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#003366]">Nouveau membre inscrit</p>
              <p className="text-xs text-[#003366]/70">Il y a 2 heures</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00AAFF] to-[#0055AA] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#003366]">Email envoyé à 15 membres</p>
              <p className="text-xs text-[#003366]/70">Il y a 5 heures</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#003366]">Événement créé</p>
              <p className="text-xs text-[#003366]/70">Il y a 1 jour</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;