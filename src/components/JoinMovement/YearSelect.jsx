// components/JoinMovement/YearSelect.jsx (nouveau composant)
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const YearSelect = ({ value, onChange, label = "Année de naissance", minAge = 18 }) => {
  const currentYear = new Date().getFullYear();
  const maxBirthYear = currentYear - minAge;
  
  // Générer les années de naissance valides
  const generateValidYears = () => {
    const years = [];
    for (let year = maxBirthYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  const validYears = generateValidYears();
  const [localValue, setLocalValue] = useState(value || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (value && value !== localValue) {
      setLocalValue(value);
    }
  }, [value, localValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setError('');

    if (newValue) {
      const year = parseInt(newValue);
      const age = currentYear - year;
      
      if (year < 1900 || year > maxBirthYear) {
        setError(`L'année doit être entre 1900 et ${maxBirthYear}`);
        onChange(''); // Ne pas valider
      } else if (age < minAge) {
        setError(`Vous devez avoir au moins ${minAge} ans`);
        onChange(''); // Ne pas valider
      } else {
        onChange(newValue); // Valider
      }
    } else {
      onChange(''); // Champ vide
    }
  };

  const handleManualInput = (e) => {
    const input = e.target.value;
    // N'autoriser que les chiffres
    if (/^\d*$/.test(input) || input === '') {
      setLocalValue(input);
      
      if (input.length === 4) {
        const year = parseInt(input);
        const age = currentYear - year;
        
        if (year < 1900 || year > maxBirthYear) {
          setError(`L'année doit être entre 1900 et ${maxBirthYear}`);
          onChange('');
        } else if (age < minAge) {
          setError(`Vous devez avoir au moins ${minAge} ans`);
          onChange('');
        } else {
          setError('');
          onChange(input);
        }
      } else if (input.length > 4) {
        setError('Une année contient 4 chiffres');
        onChange('');
      } else {
        setError('');
        onChange('');
      }
    }
  };

  const getAge = () => {
    if (!localValue || localValue.length !== 4) return null;
    const year = parseInt(localValue);
    if (isNaN(year)) return null;
    return currentYear - year;
  };

  const age = getAge();

  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>{label}</span>
        <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
          {minAge}+ ans uniquement
        </span>
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        {/* Sélecteur déroulant */}
        <div className="col-span-2">
          <div className="relative">
            <select
              value={localValue}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors appearance-none"
              required
            >
              <option value="">Choisir une année...</option>
              {validYears.map(year => {
                const age = currentYear - year;
                return (
                  <option key={year} value={year}>
                    {year} ({age} ans)
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Saisie manuelle */}
        <div>
          <input
            type="text"
            value={localValue}
            onChange={handleManualInput}
            placeholder="AAAA"
            maxLength="4"
            pattern="\d{4}"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent text-center"
          />
          <div className="text-xs text-gray-500 text-center mt-1">ou tapez AAAA</div>
        </div>
      </div>
      
      {/* Affichage de l'erreur */}
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          ⚠️ {error}
        </div>
      )}
      
      {/* Affichage de l'âge */}
      {age && age >= minAge && (
        <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Âge : </span>
              <span className={`text-lg font-bold ${age < 25 ? 'text-yellow-600' : 'text-[#003366]'}`}>
                {age} ans
              </span>
            </div>
            <div className="text-right">
              {age < 25 ? (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Jeune
                </span>
              ) : age < 40 ? (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Adulte
                </span>
              ) : (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  Senior
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            {age === minAge ? (
              "Vous avez exactement l'âge minimum requis !"
            ) : age < 25 ? (
              "Vous faites partie de notre jeunesse dynamique !"
            ) : (
              "Votre expérience est précieuse pour notre mouvement."
            )}
          </div>
        </div>
      )}
      
      {/* Info sur l'âge minimum */}
      <div className="mt-2 text-xs text-gray-500">
        Seules les personnes de {minAge} ans et plus peuvent s'inscrire.
        Le plus jeune né accepté est en {maxBirthYear}.
      </div>
    </div>
  );
};

export default YearSelect;