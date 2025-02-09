import React from 'react';
import { Key, Trash2 } from 'lucide-react';

interface KeyListProps {
  keys: Array<{
    id: string;
    name: string;
    quantity: number;
    room: string;
  }>;
  onDelete: (id: string) => void;
}

export function KeyList({ keys, onDelete }: KeyListProps) {
  return (
    <div className="space-y-4">
      {keys.map((key) => (
        <div 
          key={key.id}
          className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Key size={20} className="text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium">{key.name}</h3>
              <p className="text-sm text-gray-600">
                {key.quantity} unidade(s) • {key.room}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => onDelete(key.id)}
            className="p-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}

      {keys.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          Nenhuma chave cadastrada
        </p>
      )}
    </div>
  );
}