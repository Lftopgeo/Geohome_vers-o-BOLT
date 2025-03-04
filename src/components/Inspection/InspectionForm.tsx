import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyDetails } from './PropertyDetails';
import { OwnerDetails } from './OwnerDetails';
import { InspectionDetails } from './InspectionDetails';

export function InspectionForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulando a criação de uma inspeção e obtenção de um ID
      // Em um cenário real, isso seria uma chamada à API
      const mockInspectionId = `insp-${Date.now()}`;
      
      // Navegar para a página de áreas de vistoria com o ID da inspeção
      navigate(`/areas-vistoria/${mockInspectionId}`);
    } catch (error) {
      console.error('Erro ao criar inspeção:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PropertyDetails />
      <OwnerDetails />
      <InspectionDetails />
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#DDA76A] text-white rounded-lg font-semibold hover:bg-[#c89355] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processando...' : 'Continuar'}
        </button>
      </div>
    </form>
  );
}