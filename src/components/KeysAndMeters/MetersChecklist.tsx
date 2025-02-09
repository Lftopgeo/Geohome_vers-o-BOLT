import React from 'react';
import { Gauge } from 'lucide-react';
import { ChecklistItem } from './ChecklistItem';
import type { ChecklistItemType } from '../../types/checklist';

interface MetersChecklistProps {
  items: ChecklistItemType[];
  onToggleItem: (id: string) => void;
  onUpdateObservations: (id: string, value: string) => void;
}

export function MetersChecklist({ items, onToggleItem, onUpdateObservations }: MetersChecklistProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#DDA76A]/10 rounded-lg">
          <Gauge className="text-[#DDA76A]" size={24} />
        </div>
        <h2 className="text-xl font-semibold">Checklist de Medidores</h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={() => onToggleItem(item.id)}
            onUpdateObservations={(value) => onUpdateObservations(item.id, value)}
          />
        ))}
      </div>
    </div>
  );
}