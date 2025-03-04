/**
 * Serviço para busca de CEP utilizando a API ViaCEP
 */

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

/**
 * Busca os dados de endereço a partir de um CEP
 * @param cep CEP a ser consultado (apenas números ou no formato 00000-000)
 * @returns Dados do endereço ou null em caso de erro
 */
export async function fetchAddressByCep(cep: string): Promise<CepResponse | null> {
  try {
    // Remover caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, '');
    
    // Validar se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido. O CEP deve conter 8 dígitos.');
    }
    
    // Fazer a requisição para a API ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    // Verificar se a requisição foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    // Converter a resposta para JSON
    const data: CepResponse = await response.json();
    
    // Verificar se a API retornou um erro
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}

/**
 * Formata um CEP para o padrão 00000-000
 * @param cep CEP a ser formatado (apenas números)
 * @returns CEP formatado
 */
export function formatCep(cep: string): string {
  const cleanCep = cep.replace(/\D/g, '');
  
  if (cleanCep.length !== 8) {
    return cep;
  }
  
  return `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`;
}
