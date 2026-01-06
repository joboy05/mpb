// InfoSection.jsx
import React from 'react';

const InfoSection = () => {
  return (
    <div className="mt-16 text-center">
      <div className="inline-block bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 shadow-sm">
        <p className="text-gray-700">
          <span className="font-semibold text-[#003366]">🎁 Bonus :</span>{' '}
          Tous les nouveaux membres reçoivent un kit de bienvenue digital avec nos documents fondateurs
        </p>
      </div>
    </div>
  );
};

// Assurez-vous que c'est exporté par défaut
export default InfoSection;