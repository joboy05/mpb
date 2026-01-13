// Footer.jsx - Version avec liens réseaux sociaux officiels du MPB
import React from 'react';
import { Instagram, Youtube } from 'lucide-react';

// Import Twitter/X icon depuis lucide-react
const TwitterX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Import TikTok icon
const TikTok = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-yellow-400">MPB</h3>
            <p className="text-blue-200 text-sm">
              Mouvement Patriotique du Bénin - Préparer la relève pour un Bénin fort, juste et prospère.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-yellow-400">Le Mouvement</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#mouvement" className="hover:text-yellow-400 transition">Notre Histoire</a></li>
              <li><a href="#vision" className="hover:text-yellow-400 transition">Vision 2031</a></li>
              <li><a href="#valeurs" className="hover:text-yellow-400 transition">Nos Valeurs Fondamentales</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-yellow-400">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#actualites" className="hover:text-yellow-400 transition">Actualités</a></li>
              <li><a href="#documents" className="hover:text-yellow-400 transition">Documents</a></li>
              <li><a href="#contact" className="hover:text-yellow-400 transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-yellow-400">Réseaux sociaux</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/mpb_229/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition"
                aria-label="Instagram MPB"
              >
                <Instagram size={20} />
              </a>
              
              <a 
                href="https://x.com/mpb_officiel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition"
                aria-label="Twitter/X MPB"
              >
                <TwitterX />
              </a>
              
              <a 
                href="https://www.tiktok.com/@mpb_officiel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition"
                aria-label="TikTok MPB"
              >
                <TikTok />
              </a>
              
              <a 
                href="#youtube" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition"
                aria-label="YouTube MPB"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-8 text-center text-sm text-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2025 Mouvement Patriotique du Bénin. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;