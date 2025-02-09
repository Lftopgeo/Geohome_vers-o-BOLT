import React from 'react';

interface GeneralObservations {
  anomalies: string;
  maintenance: string;
  recommendations: string;
}

interface GeneralObservationsFormProps {
  data: GeneralObservations;
  onChange: (updates: Partial<GeneralObservations>) => void;
}

export function GeneralObservationsForm({ data, onChange }: GeneralObservationsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Anomalias encontradas
        </label>
        <textarea
          value={data.anomalies}
          onChange={(e) => onChange({ anomalies: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg resize-none"
          placeholder="Descreva as anomalias encontradas..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Manutenções necessárias
        </label>
        <textarea
          value={data.maintenance}
          onChange={(e) => onChange({ maintenance: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg resize-none"
          placeholder="Liste as manutenções necessárias..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recomendações
        </label>
        <textarea
          value={data.recommendations}
          onChange={(e) => onChange({ recommendations: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg resize-none"
          placeholder="Adicione recomendações..."
        />
      </div>
    </div>
  );
}