import React from 'react';
import { PhotoUpload } from '../../Room/EditRoom/PhotoUpload';
import type { MeterInspection } from '../../../types/inspection';

interface MeterFormProps {
  type: 'water' | 'electricity' | 'gas';
  data: MeterInspection;
  onChange: (updates: Partial<MeterInspection>) => void;
}

export function MeterForm({ type, data, onChange }: MeterFormProps) {
  const labels = {
    water: {
      number: 'Número do hidrômetro',
      reading: 'Leitura atual (m³)',
      unit: 'm³'
    },
    electricity: {
      number: 'Número do medidor',
      reading: 'Leitura atual (kWh)',
      unit: 'kWh'
    },
    gas: {
      number: 'Número do medidor',
      reading: 'Leitura atual (m³)',
      unit: 'm³'
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {labels[type].number}
          </label>
          <input
            type="text"
            value={data.meterNumber}
            onChange={(e) => onChange({ meterNumber: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {labels[type].reading}
          </label>
          <input
            type="number"
            value={data.currentReading}
            onChange={(e) => onChange({ currentReading: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado de conservação
          </label>
          <select
            value={data.condition}
            onChange={(e) => onChange({ condition: e.target.value as MeterInspection['condition'] })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="optimal">Ótimo</option>
            <option value="good">Bom</option>
            <option value="regular">Regular</option>
            <option value="bad">Ruim</option>
          </select>
        </div>
        
        {type === 'electricity' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de medidor
            </label>
            <select
              value={data.meterType}
              onChange={(e) => onChange({ meterType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="digital">Digital</option>
              <option value="analog">Analógico</option>
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lacre intacto
          </label>
          <select
            value={data.sealIntact ? 'yes' : 'no'}
            onChange={(e) => onChange({ sealIntact: e.target.value === 'yes' })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </select>
        </div>

        {type === 'water' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vazamentos visíveis
            </label>
            <select
              value={data.leaks ? 'yes' : 'no'}
              onChange={(e) => onChange({ leaks: e.target.value === 'yes' })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="no">Não</option>
              <option value="yes">Sim</option>
            </select>
          </div>
        )}

        {type === 'electricity' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disjuntores funcionando
            </label>
            <select
              value={data.breakersWorking ? 'yes' : 'no'}
              onChange={(e) => onChange({ breakersWorking: e.target.value === 'yes' })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="yes">Sim</option>
              <option value="no">Não</option>
            </select>
          </div>
        )}

        {type === 'gas' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teste de vazamento realizado
              </label>
              <select
                value={data.leakTestDone ? 'yes' : 'no'}
                onChange={(e) => onChange({ leakTestDone: e.target.value === 'yes' })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="yes">Sim</option>
                <option value="no">Não</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Válvula de segurança funcionando
              </label>
              <select
                value={data.safetyValveWorking ? 'yes' : 'no'}
                onChange={(e) => onChange({ safetyValveWorking: e.target.value === 'yes' })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="yes">Sim</option>
                <option value="no">Não</option>
              </select>
            </div>
          </>
        )}
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