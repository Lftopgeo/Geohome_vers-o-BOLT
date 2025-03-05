import { useEffect, useRef, useState } from 'react';
import { Building } from 'lucide-react';
import type { InspectionSummary } from '../../types/dashboard';
import './InspectionMap.css';

interface InspectionMapProps {
  inspections: InspectionSummary[];
  height?: number;
  isLoading?: boolean;
}

// Tipo para as coordenadas de geolocalização
interface GeoLocation {
  lat: number;
  lng: number;
}

// Tipo para inspeção com coordenadas
interface InspectionWithLocation extends InspectionSummary {
  location: GeoLocation;
}

export function InspectionMapBasic({ 
  inspections, 
  height = 400,
  isLoading = false
}: InspectionMapProps) {
  const [inspectionsWithLocation, setInspectionsWithLocation] = useState<InspectionWithLocation[]>([]);
  const [mapCenter] = useState<GeoLocation>({ lat: -23.5505, lng: -46.6333 }); // São Paulo como padrão
  const mapRef = useRef<HTMLDivElement>(null);

  // Simular a obtenção de coordenadas para as inspeções
  useEffect(() => {
    if (inspections.length === 0) return;

    // Função para simular coordenadas baseadas no endereço
    const getSimulatedCoordinates = (address: string): GeoLocation => {
      // Gerar coordenadas aleatórias próximas ao centro do mapa
      const randomLat = mapCenter.lat + (Math.random() - 0.5) * 0.1;
      const randomLng = mapCenter.lng + (Math.random() - 0.5) * 0.1;
      
      return {
        lat: randomLat,
        lng: randomLng
      };
    };

    // Adicionar coordenadas simuladas às inspeções
    const inspectionsWithCoordinates = inspections.map(inspection => ({
      ...inspection,
      location: getSimulatedCoordinates(inspection.address)
    }));

    setInspectionsWithLocation(inspectionsWithCoordinates);
  }, [inspections, mapCenter]);

  // Função para obter a classe CSS do status
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in_progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em andamento';
      default:
        return 'Pendente';
    }
  };

  if (isLoading) {
    return (
      <div 
        className="map-loading" 
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-500">Carregando mapa de vistorias...</div>
      </div>
    );
  }

  if (inspectionsWithLocation.length === 0) {
    return (
      <div 
        className="map-empty" 
        style={{ height: `${height}px` }}
      >
        <Building size={48} className="mb-2 text-gray-400" />
        <div>Nenhuma vistoria com localização disponível</div>
      </div>
    );
  }

  return (
    <div className="map-container" style={{ height: `${height}px` }}>
      <div 
        ref={mapRef} 
        className="bg-gray-100 h-full w-full p-4 rounded-lg"
      >
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">Mapa de Vistorias</h3>
          <p className="text-sm text-gray-500">Visualização temporária - Leaflet não disponível</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inspectionsWithLocation.map(inspection => (
            <div 
              key={inspection.id} 
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
            >
              <h4 className="font-medium">{inspection.propertyType}</h4>
              <p className="text-sm text-gray-600 mb-2">{inspection.address}</p>
              <div className="flex justify-between items-center">
                <span className={`status-badge ${getStatusClass(inspection.status)}`}>
                  {getStatusText(inspection.status)}
                </span>
                <span className="text-xs text-gray-500">
                  Lat: {inspection.location.lat.toFixed(4)}, 
                  Lng: {inspection.location.lng.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
