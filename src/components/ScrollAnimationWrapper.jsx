// ScrollAnimationWrapper.jsx - VERSION OPTIMISÉE
import React, { useEffect, useRef, useState } from 'react';

const ScrollAnimationWrapper = ({ 
  children, 
  delay = 0, 
  className = '',
  threshold = 0.2, // Augmenté de 0.1 à 0.2
  duration = 500, // Réduit de 700 à 500
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  distance = 20, // Distance réduite
  once = true // Animation une seule fois
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Configuration des animations par direction
  const getTransformClass = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return 'translate-y-6 opacity-0';
        case 'down': return '-translate-y-6 opacity-0';
        case 'left': return 'translate-x-6 opacity-0';
        case 'right': return '-translate-x-6 opacity-0';
        case 'scale': return 'scale-95 opacity-0';
        case 'none': return 'opacity-0';
        default: return 'translate-y-6 opacity-0';
      }
    }
    
    switch (direction) {
      case 'up':
      case 'down': return 'translate-y-0 opacity-100';
      case 'left':
      case 'right': return 'translate-x-0 opacity-100';
      case 'scale': return 'scale-100 opacity-100';
      case 'none': return 'opacity-100';
      default: return 'translate-y-0 opacity-100';
    }
  };

  useEffect(() => {
    if (once && hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animation immédiate sur mobile, avec délai sur desktop
          const isMobile = window.innerWidth < 768;
          const actualDelay = isMobile ? Math.min(delay, 100) : delay;
          
          setTimeout(() => {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }, actualDelay);
          
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '50px', // Déclenchement plus tôt
        threshold: threshold
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, threshold, once, hasAnimated]);

  return (
    <div
      ref={ref}
      className={`transition-all ${className} ${
        duration === 300 ? 'duration-300' :
        duration === 500 ? 'duration-500' :
        duration === 700 ? 'duration-700' :
        'duration-500'
      } ease-out ${getTransformClass()}`}
      style={{
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity' // Optimisation performance
      }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimationWrapper;