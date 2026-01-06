// Footer.jsx - Version simplifiée
import React from 'react';
import { Facebook, Instagram, Youtube, Heart } from 'lucide-react';

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
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition">
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