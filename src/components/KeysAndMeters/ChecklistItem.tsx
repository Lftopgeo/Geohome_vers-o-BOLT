import React from 'react';
import { Check } from 'lucide-react';
import type { ChecklistItemType } from '../../types/checklist';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: () => void;
  onUpdateObservations: (value: string) => void;
}

export function ChecklistItem({ item, onToggle, onUpdateObservations }: ChecklistItemProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${
            item.isChecked 
              ? 'bg-[#DDA76A] border-[#DDA76A] text-white' 
              : 'border-gray-300 hover:border-[#DDA76A]'
          }`}
        >
          {item.isChecked && <Check size={16} />}
        </button>
        
        <span className="flex-1 text-gray-700">{item.label}</span>
        
        <span className={`text-sm ${item.isChecked ? 'text-green-600' : 'text-red-600'}`}>
          {item.isChecked ? 'Conforme' : 'Não conforme'}
        </span>
      </div>

      <div className="pl-9">
        <textarea
          value={item.observations}
          onChange={(e) => onUpdateObservations(e.target.value)}
          placeholder="Observações..."
          className="w-full px-3 py-2 text-sm border rounded-lg resize-none"
          rows={2}
        />
      </div>
    </div>
  );
}