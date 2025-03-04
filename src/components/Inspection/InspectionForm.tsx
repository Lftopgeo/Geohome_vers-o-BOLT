import React, { useState } from 'react';
import { PropertyDetails } from './PropertyDetails';
import { InspectionDetails } from './InspectionDetails';
import { PropertyProvider } from '../../contexts/PropertyContext';

export function InspectionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Função para validar o formulário
  const validateForm = (form: HTMLFormElement): boolean => {
    // Verificar se todos os campos obrigatórios estão preenchidos
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!(field as HTMLInputElement).value) {
        isValid = false;
        (field as HTMLInputElement).classList.add('border-red-500');
      } else {
        (field as HTMLInputElement).classList.remove('border-red-500');
      }
    });
    
    return isValid;
  };
  
  // Função para capturar os dados do formulário
  const captureFormData = (form: HTMLFormElement): Record<string, any> => {
    const data: Record<string, any> = {};
    const formElements = form.elements;
    
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (element.name) {
        data[element.name] = element.value;
      }
    }
    
    return data;
  };
  
  // Função para lidar com a submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    // Validar o formulário
    if (!validateForm(form)) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Capturar os dados do formulário
    const newFormData = captureFormData(form);
    setFormData({ ...formData, ...newFormData });
    
    try {
      setLoading(true);
      setError(null);
      
      // Simular uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar um ID de inspeção aleatório
      const inspectionId = `INS-${Math.floor(Math.random() * 10000)}`;
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
      console.log('Dados do formulário enviados:', { ...formData, ...newFormData, inspectionId });
      
      // Avançar para o próximo passo após 1 segundo
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Ocorreu um erro ao salvar os dados. Por favor, tente novamente.');
      setLoading(false);
    }
  };
  
  return (
    <PropertyProvider>
      <div className="max-w-4xl mx-auto">
        {/* Barra de progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#19384A] text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-[#19384A]' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#19384A] text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-[#19384A]' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#19384A] text-white' : 'bg-gray-200'}`}>
                3
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Etapa 1: Detalhes da Propriedade */}
          {currentStep === 1 && (
            <div>
              <PropertyDetails />
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className={`px-6 py-2 bg-[#19384A] text-white rounded-lg hover:bg-[#0f2a3d] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </span>
                  ) : 'Salvar e Continuar'}
                </button>
              </div>
            </div>
          )}
          
          {/* Etapa 2: Detalhes da Inspeção */}
          {currentStep === 2 && (
            <div>
              <InspectionDetails />
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setCurrentStep(1)}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 bg-[#19384A] text-white rounded-lg hover:bg-[#0f2a3d] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </span>
                  ) : 'Salvar e Continuar'}
                </button>
              </div>
            </div>
          )}
          
          {/* Etapa 3: Confirmação */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-[#19384A] mb-4">Vistoria Iniciada com Sucesso!</h2>
              <p className="mb-4">
                Sua vistoria foi iniciada com sucesso. Agora você pode prosseguir para a etapa de registro fotográfico.
              </p>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setCurrentStep(2)}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-[#19384A] text-white rounded-lg hover:bg-[#0f2a3d] transition-colors"
                  onClick={() => {
                    // Redirecionar para a página de registro fotográfico
                    console.log('Redirecionando para o registro fotográfico...');
                  }}
                >
                  Iniciar Registro Fotográfico
                </button>
              </div>
            </div>
          )}
          
          {/* Mensagem de erro */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Mensagem de sucesso */}
          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
              Dados salvos com sucesso!
            </div>
          )}
        </form>
      </div>
    </PropertyProvider>
  );
}