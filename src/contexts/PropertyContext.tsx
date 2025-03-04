import React, { createContext, useContext, useState } from 'react';
import type { PropertyType } from '../types/property';

interface PropertyContextType {
  propertyType: PropertyType | null;
  setPropertyType: (type: PropertyType | null) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);

  return (
    <PropertyContext.Provider value={{ propertyType, setPropertyType }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
}
