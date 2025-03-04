import React from 'react';
import { PropertyTypeOption } from './PropertyTypeOption';
import { usePropertyContext } from '../../../contexts/PropertyContext';
import type { PropertyType } from '../../../types/property';

export function PropertyTypeSelector() {
  const { propertyType, setPropertyType } = usePropertyContext();
  const propertyTypes: PropertyType[] = ['apartment', 'house', 'land', 'commercial'];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {propertyTypes.map((type) => (
        <PropertyTypeOption
          key={type}
          type={type}
          isSelected={propertyType === type}
          onSelect={() => setPropertyType(type)}
        />
      ))}
    </div>
  );
}