import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './InspectionMap.css';
import { Icon } from 'leaflet';
import { Building } from 'lucide-react';
import type { InspectionSummary } from '../../types/dashboard';

// Corrigir o problema com os ícones do Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Definir o ícone padrão para os marcadores
const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

export function InspectionMap({ 
  inspections, 
  height = 400,
  isLoading = false
}: InspectionMapProps) {
  const [inspectionsWithLocation, setInspectionsWithLocation] = useState<InspectionWithLocation[]>([]);
  const [mapCenter, setMapCenter] = useState<GeoLocation>({ lat: -23.5505, lng: -46.6333 }); // São Paulo como padrão

  // Simular a obtenção de coordenadas para as inspeções
  // Em um ambiente real, essas coordenadas viriam do banco de dados ou de uma API de geocodificação
  useEffect(() => {
    if (inspections.length === 0) return;

    // Função para simular coordenadas baseadas no endereço
    // Em produção, você usaria uma API de geocodificação real
    const getSimulatedCoordinates = (address: string): GeoLocation => {
      // Gerar coordenadas aleatórias próximas ao centro do mapa
      // Apenas para simulação
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
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {inspectionsWithLocation.map(inspection => (
          <Marker 
            key={inspection.id}
            position={[inspection.location.lat, inspection.location.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="map-marker-popup">
                <h3>{inspection.propertyType}</h3>
                <p>{inspection.address}</p>
                <p>
                  <span className={`status-badge ${getStatusClass(inspection.status)}`}>
                    {getStatusText(inspection.status)}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
