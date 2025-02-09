import React, { useState } from 'react';
import { Header } from '../components/Header';
import { BackButton } from '../components/common/BackButton';
import { KeysChecklist } from '../components/KeysAndMeters/KeysChecklist';
import { MetersChecklist } from '../components/KeysAndMeters/MetersChecklist';
import { GenerateReportButton } from '../components/Report/GenerateReportButton';
import type { ChecklistData } from '../types/checklist';

const initialData: ChecklistData = {
  keys: [
    { id: '1', label: 'Todas as chaves identificadas', isChecked: false, observations: '' },
    { id: '2', label: 'Chaves testadas e funcionando', isChecked: false, observations: '' },
    { id: '3', label: 'Quantidade de cópias confere', isChecked: false, observations: '' },
    { id: '4', label: 'Estado das chaves adequado', isChecked: false, observations: '' }
  ],
  meters: [
    { id: '1', label: 'Medidores acessíveis', isChecked: false, observations: '' },
    { id: '2', label: 'Leituras registradas', isChecked: false, observations: '' },
    { id: '3', label: 'Lacres intactos', isChecked: false, observations: '' },
    { id: '4', label: 'Sem vazamentos/irregularidades', isChecked: false, observations: '' }
  ]
};

export function KeysAndMetersPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton to="/areas-vistoria" />
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Chaves e Medidores</h1>
          
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
              <GenerateReportButton onSave={async () => {
                // Add save logic here
                console.log('Saving checklist data:', data);
              }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}