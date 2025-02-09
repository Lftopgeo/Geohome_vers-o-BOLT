import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { MeterItem } from './MeterItem';
import { AddMeterDialog } from './AddMeterDialog';
import type { MeterReading } from '../../types/keysAndMeters';

interface MetersListProps {
  meters: MeterReading[];
  onAddMeter: (meter: MeterReading) => void;
  onUpdateMeter: (id: string, updates: Partial<MeterReading>) => void;
}

export function MetersList({ meters, onAddMeter, onUpdateMeter }: MetersListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Medidores</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 text-[#DDA76A] hover:text-[#c89355]"
        >
          <Plus size={20} />
          <span>Adicionar Medidor</span>
        </button>
      </div>

      <div className="space-y-4">
        {meters.map((meter) => (
          <MeterItem
            key={meter.id}
            meter={meter}
            onUpdate={(updates) => onUpdateMeter(meter.id, updates)}
          />
        ))}

        {meters.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Nenhum medidor cadastrado
          </p>
        )}
      </div>

      {showAddDialog && (
        <AddMeterDialog
          onClose={() => setShowAddDialog(false)}
          onAdd={onAddMeter}
        />
      )}
    </div>
  );
}