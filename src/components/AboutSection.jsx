import React from 'react';
import { Target, Globe, Award, TrendingUp, ChevronRight } from 'lucide-react';
import rw from '../assets/images/RW.png';

const AboutSection = () => {
  return (
    <section id="apropos" className="py-16 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonne gauche - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={rw}
                alt="Romuald Wadagni"
                className="w-full h-auto object-cover aspect-[4/5] lg:aspect-auto lg:h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
            </div>
            
            {/* Badge décoratif */}
            <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-blue-900 px-6 py-4 rounded-2xl shadow-xl max-w-[80%] md:max-w-none md:px-8">
              <div className="text-xl md:text-3xl font-bold">Romuald Wadagni</div>
              <div className="text-xs md:text-sm font-semibold">Candidat à l’élection Présidentielle</div>
            </div>
          </div>
          
          {/* Colonne droite - Contenu */}
          <div>
            <div className="mb-8">
              <span className="inline-block bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Notre Vision
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                L'Homme de la Situation
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Un parcours d'excellence au service du peuple. Romuald Wadagni incarne la compétence technique 
                alliée à une vision politique audacieuse pour transformer durablement le Bénin.
              </p>
            </div>
            
            {/* Points clés */}
            <div className="space-y-8 mb-10">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">Expertise Économique</h4>
                  <p className="text-gray-600">
                    Une expérience financière reconnue internationalement pour redresser et dynamiser notre économie.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">Vision pour l'Éducation</h4>
                  <p className="text-gray-600">
                    La modernisation de notre système éducatif comme pilier central du développement national.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">Intégrité & Gouvernance</h4>
                  <p className="text-gray-600">
                    Une approche de la gestion publique fondée sur la transparence, la rigueur et l'exemplarité.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bouton d'action */}
            <div className="mt-10">
              <a 
                href="#contact"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <span>Soutenir la Vision</span>
                <ChevronRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;