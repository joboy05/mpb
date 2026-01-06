import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Target, Users, FileText, MessageCircle, Star, Home, Globe, Shield, Award } from 'lucide-react';

// Import du logo
import logo from '../assets/images/logo.jpeg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isAdhesionHovered, setIsAdhesionHovered] = useState(false);
  const menuRef = useRef(null);
  
  const menuItems = [
    { 
      href: '/#accueil', 
      label: 'Accueil',
      icon: <Home className="w-4 h-4" />,
      path: '/'
    },
    { 
      href: '/#apropos',
      label: 'Mouvement',
      icon: <Users className="w-4 h-4" />,
      path: '/'
    },
    { 
      href: '/#vision', 
      label: 'Vision',
      icon: <Target className="w-4 h-4" />,
      path: '/'
    },
    { 
      href: '/#actualites', 
      label: 'Actualités',
      icon: <Star className="w-4 h-4" />,
      path: '/'
    },
    { 
      href: '/#textes',
      label: 'Textes Officiels',
      icon: <FileText className="w-4 h-4" />,
      path: '/'
    },
    { 
      href: '/#contact', 
      label: 'Contact',
      icon: <MessageCircle className="w-4 h-4" />,
      path: '/'
    },
    // Ajoutez ici d'autres pages si nécessaire
    // { 
    //   href: '/actualites', 
    //   label: 'Actualités',
    //   icon: <Newspaper className="w-4 h-4" />,
    //   path: '/actualites'
    // },
  ];

  // Fonction pour gérer la navigation et le scroll
  const handleNavigation = useCallback((item) => {
    // Si nous sommes déjà sur la page d'accueil et qu'on clique sur une section
    if (location.pathname === '/' && item.href.includes('#')) {
      // Fermer le menu mobile
      setIsOpen(false);
      
      // Scroll vers la section
      setTimeout(() => {
        const hash = item.href.split('#')[1];
        if (hash) {
          const element = document.getElementById(hash);
          if (element) {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveSection(hash);
          }
        }
      }, 100);
    } else {
      // Si on est sur une autre page, naviguer vers l'accueil avec le hash
      if (item.href.includes('#')) {
        navigate(item.href);
        setIsOpen(false);
        
        // Attendre que la page se charge puis scroll
        setTimeout(() => {
          const hash = item.href.split('#')[1];
          if (hash) {
            const element = document.getElementById(hash);
            if (element) {
              const yOffset = -80;
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }
        }, 500);
      } else {
        // Navigation normale vers une autre page
        navigate(item.path || item.href);
        setIsOpen(false);
      }
    }
  }, [location.pathname, navigate]);

  // Observer pour détecter la section active (uniquement sur la page d'accueil)
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0.3, 0.5, 0.7]
      }
    );

    // Observer seulement les sections qui existent
    menuItems.forEach(item => {
      if (item.href.includes('#')) {
        const hash = item.href.split('#')[1];
        const element = document.getElementById(hash);
        if (element) observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      
      // Effet de parallaxe subtil pour le logo
      if (scrollPosition < 200) {
        const scale = Math.max(0.95, 1 - (scrollPosition * 0.001));
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer) {
          logoContainer.style.transform = `scale(${scale})`;
          logoContainer.style.opacity = Math.max(0.8, 1 - (scrollPosition * 0.002));
        }
      }
    };
    
    const scrollHandler = () => requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  // Fermeture du menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setIsOpen(false);
      });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fonction pour le bouton Accueil
  const handleHomeClick = useCallback(() => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('accueil');
    } else {
      navigate('/');
    }
    setIsOpen(false);
  }, [location.pathname, navigate]);

  return (
    <nav 
      ref={menuRef}
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${
        scrolled 
          ? 'bg-[#003366]/95 backdrop-blur-xl shadow-2xl py-2 border-b border-[#0055AA]/30' 
          : 'bg-[#003366] py-4'
      }`}
      style={{
        background: scrolled 
          ? 'linear-gradient(135deg, rgba(0, 51, 102, 0.98) 0%, rgba(0, 68, 136, 0.98) 100%)'
          : 'linear-gradient(135deg, #003366 0%, #004488 100%)'
      }}
    >
      {/* Effet de particules subtiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#00AAFF]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo avec animations premium */}
          <button 
            onClick={handleHomeClick}
            className="flex items-center space-x-4 cursor-pointer group relative logo-container"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            aria-label="Retour à l'accueil"
          >
            {/* ... (le reste du code du logo reste identique) ... */}
            <div className={`absolute -inset-4 bg-gradient-to-r from-[#FFD700] via-[#FFAA00] to-[#FFD700] rounded-2xl opacity-0 blur-xl transition-all duration-1000 ${
              isLogoHovered ? 'opacity-20 scale-110' : ''
            }`}></div>
            
            <div className="relative">
              {isLogoHovered && (
                <>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD700] rounded-full animate-ping"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#00AAFF] rounded-full animate-ping animation-delay-300"></div>
                </>
              )}
              
              <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3 overflow-hidden border-2 border-[#FFD700]/30 group-hover:border-[#FFD700]">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1200"></div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 via-[#FFD700]/0 to-[#FFD700]/0 group-hover:from-[#FFD700]/10 group-hover:via-[#FFD700]/5 group-hover:to-[#FFD700]/10 transition-all duration-700"></div>
                
                <img 
                  src={logo} 
                  alt="Logo MPB - Mouvement Patriotique du Bénin"
                  className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#FFD700] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all duration-500"></div>
              </div>
            </div>
            
            <div className="hidden lg:block transform transition-all duration-700 group-hover:translate-x-2">
              <div className="text-white font-bold text-2xl leading-tight tracking-tight drop-shadow-lg">
                Mouvement Patriotique
              </div>
              <div className="text-[#FFD700] text-base font-semibold tracking-wider uppercase opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-2 mt-1">
                <span>du Bénin</span>
                {isLogoHovered && (
                  <Shield className="w-5 h-5 animate-bounce" />
                )}
              </div>
            </div>
          </button>

          {/* Menu Desktop Premium */}
          <div className="hidden lg:flex items-center space-x-3 ml-8">
            {menuItems.map((item, index) => {
              const hash = item.href.split('#')[1];
              const isActive = location.pathname === '/' 
                ? activeSection === hash 
                : location.pathname === item.path;
              
              return (
                <div 
                  key={item.label} 
                  className="relative" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`relative px-6 py-3 text-sm font-semibold transition-all duration-500 group overflow-hidden rounded-xl ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-[#0055AA]/40 to-[#004488]/40 shadow-inner border border-[#FFD700]/30' 
                        : 'text-[#CCDDFF] hover:text-white hover:bg-gradient-to-r hover:from-[#004488]/30 hover:to-[#003366]/30'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 via-[#00AAFF]/5 to-[#FFD700]/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-xl"></div>
                    
                    <div className="relative flex items-center gap-3 min-w-max">
                      <div className={`transition-all duration-500 transform group-hover:scale-125 ${
                        isActive ? 'text-[#FFD700]' : 'text-[#88AAFF] group-hover:text-[#FFD700]'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="tracking-wide drop-shadow-sm font-medium">{item.label}</span>
                    </div>
                    
                    {isActive && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] via-[#FFAA00] to-[#FFD700] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
                    )}
                    
                    <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r from-[#00AAFF] to-[#FFD700] group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-full"></div>
                  </button>
                </div>
              );
            })}
            
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#FFD700]/30 to-transparent mx-2"></div>
            
            {/* Bouton "Rejoindre le mouvement" */}
            <div 
              className="relative ml-2"
              onMouseEnter={() => setIsAdhesionHovered(true)}
              onMouseLeave={() => setIsAdhesionHovered(false)}
            >
              <div className={`absolute -inset-4 bg-gradient-to-r from-[#FFD700] via-[#FFAA00] to-[#FFD700] rounded-full blur-xl transition-all duration-700 ${
                isAdhesionHovered ? 'opacity-40 scale-110' : 'opacity-20'
              }`}></div>
              
              <Link
                to="/rejoindre"
                className="relative bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] px-9 py-4 rounded-full font-black tracking-wide shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all duration-500 flex items-center gap-3 group/btn overflow-hidden"
                style={{
                  backgroundSize: '200% 100%',
                  backgroundPosition: '0% 0%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundPosition = '100% 0%';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = '0% 0%';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1200"></div>
                </div>
                
                <Award className="relative w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-500" />
                <span className="relative text-lg drop-shadow-sm">Rejoindre</span>
                <ChevronRight 
                  size={20} 
                  className="relative group-hover/btn:translate-x-2 group-hover/btn:rotate-90 transition-all duration-500" 
                />
                
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse shadow-lg border-2 border-white">
                  <span className="animate-bounce">!</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Menu Mobile */}
          <div className="lg:hidden flex items-center">
            <div 
              className="relative mr-4"
              onMouseEnter={() => setIsAdhesionHovered(true)}
              onMouseLeave={() => setIsAdhesionHovered(false)}
            >
              <div className={`absolute -inset-4 bg-gradient-to-r from-[#FFD700] via-[#FFAA00] to-[#FFD700] rounded-full blur-xl transition-all duration-700 ${
                isAdhesionHovered ? 'opacity-30 scale-110' : 'opacity-15'
              }`}></div>
              
              <Link
                to="/rejoindre"
                className="relative bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] px-6 py-3 rounded-full font-bold tracking-wide shadow-xl hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all duration-500 flex items-center gap-2 group/btn-mobile overflow-hidden"
                style={{
                  backgroundSize: '200% 100%',
                  backgroundPosition: '0% 0%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundPosition = '100% 0%';
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = '0% 0%';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute -inset-5 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover/btn-mobile:translate-x-full transition-transform duration-1200"></div>
                </div>
                
                <Award className="relative w-5 h-5 group-hover/btn-mobile:rotate-12 transition-transform duration-500" />
                <span className="relative text-sm drop-shadow-sm">Rejoindre</span>
              </Link>
            </div>

            {/* Bouton menu hamburger */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 backdrop-blur-sm ${
                  isOpen 
                    ? 'bg-gradient-to-br from-[#FFD700] to-[#FFAA00] text-[#003366] shadow-[0_0_30px_rgba(255,215,0,0.5)]' 
                    : 'text-white bg-[#004488]/50 hover:bg-[#0055AA]/50 border border-[#FFD700]/30'
                }`}
                aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isOpen}
              >
                <div className="relative w-7 h-7">
                  <span className={`absolute top-1 left-0 w-7 h-0.5 bg-current rounded-full transition-all duration-700 ${
                    isOpen ? 'rotate-45 top-3 w-8 bg-[#003366]' : 'bg-white'
                  }`}></span>
                  <span className={`absolute top-3 left-0 w-7 h-0.5 bg-current rounded-full transition-all duration-700 ${
                    isOpen ? 'opacity-0 translate-x-4' : 'opacity-100 bg-white'
                  }`}></span>
                  <span className={`absolute top-5 left-0 w-7 h-0.5 bg-current rounded-full transition-all duration-700 ${
                    isOpen ? '-rotate-45 top-3 w-8 bg-[#003366]' : 'bg-white'
                  }`}></span>
                </div>
                
                {!isOpen && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-[#FFD700]/40 animate-ping opacity-0"></div>
                )}
              </button>
              
              {isOpen && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Mobile Premium */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-1000 ease-out ${
            isOpen 
              ? 'max-h-[800px] opacity-100 mt-8' 
              : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="bg-gradient-to-b from-[#003366] via-[#004488] to-[#003366] rounded-3xl shadow-2xl border border-[#FFD700]/30 p-8 backdrop-blur-2xl mx-2">
            <div className="flex items-center justify-between mb-10 pb-8 border-b border-[#FFD700]/20">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#FFD700]/50 shadow-lg">
                  <img 
                    src={logo} 
                    alt="Logo MPB"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-bold text-xl leading-snug">Mouvement Patriotique</div>
                  <div className="text-[#FFD700] text-sm font-semibold mt-1">Navigation Principale</div>
                </div>
              </div>
              <Globe className="w-8 h-8 text-[#FFD700]/60 animate-spin-slow" />
            </div>
            
            <div className="space-y-4 mb-10">
              {menuItems.map((item, index) => {
                const hash = item.href.split('#')[1];
                const isActive = location.pathname === '/' 
                  ? activeSection === hash 
                  : location.pathname === item.path;
                
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#003366] shadow-lg border border-[#FFD700]'
                        : 'text-white hover:bg-gradient-to-r hover:from-[#004488]/60 hover:to-[#003366]/60 hover:text-[#FFD700] border border-transparent hover:border-[#FFD700]/30'
                    }`}
                    style={{ 
                      animation: isOpen ? `slideInRight 0.7s ease-out ${index * 0.15}s both` : 'none'
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isActive 
                          ? 'bg-[#003366]/20' 
                          : 'bg-[#FFD700]/10 text-[#FFD700] group-hover:bg-[#FFD700]/20'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-semibold text-lg">{item.label}</span>
                    </div>
                    <ChevronRight 
                      size={20} 
                      className={`transition-all duration-500 ${
                        isActive 
                          ? 'text-[#003366] transform rotate-90' 
                          : 'text-[#88AAFF] group-hover:text-[#FFD700] group-hover:translate-x-2'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
            
            {/* Bouton "Rejoindre le mouvement" mobile */}
            <Link
              to="/rejoindre"
              onClick={() => setIsOpen(false)}
              className="w-full relative group"
              style={{ animation: isOpen ? 'scaleIn 0.8s ease-out 0.9s both' : 'none' }}
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-[#FFD700] via-[#FFAA00] to-[#FFD700] rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
              
              <div className="relative bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] px-8 py-6 rounded-2xl font-black text-lg text-center hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transform transition-all duration-700 group-hover:scale-105 flex items-center justify-center gap-4 overflow-hidden">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                </div>
                
                <Award className="w-7 h-7 group-hover:rotate-12 transition-transform duration-700" />
                <span className="text-xl drop-shadow-sm">Rejoindre le Mouvement</span>
                <ChevronRight 
                  size={24} 
                  className="group-hover:translate-x-3 group-hover:rotate-90 transition-all duration-700" 
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Styles d'animation (restent identiques) */}
      <style jsx>{`
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(40px) scale(0.95);
          }
          70% {
            opacity: 0.8;
            transform: translateX(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .logo-container::after {
          content: '';
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.8s ease;
          z-index: -1;
          border-radius: 20px;
          pointer-events: none;
        }
        
        .logo-container:hover::after {
          opacity: 1;
        }
      `}</style>
    </nav>
  );
};

export default React.memo(Navbar);