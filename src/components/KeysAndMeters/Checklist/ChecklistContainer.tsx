import React, { useState } from 'react';
import { KeysChecklist } from './KeysChecklist';
import { MetersChecklist } from './MetersChecklist';
import { GenerateReportButton } from '../../Report/GenerateReportButton';
import type { ChecklistData } from '../../../types/checklist';

const initialData: ChecklistData = {
  keys: [
    {
      id: '1',
      label: 'Todas as chaves estão identificadas corretamente',
      isChecked: false,
      observations: ''
    },
    {
      id: '2',
      label: 'Chaves testadas e funcionando',
      isChecked: false,
      observations: ''
    },
    {
      id: '3',
      label: 'Quantidade de cópias confere com o informado',
      isChecked: false,
      observations: ''
    },
    {
      id: '4',
      label: 'Estado das chaves adequado',
      isChecked: false,
      observations: ''
    }
  ],
  meters: [
    {
      id: '1',
      label: 'Medidores facilmente acessíveis',
      isChecked: false,
      observations: ''
    },
    {
      id: '2',
      label: 'Leituras iniciais registradas',
      isChecked: false,
      observations: ''
    },
    {
      id: '3',
      label: 'Lacres dos medidores intactos',
      isChecked: false,
      observations: ''
    },
    {
      id: '4',
      label: 'Ausência de vazamentos ou irregularidades',
      isChecked: false,
      observations: ''
    }
  ]
};

export function ChecklistContainer() {
  const [data, setData] = useState<ChecklistData>(initialData);

  const handleToggleItem = (section: 'keys' | 'meters', id: string) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    }));
  };

  const handleUpdateObservations = (section: 'keys' | 'meters', id: string, value: string) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, observations: value } : item
      )
    }));
  };

  const handleSave = async () => {
    // Add your save logic here
    console.log('Saving checklist data:', data);
  };

  return (
    <div className="space-y-8">
      <KeysChecklist
        items={data.keys}
        onToggleItem={(id) => handleToggleItem('keys', id)}
        onUpdateObservations={(id, value) => handleUpdateObservations('keys', id, value)}
      />

      <MetersChecklist
        items={data.meters}
        onToggleItem={(id) => handleToggleItem('meters', id)}
        onUpdateObservations={(id, value) => handleUpdateObservations('meters', id, value)}
      />

      <div className="flex justify-end">
        <GenerateReportButton onSave={handleSave} />
      </div>
    </div>
  );
}