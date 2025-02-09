import React from 'react';
import { Plus } from 'lucide-react';
import { KeyInventoryForm } from './KeyInventoryForm';
import type { KeyInventoryItem } from '../../../types/inspection';

interface KeyInventorySectionProps {
  keys: KeyInventoryItem[];
  onChange: (keys: KeyInventoryItem[]) => void;
}

export function KeyInventorySection({ keys, onChange }: KeyInventorySectionProps) {
  const handleAddKey = () => {
    const newKey: KeyInventoryItem = {
      roomName: '',
      keyCount: 1,
      clearlyIdentified: true,
      condition: 'good',
      tested: false,
      photos: []
    };
    onChange([...keys, newKey]);
  };

  const handleUpdateKey = (index: number, updates: Partial<KeyInventoryItem>) => {
    const updatedKeys = [...keys];
    updatedKeys[index] = { ...updatedKeys[index], ...updates };
    onChange(updatedKeys);
  };

  const handleRemoveKey = (index: number) => {
    const updatedKeys = keys.filter((_, i) => i !== index);
    onChange(updatedKeys);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventário de Chaves</h2>
        <button
          onClick={handleAddKey}
          className="flex items-center gap-2 text-[#DDA76A] hover:text-[#c89355]"
        >
          <Plus size={20} />
          <span>Adicionar Chave</span>
        </button>
      </div>

      {keys.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Nenhuma chave cadastrada. Clique no botão acima para adicionar.
        </p>
      ) : (
        <div className="space-y-6">
          {keys.map((key, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Chave {index + 1}</h3>
                <button
                  onClick={() => handleRemoveKey(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remover
                </button>
              </div>
              <KeyInventoryForm
                data={key}
                onChange={(updates) => handleUpdateKey(index, updates)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}