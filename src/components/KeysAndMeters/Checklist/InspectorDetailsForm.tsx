import React from 'react';
import { SignatureCanvas } from '../../Report/SignatureCanvas';

interface InspectorDetails {
  name: string;
  date: Date;
  signature?: string;
}

interface InspectorDetailsFormProps {
  data: InspectorDetails;
  onChange: (updates: Partial<InspectorDetails>) => void;
}

export function InspectorDetailsForm({ data, onChange }: InspectorDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Responsável
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data da Inspeção
          </label>
          <input
            type="date"
            value={data.date.toISOString().split('T')[0]}
            onChange={(e) => onChange({ date: new Date(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <SignatureCanvas
          value={data.signature}
          onChange={(signature) => onChange({ signature })}
        />
      </div>
    </div>
  );
}