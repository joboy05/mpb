// components/JoinMovement/BeninLocation.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Building, Home } from 'lucide-react';
import { beninDepartments, getCommunesByDepartment } from '../../data/benin-geo';

const BeninLocation = ({ 
  department, 
  commune, 
  onDepartmentChange, 
  onCommuneChange 
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(department || '');
  const [availableCommunes, setAvailableCommunes] = useState([]);

  // Mettre à jour les communes quand le département change
  useEffect(() => {
    if (selectedDepartment) {
      const communes = getCommunesByDepartment(selectedDepartment);
      setAvailableCommunes(communes);
      
      // Réinitialiser la commune si elle n'est pas dans le nouveau département
      if (commune && !communes.includes(commune)) {
        onCommuneChange('');
      }
    } else {
      setAvailableCommunes([]);
    }
  }, [selectedDepartment, commune, onCommuneChange]);

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    setSelectedDepartment(value);
    onDepartmentChange(value);
    onCommuneChange(''); // Réinitialiser la commune
  };

  const handleCommuneChange = (e) => {
    onCommuneChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="group">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Building className="w-4 h-4" />
          <span>Département</span>
        </label>
        <select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
          required
        >
          <option value="">Sélectionnez un département</option>
          {beninDepartments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {selectedDepartment && (
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>Commune</span>
          </label>
          <select
            value={commune || ''}
            onChange={handleCommuneChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent group-hover:border-[#003366]/50 transition-colors"
            required
          >
            <option value="">Sélectionnez une commune</option>
            {availableCommunes.map((communeName) => (
              <option key={communeName} value={communeName}>
                {communeName}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDepartment && commune && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#003366] mt-0.5" />
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Localisation :</span>{' '}
              {commune}, {selectedDepartment}, Bénin
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeninLocation;