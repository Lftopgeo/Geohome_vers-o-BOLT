export interface KeyItem {
  id: string;
  roomName: string;
  keyCount: number;
  condition: 'optimal' | 'good' | 'regular' | 'bad';
  observations?: string;
  photos: string[];
  tested: boolean;
  clearlyIdentified: boolean;
}

export interface MeterReading {
  id: string;
  type: 'water' | 'electricity' | 'gas';
  meterNumber: string;
  currentReading: number;
  previousReading: number;
  readingDate: Date;
  condition: 'optimal' | 'good' | 'regular' | 'bad';
  photos: string[];
  observations?: string;
  sealIntact: boolean;
  location: string;
}

export interface KeysAndMetersData {
  keys: KeyItem[];
  meters: MeterReading[];
}