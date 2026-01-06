import React, { useEffect, useRef, useState } from 'react';
import { Star, Quote, User } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "ATCHAOUE Fabrice Marien Mahugnon",
      role: "Médecin",
      content: "Professionnel de santé engagé, je crois que le patriotisme passe aussi par le service et la responsabilité. J'adhère au Mouvement Patriotique du Bénin pour défendre les valeurs de discipline, de loyauté et d'intégrité.",
      rating: 5,
      location: "Mali"
    },
    {
      id: 2,
      name: "Ivan Kokoye",
      role: "Trucker",
      content: "Depuis la diaspora, je reste engagé pour mon pays. Je soutiens le Mouvement Patriotique du Bénin à travers la mobilisation et la communication au service de la nation.",
      rating: 5,
      location: "Philadelphia, États-Unis"
    },
    {
      id: 3,
      name: "BODJRENOU Antoine",
      role: "Vitrier Ébéniste",
      content: "Artisan de métier, je crois au travail, à la discipline et à l'engagement local. Mon adhésion au Mouvement Patriotique du Bénin traduit mon attachement aux valeurs citoyennes et au développement de ma communauté.",
      rating: 5,
      location: "Dangbo, Bénin"
    },
    {
      id: 4,
      name: "Armand THOO",
      role: "Technicien",
      content: "Membre de la diaspora, je reste profondément attaché au Bénin. Mon engagement au sein du Mouvement Patriotique du Bénin est guidé par le patriotisme, la discipline et l'intégrité.",
      rating: 5,
      location: "Montréal, Canada"
    },
    {
      id: 5,
      name: "MAMA Fayçal",
      role: "Étudiant",
      content: "Étudiant engagé, je crois au rôle central de la jeunesse dans l'avenir du Bénin. J'ai rejoint le Mouvement Patriotique du Bénin pour défendre l'éducation et la conscience citoyenne.",
      rating: 5,
      location: "Parakou, Bénin"
    },
    {
      id: 6,
      name: "MEHINTO Coovi Sylvestre",
      role: "Restaurateur & Commerçant",
      content: "Acteur économique local, je m'engage pour un Bénin responsable et solidaire. Le Mouvement Patriotique du Bénin incarne pour moi la discipline et l'engagement citoyen.",
      rating: 5,
      location: "Pahou, Bénin"
    },
    {
      id: 7,
      name: "KOWE Damien",
      role: "Contrôleur de gestion",
      content: "Depuis la diaspora, je mets mes compétences au service du développement du Bénin. Transparence, rigueur et patriotisme guident mon engagement.",
      rating: 5,
      location: "Lyon, France"
    },
    {
      id: 8,
      name: "ABIOLA Babatoundé Adeniran Harim Dine",
      role: "Financier & Comptable",
      content: "Convaincu que l'économie est un levier de souveraineté, je soutiens un Bénin fondé sur l'intégrité. Mon engagement est au service de la nation.",
      rating: 5,
      location: "Savè, Bénin"
    },
    {
      id: 9,
      name: "WABI Holaiwola Faisol",
      role: "Délégué médical",
      content: "La distance n'efface pas l'amour de la patrie. Je m'engage pour la mobilisation et la communication au service du Bénin.",
      rating: 5,
      location: "Pointe-Noire, Congo-Brazzaville"
    },
    {
      id: 10,
      name: "HONZOUNNON K. B. Romulus",
      role: "Professeur",
      content: "Éduquer, c'est former des citoyens responsables. Je m'engage pour la transmission des valeurs patriotiques aux jeunes générations.",
      rating: 5,
      location: "Ouidah, Bénin"
    },
    {
      id: 11,
      name: "OKE Mohamed Ali",
      role: "Agent CLCAM",
      content: "Le développement local commence par l'engagement citoyen. Je soutiens un Bénin discipliné, loyal et intègre.",
      rating: 5,
      location: "Abomey-Calavi, Bénin"
    },
    {
      id: 12,
      name: "ZAKARI Alassane",
      role: "Étudiant",
      content: "Jeunesse, patriotisme et responsabilité guident mon engagement. Je crois en un Bénin fort, uni et conscient.",
      rating: 5,
      location: "Bembéréké, Bénin"
    }
  ];

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [centerIndex, setCenterIndex] = useState(0);
  const animationRef = useRef(null);
  const isUserInteracting = useRef(false);
  const lastInteractionTime = useRef(Date.now());

  // Dupliquer les témoignages pour le scroll infini
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials];

  // Calculer l'index central
  const updateCenterIndex = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const centerPosition = scrollLeft + containerWidth / 2;
    
    const cards = container.querySelectorAll('.testimonial-card');
    let closestIndex = 0;
    let minDistance = Infinity;
    
    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(centerPosition - cardCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index % testimonials.length;
      }
    });
    
    setCenterIndex(closestIndex);
  };

  // Gestion du scroll infini
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const sectionWidth = scrollWidth / 5;
    
    // Réinitialiser la position si on atteint les bords (scroll infini)
    // Mais seulement si l'utilisateur n'est pas en train d'interagir
    if (!isUserInteracting.current) {
      if (scrollLeft <= sectionWidth * 0.5) {
        container.scrollLeft = sectionWidth * 2.5;
      } else if (scrollLeft >= sectionWidth * 4.5) {
        container.scrollLeft = sectionWidth * 2.5;
      }
    }
    
    updateCenterIndex();
  };

  // Défilement automatique continu
  useEffect(() => {
    const autoScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const timeSinceInteraction = Date.now() - lastInteractionTime.current;
      
      // Défilement automatique si pas d'interaction depuis 2 secondes
      if (!isDragging && timeSinceInteraction > 2000) {
        scrollContainerRef.current.scrollLeft += 1;
      }
      
      animationRef.current = requestAnimationFrame(autoScroll);
    };
    
    animationRef.current = requestAnimationFrame(autoScroll);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging]);

  // Initialiser la position au centre
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const sectionWidth = scrollWidth / 5;
      container.scrollLeft = sectionWidth * 2.5;
      updateCenterIndex();
    }
  }, []);

  // Gestion du drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    isUserInteracting.current = true;
    setStartX(e.pageX);
    setScrollStart(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
    lastInteractionTime.current = Date.now();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (startX - x) * 2; // Augmenté pour plus de sensibilité
    scrollContainerRef.current.scrollLeft = scrollStart + walk;
    lastInteractionTime.current = Date.now();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isUserInteracting.current = false;
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = 'auto';
    lastInteractionTime.current = Date.now();
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    isUserInteracting.current = true;
    setStartX(e.touches[0].pageX);
    setScrollStart(scrollContainerRef.current.scrollLeft);
    lastInteractionTime.current = Date.now();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX;
    const walk = (startX - x) * 2.5; // Augmenté pour mobile
    scrollContainerRef.current.scrollLeft = scrollStart + walk;
    lastInteractionTime.current = Date.now();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    isUserInteracting.current = false;
    lastInteractionTime.current = Date.now();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5 justify-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-3.5 h-3.5 ${
              index < rating ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const isCardCentered = (testimonialId) => {
    return testimonials[centerIndex]?.id === testimonialId;
  };

  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#FFD700]"></div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#FFD700]" />
              <div className="text-sm font-semibold text-[#003366] uppercase tracking-wider">
                La parole aux membres
              </div>
              <Star className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#FFD700]"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6">
            Ils témoignent
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les expériences de nos membres à travers le Bénin et la diaspora
          </p>
        </div>

        {/* Zone du carrousel */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'auto'
            }}
          >
            <div className="flex gap-4 px-4 py-8">
              {extendedTestimonials.map((testimonial, index) => {
                const isCentered = isCardCentered(testimonial.id);
                
                return (
                  <div 
                    key={`${testimonial.id}-${index}`}
                    className={`testimonial-card flex-shrink-0 transition-all duration-300 ease-out ${
                      isCentered 
                        ? 'scale-105 z-10' 
                        : 'scale-90 opacity-60'
                    }`}
                    style={{ 
                      width: 'clamp(260px, 75vw, 350px)',
                      pointerEvents: isDragging ? 'none' : 'auto'
                    }}
                  >
                    <div className={`bg-white rounded-xl shadow-lg p-5 border h-full transition-all duration-500 ${
                      isCentered 
                        ? 'border-[#FFD700] shadow-2xl shadow-[#FFD700]/20' 
                        : 'border-gray-200'
                    }`}>
                      <div className="mb-3">
                        <Quote className={`w-7 h-7 mb-2 transition-colors duration-500 ${
                          isCentered ? 'text-[#FFD700]' : 'text-[#003366]/20'
                        }`} />
                        <p className="text-gray-600 italic leading-relaxed text-xs sm:text-sm line-clamp-4">
                          "{testimonial.content}"
                        </p>
                      </div>
                      
                      <div className="mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-all duration-500 ${
                          isCentered 
                            ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-lg' 
                            : 'bg-gradient-to-br from-[#003366] to-[#0055AA]'
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-[#003366] text-sm truncate">{testimonial.name}</div>
                          <div className="text-xs text-gray-600 truncate">{testimonial.role}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-500 ${
                              isCentered ? 'bg-[#FFD700]' : 'bg-gray-400'
                            }`}></span>
                            <span className="truncate">{testimonial.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gradients de fade */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-20"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-20"></div>
        </div>

        {/* Indicateur de swipe */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 text-gray-500 text-sm">
            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Glissez pour découvrir plus de témoignages</span>
            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Indicateurs de position */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === centerIndex
                  ? 'w-8 bg-[#FFD700]'
                  : 'w-2 bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;