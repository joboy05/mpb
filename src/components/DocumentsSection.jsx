// DocumentsSection.jsx - Version améliorée
import React from 'react';
import { FileText, Download, BookOpen, Shield, ChevronRight, Eye, Users, TrendingUp } from 'lucide-react';
import ScrollAnimationWrapper from './ScrollAnimationWrapper';
import {  Archive, FolderOpen, FolderArchive } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocumentsSection = () => {
  const documents = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Charte Fondamentale",
      description: "Les principes et valeurs fondamentales du mouvement",
      downloadUrl: "#",
      pages: "24 pages",
      size: "2.4 MB",
      category: "Fondation",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Statuts Officiels",
      description: "Document juridique constitutif du mouvent mouvent mouvement",
      downloadUrl: "#",
      pages: "18 pages",
      size: "1.8 MB",
      category: "Juridique",
      color: "from-green-600 to-green-700"
    }
  ];

  return (
    <section id="textes" className="py-20 px-4 md:px-6 bg-gradient-to-b from-white to-[#f0f7ff]">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <ScrollAnimationWrapper>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-[#003366] rounded-full animate-pulse"></div>
              <div className="w-20 h-px bg-gradient-to-r from-[#003366] via-[#FFD700] to-transparent"></div>
              <div className="text-sm font-semibold text-[#003366] uppercase tracking-wider animate-bounce-slow">
                Documents Officiels
              </div>
              <div className="w-20 h-px bg-gradient-to-l from-[#003366] via-[#FFD700] to-transparent"></div>
              <div className="w-3 h-3 bg-[#003366] rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6 animate-fadeIn">
              <span className="bg-gradient-to-r from-[#003366] via-[#0055AA] to-[#003366] bg-clip-text text-transparent">
                Textes & Documents Fondateurs
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-slideUp">
              Accédez aux documents fondateurs et officiels qui définissent notre vision 
              et notre stratégie pour un Bénin prospère
            </p>
          </div>
        </ScrollAnimationWrapper>

        {/* Grille des documents */}
        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {documents.map((doc, index) => (
              <ScrollAnimationWrapper key={index} delay={index * 100}>
                <div 
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 h-full"
                >
                  {/* En-tête de la carte */}
                  <div className="bg-gradient-to-r from-[#003366] to-[#004488] p-8 relative overflow-hidden h-48">
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          {doc.icon}
                        </div>
                        <span className="text-white text-sm font-semibold bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                          {doc.category}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {doc.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed min-h-[72px]">
                      {doc.description}
                    </p>
                    
                    {/* Métadonnées */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full animate-pulse bg-blue-500"></div>
                          <span className="text-sm text-gray-600 font-medium">{doc.pages}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full animate-pulse bg-green-500"></div>
                          <span className="text-sm text-gray-600 font-medium">{doc.size}</span>
                        </div>
                      </div>
                      
                      <div className="text-4xl font-black opacity-50 text-gray-100">
                        PDF
                      </div>
                    </div>
                    
                    {/* Boutons */}
                    <div className="flex gap-3">
                      <a 
                        href={doc.downloadUrl}
                        className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
                      >
                        <Download className="w-5 h-5 group-hover:animate-bounce" />
                        <span>Télécharger</span>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>

        {/* Section dédiée au Livre Blanc */}
        <ScrollAnimationWrapper delay={400}>
          <div className="mb-16">
            <div 
              className="rounded-3xl p-8 md:p-12 border-2 border-[#0055AA]/30 shadow-2xl text-white"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 51, 102, 0.98) 0%, rgba(0, 68, 136, 0.98) 100%)'
              }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFAA00] rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#003366]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#FFD700]">
                      LIVRE BLANC 2024
                    </h3>
                  </div>
                  
                  <h4 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Notre Feuille de Route pour un Bénin Prospère
                  </h4>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <div className="w-3 h-3 bg-[#003366] rounded-full"></div>
                      </div>
                      <p className="text-white/90">
                        <span className="font-semibold text-white">40 propositions concrètes</span> pour le développement économique
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#00AAFF] rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <p className="text-white/90">
                        <span className="font-semibold text-white">Stratégie éducative innovante</span> pour former 40 000 leaders
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#FFAA00] rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <p className="text-white/90">
                        <span className="font-semibold text-white">Plan d'action détaillé</span> pour chaque département du Bénin
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a 
                      href="#"
                      className="bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                    >
                      <Download className="w-6 h-6" />
                      <span>Télécharger le Livre Blanc</span>
                    </a>
                    
                    <a 
                      href="#"
                      className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:shadow-lg transition-all duration-300 flex items-center gap-3"
                    >
                      <Eye className="w-6 h-6" />
                      <span>Version Interactive</span>
                    </a>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 transform hover:scale-[1.02] transition-transform duration-500">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-black text-[#FFD700] mb-2">40K</div>
                      <div className="text-lg font-bold text-white">Leaders à former d'ici 2031</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/10 rounded-lg p-4 text-center border border-white/10">
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-sm text-white/80">Départements</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center border border-white/10">
                        <div className="text-2xl font-bold text-white">77</div>
                        <div className="text-sm text-white/80">Communes</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFAA00]/20 rounded-lg p-6 border border-[#FFD700]/30">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-6 h-6 text-[#FFD700]" />
                        <div className="font-bold text-white">Impacts Attendus</div>
                      </div>
                      <ul className="space-y-2 text-sm text-white/90">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                          +30% de création d'emplois
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                          Formation de 5000 entrepreneurs
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                          Implantation dans 20 pays
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>

        {/* Archive */}
        <ScrollAnimationWrapper delay={600}>
          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 text-center md:text-left">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-[#003366] mb-2 flex items-center justify-center md:justify-start gap-3">
                  <Shield className="w-6 h-6" />
                  Archives des Publications
                </h3>
                <p className="text-gray-600">
                  Explorez nos documents historiques et rapports annuels
                </p>
              </div>
              <button className="flex items-center justify-center md:justify-start gap-2 text-[#003366] font-semibold hover:text-[#0055AA] transition-colors group mx-auto md:mx-0">
                <span>Voir toutes les archives</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  year: "2023", 
                  count: "12 documents", 
                  color: "bg-gradient-to-br from-[#003366]/10 to-[#0055AA]/20", 
                  icon: <FileText className="w-8 h-8 text-[#003366]" />,
                  iconBg: "bg-gradient-to-br from-[#0055AA]/20 to-[#003366]/30"
                },
                { 
                  year: "2022", 
                  count: "8 documents", 
                  color: "bg-gradient-to-br from-[#003366]/10 to-[#FFD700]/20", 
                  icon: <Archive className="w-8 h-8 text-[#003366]" />,
                  iconBg: "bg-gradient-to-br from-[#FFD700]/20 to-[#FFAA00]/20"
                },
                { 
                  year: "2021", 
                  count: "6 documents", 
                  color: "bg-gradient-to-br from-[#003366]/10 to-[#00AAFF]/20", 
                  icon: <FolderOpen className="w-8 h-8 text-[#003366]" />,
                  iconBg: "bg-gradient-to-br from-[#00AAFF]/20 to-[#003366]/30"
                },
                { 
                  year: "2020", 
                  count: "4 documents", 
                  color: "bg-gradient-to-br from-[#003366]/10 to-[#FFAA00]/20", 
                  icon: <FolderArchive className="w-8 h-8 text-[#003366]" />,
                  iconBg: "bg-gradient-to-br from-[#FFAA00]/20 to-[#FFD700]/20"
                },
              ].map((archive, idx) => (
                <div 
                  key={idx}
                  className={`${archive.color} rounded-2xl p-6 hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-white/50 text-center`}
                >
                  <div className="flex justify-center mb-3">{archive.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{archive.year}</div>
                  <div className="text-sm text-gray-600">{archive.count}</div>
                  <div className="w-8 h-1 bg-gray-300 rounded-full mt-4 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimationWrapper>

        {/* Bannière finale */}
        <ScrollAnimationWrapper delay={800}>
          <div className="bg-gradient-to-r from-[#003366] via-[#0055AA] to-[#003366] rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
            {/* Effet de particules */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/10 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
            
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8">
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    Rejoignez le Mouvement Patriotique
                  </h3>
                  <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto md:mx-0">
                    Téléchargez notre Livre Blanc 2024 et découvrez comment participer 
                    à la construction d'un Bénin prospère et souverain.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Link
                      to="/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#facc15] text-[#003366] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3 group"
                    >
                      <Users className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      <span>Adhérer Maintenant</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                    
                    <a 
                      href="#"
                      className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:shadow-lg transition-all duration-300"
                    >
                      Demander plus d'informations
                    </a>
                  </div>
                </div>
                
                <div className="md:w-1/3 text-center">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
                    <div className="text-5xl font-black mb-4">100%</div>
                    <div className="text-xl font-semibold mb-2">Gratuit & Accessible</div>
                    <p className="text-sm text-white/80">
                      Tous nos documents sont disponibles gratuitement pour tous les citoyens
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};

export default DocumentsSection;