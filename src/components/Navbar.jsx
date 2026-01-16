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
  const [isJoinHovered, setIsJoinHovered] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
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
  ];

  const handleNavigation = useCallback((item) => {
    if (location.pathname === '/' && item.href.includes('#')) {
      setIsOpen(false);
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
      if (item.href.includes('#')) {
        navigate(item.href);
        setIsOpen(false);
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
        navigate(item.path || item.href);
        setIsOpen(false);
      }
    }
  }, [location.pathname, navigate]);

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

    menuItems.forEach(item => {
      if (item.href.includes('#')) {
        const hash = item.href.split('#')[1];
        const element = document.getElementById(hash);
        if (element) observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      
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

  // Gestion de l'overflow du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Forcer le mobile menu en premier plan
      if (mobileMenuRef.current) {
        mobileMenuRef.current.style.zIndex = '9999';
      }
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Fermeture du menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleHomeClick = useCallback(() => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('accueil');
    } else {
      navigate('/');
    }
    setIsOpen(false);
  }, [location.pathname, navigate]);

  // SVG personnalisé pour le bouton "Rejoindre"
  const JoinIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
      className="w-6 h-6"
    >
      <path 
        fill="none" 
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeWidth="2" 
        d="M15 12h3m0 0h3m-3 0v3m0-3V9M3 19v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1M12 8a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"
      />
    </svg>
  );

  // Vérifier si on est sur la page d'accueil
  const isHomePage = location.pathname === '/';

  return (
    <nav 
      ref={menuRef}
      className={`fixed top-0 w-full z-40 transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] py-2 shadow-xl' 
          : 'bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] py-3'
      }`}
    >
      {/* Élément de décor minimaliste */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent"></div>
        <div className="absolute top-1/2 right-0 w-16 h-16 bg-[#00AAFF]/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <button 
            onClick={handleHomeClick}
            className="flex items-center space-x-3 cursor-pointer group relative logo-container"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            aria-label="Retour à l'accueil"
          >
            <div className="relative">
              <div className="relative w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-500 transform group-hover:scale-105 overflow-hidden border border-[#FFD700]/30 group-hover:border-[#FFD700]">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-800"></div>
                
                <img 
                  src={logo} 
                  alt="Logo MPB - Mouvement Patriotique du Bénin"
                  className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="text-white font-bold text-xl leading-tight tracking-tight">
                Mouvement Patriotique
              </div>
              <div className="text-[#FFD700] text-sm font-medium tracking-wide uppercase opacity-90 group-hover:opacity-100 transition-opacity mt-0.5">
                du Bénin
              </div>
            </div>
          </button>

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center space-x-1 ml-8">
            {menuItems.map((item, index) => {
              const hash = item.href.split('#')[1];
              const isActive = isHomePage 
                ? activeSection === hash 
                : location.pathname === item.path;
              
              return (
                <div 
                  key={item.label} 
                  className="relative"
                >
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-300 group rounded-lg ${
                      isActive 
                        ? 'text-white bg-white/10 shadow-inner' 
                        : 'text-white/90 hover:text-white hover:bg-white/5'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="relative flex items-center gap-2">
                      <div className={`transition-all duration-300 ${
                        isActive ? 'text-[#FFD700]' : 'text-white/70 group-hover:text-[#FFD700]'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="tracking-wide">{item.label}</span>
                    </div>
                    
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#FFD700] rounded-full shadow-[0_0_8px_rgba(255,215,0,0.5)]"></div>
                    )}
                  </button>
                </div>
              );
            })}
            
            <div className="w-px h-6 bg-white/20 mx-2"></div>
            
            {/* Bouton "Rejoindre le mouvement" - Version Desktop (Texte) */}
            <div 
              className="relative"
              onMouseEnter={() => setIsJoinHovered(true)}
              onMouseLeave={() => setIsJoinHovered(false)}
            >
              <Link
                to="/rejoindre"
                className="relative bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] px-5 py-3 rounded-xl font-bold shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 flex items-center justify-center group/btn overflow-hidden min-w-[150px]"
                title="Rejoindre le Mouvement"
                aria-label="Rejoindre le Mouvement"
              >
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-800"></div>
                </div>
                
                <div className="relative flex items-center space-x-2">
                  <span className="font-bold text-sm sm:text-base tracking-wide">Se connecter</span>
                </div>
                
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-md border border-white">
                  <span className="animate-bounce">!</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile/Tablette: Bouton Rejoindre (Icône) + Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Bouton Rejoindre Mobile - Version Icône (Visible seulement sur mobile/tablette) */}
            <div className="relative">
              <Link
                to="/rejoindre"
                className="relative bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] w-12 h-12 rounded-xl font-bold shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300 flex items-center justify-center overflow-hidden"
                title="Rejoindre le Mouvement"
                aria-label="Rejoindre le Mouvement"
              >
                <div className="relative w-5 h-5">
                  <JoinIcon />
                </div>
              </Link>
            </div>

            {/* Bouton menu hamburger */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isOpen 
                    ? 'bg-gradient-to-br from-[#FFD700] to-[#FFAA00] text-[#003366] shadow-lg' 
                    : 'text-white bg-white/10 hover:bg-white/15'
                }`}
                aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isOpen}
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    isOpen ? 'rotate-45 top-2 w-7 bg-[#003366]' : 'bg-white'
                  }`}></span>
                  <span className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    isOpen ? 'opacity-0 translate-x-3' : 'opacity-100 bg-white'
                  }`}></span>
                  <span className={`absolute top-4 left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    isOpen ? '-rotate-45 top-2 w-7 bg-[#003366]' : 'bg-white'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay de fond */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible z-50' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Mobile Premium - Glisse depuis la droite */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-[320px] z-[9999] transition-all duration-400 ease-out transform lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          maxHeight: '100vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain'
        }}
      >
        <div className="h-full bg-gradient-to-b from-[#003366] to-[#002244] shadow-2xl border-l border-[#FFD700]/20 relative flex flex-col">
          {/* En-tête du menu mobile */}
          <div className="p-6 border-b border-[#FFD700]/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#FFD700]/30 shadow-md">
                  <img 
                    src={logo} 
                    alt="Logo MPB"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">MPB</div>
                  <div className="text-[#FFD700] text-sm font-medium">Menu</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Items du menu - Conteneur scrollable */}
          <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <div className="space-y-2">
              {menuItems.map((item) => {
                const hash = item.href.split('#')[1];
                const isActive = isHomePage 
                  ? activeSection === hash 
                  : location.pathname === item.path;
                
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFAA00]/20 text-white border border-[#FFD700]/40'
                        : 'text-white/90 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-br from-[#FFD700] to-[#FFAA00] text-[#003366]' 
                        : 'bg-white/10 text-white/70'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-base">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Section supplémentaire */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="space-y-3">
                <Link
                  to="/faq"
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">FAQ</span>
                </Link>
                
                <Link
                  to="/medias"
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Médias</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Bouton "Rejoindre" en bas (version texte pour le menu mobile) */}
          <div className="p-6 border-t border-[#FFD700]/20 flex-shrink-0">
            <Link
              to="/rejoindre"
              onClick={() => setIsOpen(false)}
              className="w-full relative group"
            >
              <div className="relative bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] px-6 py-4 rounded-xl font-bold text-center hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden">
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                
                <div className="w-5 h-5">
                  <JoinIcon />
                </div>
                <span className="text-lg font-bold">Rejoindre le Mouvement</span>
              </div>
            </Link>
            
            {/* Copyright */}
            <div className="mt-4 text-center">
              <p className="text-white/60 text-xs">© {new Date().getFullYear()} MPB</p>
              <p className="text-[#FFD700]/60 text-xs mt-1">Mouvement Patriotique du Bénin</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);