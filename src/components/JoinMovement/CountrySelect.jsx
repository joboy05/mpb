// components/JoinMovement/CountrySelect.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { countries, normalizeCountryName, findCountryByName } from '../../data/countries';

const CountrySelect = ({ value, onChange, onPhoneCodeChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const wrapperRef = useRef(null);

  // Initialiser une seule fois au montage
  useEffect(() => {
    if (!isInitialized) {
      let initialCountry;
      
      if (value && value.trim() !== '') {
        const normalized = normalizeCountryName(value);
        setInputValue(normalized);
        initialCountry = countries.find(c => c.name === normalized);
      } else {
        // Par défaut Bénin
        initialCountry = countries.find(c => c.name === "Bénin");
        setInputValue(initialCountry?.name || '');
      }
      
      if (initialCountry) {
        setSelectedCountry(initialCountry);
        onPhoneCodeChange(initialCountry.phone);
        if (!value) {
          onChange(initialCountry.name);
        }
      }
      
      setIsInitialized(true);
    }
  }, [value, onChange, onPhoneCodeChange, isInitialized]); // isInitialized dans les dépendances

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Ne pas réinitialiser si l'utilisateur supprime tout (on garde la valeur)
    if (value.trim() === '' && selectedCountry) {
      // Si l'utilisateur vide le champ, on garde le pays sélectionné
      return;
    }
    
    // Effacer le pays sélectionné si l'utilisateur modifie manuellement
    if (selectedCountry && selectedCountry.name !== value) {
      setSelectedCountry(null);
    }
    
    if (value.trim().length > 0) {
      const matches = findCountryByName(value);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    // Mettre à jour le parent
    onChange(value);
  };

  const handleSelectCountry = (country) => {
    const normalizedName = normalizeCountryName(country.name);
    setInputValue(normalizedName);
    setSelectedCountry(country);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Appeler les callbacks
    onChange(normalizedName);
    onPhoneCodeChange(country.phone);
  };

  const handleFocus = () => {
    if (inputValue.trim().length > 0) {
      const matches = findCountryByName(inputValue);
      setSuggestions(matches);
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      
      // Si le champ est vide, restaurer le pays sélectionné
      if (inputValue.trim() === '' && selectedCountry) {
        setInputValue(selectedCountry.name);
        onChange(selectedCountry.name);
        return;
      }
      
      // Normaliser la valeur quand on quitte le champ
      if (inputValue.trim() && !selectedCountry) {
        const normalized = normalizeCountryName(inputValue);
        setInputValue(normalized);
        onChange(normalized);
        
        // Chercher le pays correspondant
        const country = countries.find(c => 
          c.name.toLowerCase() === normalized.toLowerCase()
        );
        if (country) {
          setSelectedCountry(country);
          onPhoneCodeChange(country.phone);
        }
      }
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      // Si l'utilisateur efface tout, on laisse la possibilité de taper autre chose
      // Ne pas réinitialiser automatiquement
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedCountry(null);
    setSuggestions([]);
    setShowSuggestions(false);
    onChange('');
    onPhoneCodeChange('+229'); // Retour au code par défaut
  };

  return (
    <div className="group relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Pays
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Globe className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
          placeholder="Rechercher un pays..."
          required
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
          {inputValue && inputValue !== selectedCountry?.name && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Effacer"
            >
              ×
            </button>
          )}
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((country) => (
            <button
              key={country.code}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelectCountry(country)}
              onMouseDown={(e) => e.preventDefault()}
            >
              <span className="text-xl">{country.flag}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{country.name}</div>
                <div className="text-sm text-gray-500">{country.phone}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Indicateur de pays sélectionné */}
      {selectedCountry && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <span>Code téléphonique :</span>
          <span className="font-semibold text-[#003366]">{selectedCountry.phone}</span>
          <span className="text-xl ml-1">{selectedCountry.flag}</span>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;