import type { Room, InspectionItem } from './index';

export interface Inspector {
  id: string;
  name: string;
  signature: string;
}

export interface Client {
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
}

export interface Property {
  address: string;
  type: string;
  totalArea: number;
  buildingType: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface InspectionReport {
  id: string;
  protocol: string;
  date: Date;
  inspector: Inspector;
  client: Client;
  property: Property;
  rooms: Room[];
  externalItems: InspectionItem[];
  photos: {
    url: string;
    caption: string;
    timestamp: Date;
    location?: string;
  }[];
  technicalOpinion: string;
  status: 'draft' | 'completed' | 'signed';
}