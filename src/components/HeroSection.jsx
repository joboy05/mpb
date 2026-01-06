// HeroSection.jsx - Version corrigée
import React, { useEffect, useState } from 'react';
import { Shield, Flag, Users, Globe, Target, Heart, ChevronDown } from 'lucide-react';
import ScrollToTop from './ScrollToTop';

// Import des images de fond
import hero1 from '../assets/images/hero1.jpeg';
import hero2 from '../assets/images/hero2.jpeg';
import hero3 from '../assets/images/hero3.jpeg';
import hero4 from '../assets/images/hero4.jpeg';
import hero5 from '../assets/images/hero5.jpeg';

// Composant pour le compteur animé - RAPIDISÉ
// COMPOSANT COMPTEUR ULTRA RAPIDE CORRIGÉ
const AnimatedCounter = ({ target, duration = 500, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;

    // MINIMUM de 16ms (60fps) pour éviter le surchargement
    const minInterval = 16;
    
    // Calcul du nombre d'étapes basé sur la durée
    const steps = Math.ceil(duration / minInterval);
    const increment = end / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, minInterval);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <div className="text-3xl md:text-4xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const HeroSection = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Images de fond disponibles avec imports ES6
  const backgroundImages = [hero1, hero2, hero3, hero4, hero5];

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Rotation automatique des images de fond
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change d'image toutes les 5 secondes

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const stats = [
    { value: 10000, label: 'Adhérents', suffix: '+', icon: <Users className="w-6 h-6" /> },
    { value: 12, label: 'Départements', suffix: '', icon: <Globe className="w-6 h-6" /> },
    { value: 4, label: 'Continents', suffix: '', icon: <Target className="w-6 h-6" /> },
    { value: 100, label: 'Engagés', suffix: '%', icon: <Heart className="w-6 h-6" /> }
  ];

  return (
    <section 
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ScrollToTop />
      
      {/* FOND AVEC IMAGES ET OVERLAY RÉDUIT */}
      <div className="absolute inset-0">
        {/* Images de fond avec transition */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image}
              alt={`Fond MPB ${index + 1}`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* OVERLAY BLEU AVEC OPACITÉ RÉDUITE (de 90% à 70%) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/70 via-[#004488]/65 to-[#003366]/70"></div>
          </div>
        ))}

        {/* Gradient overlay réduit */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/60 via-transparent to-[#003366]/60"></div>
      </div>

      {/* Effet de particules dorées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          />
        ))}
      </div>

      {/* Lignes géométriques décoratives */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 py-16">
        {/* Titre principal */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="mb-6 mt-32">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
              Mouvement<br className="sm:hidden" />
              <span className="text-yellow-400 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text animate-glow">
                Patriotique
              </span>
              <br className="sm:hidden" />
              du Bénin
            </h1>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg sm:text-xl md:text-2xl text-white font-light leading-relaxed drop-shadow-lg">
              Reprendre la main sur notre destin • Bâtir ensemble l'avenir
            </p>
          </div>

          {/* Citation inspirante */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-yellow-400/30 transform hover:scale-[1.02] transition-all duration-500">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-yellow-400 rounded-full"></div>
              <p className="text-lg md:text-xl text-white leading-relaxed italic drop-shadow-lg">
                Unissons nos forces pour une gouvernance intègre, une jeunesse valorisée et un Bénin prospère. Rejoignez le mouvement qui redéfinit l'avenir
              </p>
              <div className="mt-4 flex justify-end">
                <span className="text-yellow-400 text-sm font-medium drop-shadow-lg">
                  - Valeur fondamentale du MPB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <a 
            href="https://docs.google.com/forms/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 animate-pulse-slow min-w-[250px] justify-center"
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1200"></div>
            </div>
            
            <Users className="w-5 h-5 relative group-hover:rotate-12 transition-transform" />
            <span className="relative">Adhérer au Mouvement</span>
            <ChevronDown className="w-5 h-5 relative transform -rotate-90 group-hover:translate-x-1 transition-transform" />
          </a>

          <a 
            href="#vision"
            className="group bg-white/15 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/40 hover:bg-white/25 hover:border-white hover:shadow-2xl transition-all duration-300 flex items-center gap-3 min-w-[250px] justify-center"
          >
            <span>Notre Vision 2035</span>
            <ChevronDown className="w-5 h-5 transform -rotate-90 group-hover:translate-y-1 animate-bounce" />
          </a>
        </div>

        {/* Statistiques avec décompte RAPIDE */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-12 md:mb-16 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group text-center bg-white/15 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-2xl border border-white/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 hover:scale-105"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <div className="text-blue-900">
                  {stat.icon}
                </div>
              </div>
              
              {/* Compteur plus rapide (1000ms au lieu de 2000ms) */}
              <AnimatedCounter target={stat.value} duration={1000} suffix={stat.suffix} />
              
              <div className="text-sm md:text-base text-white font-medium mt-2 drop-shadow-lg">
                {stat.label}
              </div>
              
              <div className="w-12 h-1 bg-gradient-to-r from-blue-200 to-yellow-400 rounded-full mx-auto mt-3 md:mt-4 group-hover:w-16 transition-all duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Indicateurs d'images (dots) */}
        <div className="flex justify-center gap-2 mb-8">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-yellow-400 w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Afficher l'image ${index + 1}`}
            />
          ))}
        </div>

        {/* Indicateur de défilement */}
        <div className={`text-center transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="inline-flex flex-col items-center gap-3">
            <span className="text-yellow-400/90 text-sm font-medium drop-shadow-lg">
              Défiler pour découvrir
            </span>
            <ChevronDown className="w-6 h-6 text-yellow-400 animate-bounce-slow drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Ligne décorative du bas */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="w-full h-1 bg-gradient-to-r from-yellow-400 via-blue-400 to-yellow-400 animate-glow-line"></div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.6),
                         0 0 40px rgba(255, 215, 0, 0.4);
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
                         0 0 60px rgba(255, 215, 0, 0.6),
                         0 0 90px rgba(255, 215, 0, 0.4);
          }
        }
        
        @keyframes glow-line {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
            opacity: 0.7;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4),
                        0 15px 40px rgba(0, 51, 102, 0.3);
          }
          50% {
            box-shadow: 0 15px 40px rgba(255, 215, 0, 0.6),
                        0 20px 50px rgba(0, 51, 102, 0.4);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 1s ease-out;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-glow-line {
          animation: glow-line 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .min-w-\[250px\] {
            min-width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;