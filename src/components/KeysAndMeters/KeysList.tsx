import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { KeyItem } from './KeyItem';
import { AddKeyDialog } from './AddKeyDialog';
import type { KeyItem as KeyItemType } from '../../types/keysAndMeters';

interface KeysListProps {
  keys: KeyItemType[];
  onAddKey: (key: KeyItemType) => void;
  onUpdateKey: (id: string, updates: Partial<KeyItemType>) => void;
}

export function KeysList({ keys, onAddKey, onUpdateKey }: KeysListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Chaves</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 text-[#DDA76A] hover:text-[#c89355]"
        >
          <Plus size={20} />
          <span>Adicionar Chave</span>
        </button>
      </div>

      <div className="space-y-4">
        {keys.map((key) => (
          <KeyItem
            key={key.id}
            item={key}
            onUpdate={(updates) => onUpdateKey(key.id, updates)}
          />
        ))}

        {keys.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Nenhuma chave cadastrada
          </p>
        )}
      </div>

      {showAddDialog && (
        <AddKeyDialog
          onClose={() => setShowAddDialog(false)}
          onAdd={onAddKey}
        />
      )}
    </div>
  );
}