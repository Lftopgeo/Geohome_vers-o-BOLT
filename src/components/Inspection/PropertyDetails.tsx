import React, { useState, useEffect } from 'react';
import { PropertyTypeSelector } from './PropertyType/PropertyTypeSelector';
import { PropertySubtypeSelector } from './PropertyType/PropertySubtypeSelector';
import { PropertyAreaInputs } from './PropertyAreaInputs';
import { PropertyFurnishing } from './PropertyFurnishing';
import { usePropertyContext } from '../../contexts/PropertyContext';
import { fetchAddressByCep, formatCep } from '../../services/cepService';
import type { PropertyType } from '../../types/property';

export function PropertyDetails() {
  const { propertyType, setPropertyType } = usePropertyContext();
  const [subtype, setSubtype] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // Lista de estados brasileiros
  const brazilianStates = [
    { value: '', label: 'Selecione um estado' },
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  // Função para buscar o endereço pelo CEP
  const handleCepSearch = async () => {
    // Limpar erro anterior
    setCepError(null);
    
    // Verificar se o CEP tem pelo menos 8 dígitos
    const cleanCep = zipCode.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setCepError('CEP inválido. O CEP deve conter 8 dígitos.');
      return;
    }
    
    try {
      setIsLoadingCep(true);
      
      // Buscar o endereço pelo CEP
      const addressData = await fetchAddressByCep(cleanCep);
      
      if (addressData) {
        // Preencher os campos com os dados retornados
        setAddress(addressData.logradouro || '');
        setNeighborhood(addressData.bairro || '');
        setCity(addressData.localidade || '');
        setState(addressData.uf || '');
        
        // Formatar o CEP
        setZipCode(formatCep(cleanCep));
      } else {
        setCepError('CEP não encontrado. Verifique o número e tente novamente.');
      }
    } catch (error) {
      setCepError('Erro ao buscar o CEP. Tente novamente mais tarde.');
      console.error('Erro na busca de CEP:', error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  // Função para lidar com a mudança do CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setZipCode(value);
    
    // Limpar o erro quando o usuário começa a digitar novamente
    if (cepError) {
      setCepError(null);
    }
  };

  // Buscar o endereço automaticamente quando o CEP tiver 8 dígitos
  useEffect(() => {
    const cleanCep = zipCode.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      handleCepSearch();
    }
  }, [zipCode]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Dados do Imóvel</h2>
      
      {/* Property Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Imóvel <span className="text-red-500">*</span>
        </label>
        <PropertyTypeSelector />
      </div>

      {/* Property Subtype */}
      {propertyType && (
        <div className="mb-6">
          <PropertySubtypeSelector
            propertyType={propertyType}
            value={subtype}
            onChange={setSubtype}
          />
        </div>
      )}

      {/* Property Area */}
      <PropertyAreaInputs />

      {/* Furnishing Status */}
      <PropertyFurnishing />

      {/* Nome do Imóvel */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Imóvel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="propertyName"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Ex: Apartamento Centro, Casa Jardins, etc."
            required
          />
        </div>
        
        {/* CEP com busca automática */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CEP <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="zipCode"
              value={zipCode}
              onChange={handleCepChange}
              className={`w-full px-3 py-2 border rounded-lg ${cepError ? 'border-red-500' : ''}`}
              placeholder="00000-000"
              required
            />
            <button
              type="button"
              onClick={handleCepSearch}
              disabled={isLoadingCep}
              className="px-4 py-2 bg-[#19384A] text-white rounded-lg hover:bg-[#0f2a3d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoadingCep ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : 'Buscar'}
            </button>
          </div>
          {cepError && (
            <p className="text-red-500 text-sm mt-1">{cepError}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Digite o CEP para preencher automaticamente os dados de endereço
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Rua, número, complemento"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Nome do bairro"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Nome da cidade"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado <span className="text-red-500">*</span>
            </label>
            <select 
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              {brazilianStates.map(stateOption => (
                <option key={stateOption.value} value={stateOption.value}>
                  {stateOption.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="number"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Número"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complemento
          </label>
          <input
            type="text"
            name="complement"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Apartamento, bloco, andar, etc."
          />
        </div>
      </div>
    </div>
  );
}