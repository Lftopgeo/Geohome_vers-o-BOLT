import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  User, 
  Home, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ChevronRight 
} from 'lucide-react';
import type { InspectionSummary } from '../../types/dashboard';

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

  // Definir status
  const statusConfig = {
    pending: {
      label: 'Pendente',
      icon: <Clock size={16} className="text-orange-500" />,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    in_progress: {
      label: 'Em andamento',
      icon: <Loader2 size={16} className="text-blue-500 animate-spin" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    completed: {
      label: 'Concluída',
      icon: <CheckCircle size={16} className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    cancelled: {
      label: 'Cancelada',
      icon: <AlertCircle size={16} className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  };

  const status = statusConfig[inspection.status];

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </span>
            <span className="ml-2 text-xs text-gray-500">
              Protocolo: {inspection.protocol}
            </span>
          </div>
          
          <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-1">
            {inspection.address}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2 text-gray-400" />
              {formattedDate}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User size={16} className="mr-2 text-gray-400" />
              {inspection.clientName}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Home size={16} className="mr-2 text-gray-400" />
              {inspection.propertyType}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-2 text-gray-400" />
              {inspection.inspectorName}
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 md:ml-4 flex justify-end">
          <Link
            to={`/vistoria/${inspection.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDA76A]"
          >
            Ver detalhes
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
