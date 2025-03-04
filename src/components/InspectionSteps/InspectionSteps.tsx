import React from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardList, LayoutGrid, Home, Building2, Key, FileText } from 'lucide-react';

interface InspectionStepsProps {
  currentStep: string;
}

export function InspectionSteps({ currentStep }: InspectionStepsProps) {
  const { id } = useParams<{ id: string }>();

  // Definir os passos com rotas dinâmicas que incluem o ID da inspeção
  const steps = [
    { id: 'new-inspection', icon: ClipboardList, label: 'Nova Vistoria', path: '/nova-vistoria' },
    { id: 'choose-environment', icon: LayoutGrid, label: 'Escolha do Ambiente', path: id ? `/areas-vistoria/${id}` : '/areas-vistoria' },
    { id: 'internal-environment', icon: Home, label: 'Ambiente Interno', path: id ? `/ambiente-interno/${id}` : '/ambiente-interno' },
    { id: 'external-environment', icon: Building2, label: 'Ambiente Externo', path: id ? `/ambiente-externo/${id}` : '/ambiente-externo' },
    { id: 'keys-meters', icon: Key, label: 'Chaves e Medidores', path: id ? `/chaves-medidores/${id}` : '/chaves-medidores' },
    { id: 'report', icon: FileText, label: 'Relatório', path: id ? `/relatorio/${id}` : '/relatorio' }
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    const stepIndex = steps.findIndex(step => step.id === stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative ${
                  getStepStatus(step.id) === 'completed'
                    ? 'bg-[#DDA76A] text-white'
                    : getStepStatus(step.id) === 'active'
                    ? 'bg-[#DDA76A] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <step.icon size={18} />
              </div>
              <span className="text-xs mt-2 text-center font-medium text-gray-600">
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  getStepStatus(steps[index + 1].id) === 'completed' ||
                  getStepStatus(steps[index].id) === 'completed'
                    ? 'bg-[#DDA76A]'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}