import React from 'react';
import { Heart, Target, Users, Shield, Lightbulb, Award } from 'lucide-react';

const ValuesSection = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Patriotisme",
      description: "Engagement envers notre nation"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Excellence",
      description: "Recherche de la qualité"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Unité",
      description: "Solidarité nationale"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Intégrité",
      description: "Transparence et éthique"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "Solutions modernes"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Leadership",
      description: "Formation des leaders"
    }
  ];

  return (
    <section id="valeurs" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#003366] mb-4">
            Nos Valeurs Fondamentales
          </h2>
          <p className="text-gray-600">
            Les principes qui guident notre action
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                {/* Changement ici : fond jaune au lieu de bleu */}
                <div className="w-12 h-12 bg-[#facc15] rounded-lg flex items-center justify-center text-[#003366]">
                  {value.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#003366] mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;