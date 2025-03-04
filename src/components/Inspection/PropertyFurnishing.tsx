import React from 'react';
import { usePropertyContext } from '../../contexts/PropertyContext';

export function PropertyFurnishing() {
  // Usar o contexto com verificação de disponibilidade
  const propertyContext = usePropertyContext();
  const propertyType = propertyContext?.propertyType || '';
  
  // Opções de mobília
  const furnishingOptions = [
    { label: 'Mobiliado', value: 'Furnished' },
    { label: 'Semi-mobiliado', value: 'SemiFurnished' },
    { label: 'Não mobiliado', value: 'Unfurnished' }
  ];
  
  // Não mostrar opções de mobília para terrenos
  if (propertyType === 'land') {
    return null;
  }
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Mobília
      </label>
      <div className="space-y-2">
        {furnishingOptions.map(option => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`furnishing-${option.value}`}
              name="furnishing"
              value={option.value.toLowerCase()}
              className="text-[#DDA76A] focus:ring-[#DDA76A]"
              // Removido o atributo required para evitar problemas quando o componente não é renderizado
            />
            <label htmlFor={`furnishing-${option.value}`} className="ml-2 text-sm">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}