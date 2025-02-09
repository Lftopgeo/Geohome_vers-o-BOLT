import React from 'react';
import { ChecklistItem } from './ChecklistItem';
import type { ChecklistItemType } from '../../../types/checklist';

interface ChecklistSectionProps {
  title: string;
  items: ChecklistItemType[];
  onToggleItem: (id: string) => void;
  onUpdateObservations: (id: string, value: string) => void;
}

export function ChecklistSection({ 
  title, 
  items,
  onToggleItem,
  onUpdateObservations
}: ChecklistSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            label={item.label}
            isChecked={item.isChecked}
            onToggle={onToggleItem}
            observations={item.observations}
            onObservationsChange={onUpdateObservations}
          />
        ))}
      </div>
    </div>
  );
}