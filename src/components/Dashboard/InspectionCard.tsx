import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  User, 
  Home, 
  ChevronRight 
} from 'lucide-react';
import type { InspectionSummary } from '../../types/dashboard';
import { StatusBadge } from './StatusBadge';

interface InspectionCardProps {
  inspection: InspectionSummary;
}

export function InspectionCard({ inspection }: InspectionCardProps) {
  // Formatar data
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(inspection.date);

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <StatusBadge status={inspection.status} size="sm" />
            <span className="ml-2 text-xs text-gray-500">
              Protocolo: {inspection.protocol}
            </span>
          </div>
          
          <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-1">
            {inspection.address}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            <div className="flex items-center text-sm text-gray-600" aria-label="Data e hora da vistoria">
              <Calendar size={16} className="mr-2 text-gray-400 flex-shrink-0" aria-hidden="true" />
              {formattedDate}
            </div>
            <div className="flex items-center text-sm text-gray-600" aria-label="Nome do cliente">
              <User size={16} className="mr-2 text-gray-400 flex-shrink-0" aria-hidden="true" />
              {inspection.clientName}
            </div>
            <div className="flex items-center text-sm text-gray-600" aria-label="Tipo de imóvel">
              <Home size={16} className="mr-2 text-gray-400 flex-shrink-0" aria-hidden="true" />
              {inspection.propertyType}
            </div>
            <div className="flex items-center text-sm text-gray-600" aria-label="Nome do inspetor">
              <MapPin size={16} className="mr-2 text-gray-400 flex-shrink-0" aria-hidden="true" />
              {inspection.inspectorName}
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 md:ml-4 flex justify-end">
          <Link
            to={`/vistoria/${inspection.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDA76A] transition-colors"
            aria-label={`Ver detalhes da vistoria em ${inspection.address}`}
          >
            Ver detalhes
            <ChevronRight size={16} className="ml-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
