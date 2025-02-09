import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PhotoUpload } from '../Room/EditRoom/PhotoUpload';
import type { MeterReading } from '../../types/keysAndMeters';

interface MeterItemProps {
  meter: MeterReading;
  onUpdate: (updates: Partial<MeterReading>) => void;
}

export function MeterItem({ meter, onUpdate }: MeterItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePhotoUpload = (files: FileList) => {
    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
    onUpdate({ photos: [...meter.photos, ...newPhotos] });
  };

  const providerLabels = {
    water: 'Embasa',
    electricity: 'Coelba',
    gas: 'Gás Natural'
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Medidor de {meter.type === 'water' ? 'Água' : meter.type === 'electricity' ? 'Energia' : 'Gás'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {providerLabels[meter.type]}
              </span>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Número: {meter.meterNumber}
          </p>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-gray-50">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leitura Atual
                </label>
                <input
                  type="number"
                  value={meter.currentReading}
                  onChange={(e) => onUpdate({ currentReading: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Leitura
                </label>
                <input
                  type="date"
                  value={meter.readingDate.toISOString().split('T')[0]}
                  onChange={(e) => onUpdate({ readingDate: new Date(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização
              </label>
              <input
                type="text"
                value={meter.location}
                onChange={(e) => onUpdate({ location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={meter.observations || ''}
                onChange={(e) => onUpdate({ observations: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos
              </label>
              <PhotoUpload onUpload={handlePhotoUpload} />
              
              {meter.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {meter.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={photo}
                        alt={`Medidor ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          const newPhotos = [...meter.photos];
                          newPhotos.splice(index, 1);
                          onUpdate({ photos: newPhotos });
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}