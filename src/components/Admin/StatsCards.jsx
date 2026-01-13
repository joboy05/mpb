import React from 'react';
import { Users, UserCheck, Shield, BarChart3, TrendingUp, Activity } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Membres",
      value: stats?.totalMembers || 0,
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/10 to-blue-600/10",
      trend: "+12%",
      trendColor: "text-green-400"
    },
    {
      title: "Membres Actifs",
      value: stats?.activeMembers || 0,
      icon: <UserCheck className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/10 to-green-600/10",
      percentage: ((stats?.activeMembers / stats?.totalMembers) * 100 || 0).toFixed(1),
      percentageColor: "text-green-400"
    },
    {
      title: "Administrateurs",
      value: stats?.admins || 0,
      icon: <Shield className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/10 to-purple-600/10",
      link: "/admin/gestion-admins",
      linkText: "Gérer →"
    },
    {
      title: "Inscriptions récentes",
      value: stats?.recentRegistrations || 0,
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-500/10 to-yellow-600/10",
      link: "/admin/inscriptions",
      linkText: "Voir →"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index}
          className="relative group"
        >
          {/* Effet de fond animé */}
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.color} rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-1000 group-hover:duration-200`}></div>
          
          <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
            {/* Background gradient subtile */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgColor} rounded-full -translate-y-16 translate-x-16`}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  {card.icon}
                </div>
              </div>
              
              {/* Contenu spécifique selon la carte */}
              <div className="relative z-10">
                {card.trend && (
                  <div className="flex items-center text-sm">
                    <TrendingUp className={`w-4 h-4 mr-1 ${card.trendColor}`} />
                    <span className={card.trendColor}>{card.trend}</span>
                    <span className="text-gray-400 ml-1">ce mois</span>
                  </div>
                )}
                
                {card.percentage && (
                  <div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                      <div 
                        className={`h-full bg-gradient-to-r ${card.color} rounded-full`}
                        style={{ width: `${card.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {card.percentage}% d'activité
                    </p>
                  </div>
                )}
                
                {card.link && (
                  <a 
                    href={card.link}
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mt-2 group/link"
                  >
                    {card.linkText}
                    <span className="ml-1 transform group-hover/link:translate-x-1 transition-transform">→</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Effet de lumière au hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;