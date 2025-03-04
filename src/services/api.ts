// Removendo a importação problemática do Supabase e usando apenas dados mockados
// import { createClient } from '@supabase/supabase-js';
import type { InspectionSummary, Activity } from '../types/dashboard';

// Dados mockados para o dashboard
const mockInspections: InspectionSummary[] = [
  {
    id: '1',
    protocol: 'VST202503010001',
    address: 'Rua das Flores, 123 - Jardim Primavera',
    date: new Date(2025, 2, 1, 14, 30),
    status: 'completed',
    clientName: 'Maria Silva',
    propertyType: 'Apartamento',
    inspectorName: 'João Pereira'
  },
  {
    id: '2',
    protocol: 'VST202503020002',
    address: 'Av. Central, 456 - Centro',
    date: new Date(2025, 2, 2, 10, 0),
    status: 'pending',
    clientName: 'Carlos Oliveira',
    propertyType: 'Casa',
    inspectorName: 'Ana Santos'
  },
  {
    id: '3',
    protocol: 'VST202503030003',
    address: 'Rua dos Pinheiros, 789 - Alto da Boa Vista',
    date: new Date(2025, 2, 3, 9, 15),
    status: 'in_progress',
    clientName: 'Roberto Almeida',
    propertyType: 'Comercial',
    inspectorName: 'João Pereira'
  },
  {
    id: '4',
    protocol: 'VST202503040004',
    address: 'Alameda das Acácias, 234 - Jardim Europa',
    date: new Date(2025, 2, 4, 15, 45),
    status: 'pending',
    clientName: 'Fernanda Costa',
    propertyType: 'Apartamento',
    inspectorName: 'Ana Santos'
  }
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'inspection_created',
    description: 'Nova vistoria agendada para Rua das Flores, 123',
    timestamp: new Date(2025, 2, 3, 8, 15),
    user: 'João Pereira'
  },
  {
    id: '2',
    type: 'report_generated',
    description: 'Relatório gerado para Av. Central, 456',
    timestamp: new Date(2025, 2, 3, 11, 30),
    user: 'Ana Santos'
  },
  {
    id: '3',
    type: 'inspection_completed',
    description: 'Vistoria concluída em Rua dos Pinheiros, 789',
    timestamp: new Date(2025, 2, 3, 14, 45),
    user: 'João Pereira'
  },
  {
    id: '4',
    type: 'client_feedback',
    description: 'Feedback recebido do cliente Roberto Almeida',
    timestamp: new Date(2025, 2, 3, 16, 20),
    user: 'Sistema'
  }
];

const mockStats = {
  total: 4,
  completed: 1,
  pending: 2,
  inProgress: 1
};

// Funções para o dashboard que retornam dados mockados
export async function getInspections(): Promise<InspectionSummary[]> {
  // Simulando um atraso de rede
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockInspections);
    }, 500);
  });
}

export async function getActivities(): Promise<Activity[]> {
  // Simulando um atraso de rede
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockActivities);
    }, 300);
  });
}

export async function getDashboardStats() {
  // Simulando um atraso de rede
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockStats);
    }, 200);
  });
}
