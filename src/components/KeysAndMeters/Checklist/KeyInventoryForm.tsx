import React from 'react';
import { PhotoUpload } from '../../Room/EditRoom/PhotoUpload';
import type { KeyInventoryItem } from '../../../types/inspection';

interface KeyInventoryFormProps {
  data: KeyInventoryItem;
  onChange: (updates: Partial<KeyInventoryItem>) => void;
}

export function KeyInventoryForm({ data, onChange }: KeyInventoryFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do cômodo
          </label>
          <input
            type="text"
            value={data.roomName}
            onChange={(e) => onChange({ roomName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade de chaves
          </label>
          <input
            type="number"
            value={data.keyCount}
            onChange={(e) => onChange({ keyCount: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Identificação clara
          </label>
          <select
            value={data.clearlyIdentified ? 'yes' : 'no'}
            onChange={(e) => onChange({ clearlyIdentified: e.target.value === 'yes' })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado das chaves
          </label>
          <select
            value={data.condition}
            onChange={(e) => onChange({ condition: e.target.value as KeyInventoryItem['condition'] })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="optimal">Ótimo</option>
            <option value="good">Bom</option>
            <option value="regular">Regular</option>
            <option value="bad">Ruim</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Funcionamento testado
          </label>
          <select
            value={data.tested ? 'yes' : 'no'}
            onChange={(e) => onChange({ tested: e.target.value === 'yes' })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotos
        </label>
        <PhotoUpload onUpload={(files) => {
          const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
          onChange({ photos: [...data.photos, ...newPhotos] });
        }} />
        
        {data.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {data.photos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    const newPhotos = [...data.photos];
                    newPhotos.splice(index, 1);
                    onChange({ photos: newPhotos });
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
  );
}