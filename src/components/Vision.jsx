import React from 'react';
import { ChevronRight } from 'lucide-react';

const Vision = () => {
  return (
    
    <section id="vision" className="py-20 px-4 bg-gradient-to-br from-yellow-400 to-yellow-500">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Horizon 2031</h2>
        <p className="text-2xl md:text-3xl text-blue-900 font-semibold mb-8">
          Former 40 000 leaders citoyens
        </p>
        <p className="text-lg text-blue-800 max-w-3xl mx-auto mb-8">
          À l'horizon 2031, le MPB ambitionne de pérenniser ses actions sur l'ensemble du territoire national, 
          de s'implanter dans tous les pays où se trouve la diaspora béninoise et de devenir une référence 
          africaine en leadership citoyen et en engagement patriotique.
        </p>
        <a 
          href="https://docs.google.com/forms/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition"
        >
          Rejoignez le mouvement
          <ChevronRight size={24} />
        </a>
      </div>
    </section>
  );
};

export default Vision;