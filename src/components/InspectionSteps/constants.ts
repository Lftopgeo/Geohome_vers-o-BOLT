import { ClipboardList, LayoutGrid, Home, Building2, Key, FileText } from 'lucide-react';
import type { InspectionStep } from './types';

export const INSPECTION_STEPS: InspectionStep[] = [
  {
    id: 'new-inspection',
    icon: ClipboardList,
    label: 'Nova Vistoria',
    path: '/nova-vistoria',
    description: 'Informações iniciais da vistoria'
  },
  {
    id: 'choose-environment',
    icon: LayoutGrid,
    label: 'Escolha do Ambiente',
    description: 'Selecione as áreas para inspeção'
  },
  {
    id: 'internal-environment',
    icon: Home,
    label: 'Ambiente Interno',
    description: 'Inspeção de áreas internas'
  },
  {
    id: 'external-environment',
    icon: Building2,
    label: 'Ambiente Externo',
    description: 'Inspeção de áreas externas'
  },
  {
    id: 'keys-meters',
    icon: Key,
    label: 'Chaves e Medidores',
    description: 'Registro de chaves e medidores'
  },
  {
    id: 'report',
    icon: FileText,
    label: 'Relatório',
    description: 'Geração do relatório final'
  }
];