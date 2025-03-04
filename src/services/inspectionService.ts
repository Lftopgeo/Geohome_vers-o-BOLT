/**
 * Serviço para gerenciamento de inspeções
 */

// Interface para os dados da inspeção
export interface Inspection {
  id: string;
  propertyName: string;
  propertyType: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  inspectorName?: string;
  creciNumber?: string;
  inspectionDate?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'in_progress' | 'completed';
  [key: string]: any;
}

// Lista de inspeções em memória (simulando um banco de dados)
let inspections: Inspection[] = [];

/**
 * Gera um ID único para a inspeção
 * @returns ID único no formato INS-XXXXX
 */
function generateUniqueId(): string {
  // Gerar um timestamp em milissegundos
  const timestamp = Date.now().toString();
  
  // Gerar um número aleatório entre 0 e 9999
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  // Combinar timestamp e número aleatório e pegar os últimos 8 caracteres
  const uniqueString = (timestamp + random).slice(-8);
  
  return `INS-${uniqueString}`;
}

/**
 * Salva os dados de uma inspeção
 * @param data Dados do formulário de inspeção
 * @returns Dados da inspeção salva
 */
export async function saveInspection(data: Record<string, any>): Promise<Inspection> {
  try {
    // Simular um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Verificar se estamos usando dados mockados devido a problemas com Supabase
    const useMockData = true;
    
    if (useMockData) {
      // Gerar um ID único para a inspeção
      const id = generateUniqueId();
      
      // Criar o objeto de inspeção
      const inspection: Inspection = {
        id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'in_progress'
      };
      
      // Adicionar à lista de inspeções
      inspections.push(inspection);
      
      // Salvar no localStorage para persistência
      saveInspectionsToLocalStorage();
      
      return inspection;
    } else {
      // Implementação futura com Supabase
      throw new Error('Implementação com Supabase ainda não disponível');
    }
  } catch (error) {
    console.error('Erro ao salvar inspeção:', error);
    throw error;
  }
}

/**
 * Obtém uma inspeção pelo ID
 * @param id ID da inspeção
 * @returns Dados da inspeção ou null se não encontrada
 */
export async function getInspectionById(id: string): Promise<Inspection | null> {
  try {
    // Simular um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Carregar inspeções do localStorage
    loadInspectionsFromLocalStorage();
    
    // Buscar a inspeção pelo ID
    const inspection = inspections.find(insp => insp.id === id);
    
    return inspection || null;
  } catch (error) {
    console.error('Erro ao buscar inspeção:', error);
    return null;
  }
}

/**
 * Lista todas as inspeções
 * @returns Lista de inspeções
 */
export async function listInspections(): Promise<Inspection[]> {
  try {
    // Simular um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Carregar inspeções do localStorage
    loadInspectionsFromLocalStorage();
    
    // Ordenar por data de atualização (mais recentes primeiro)
    return [...inspections].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error('Erro ao listar inspeções:', error);
    return [];
  }
}

/**
 * Atualiza o status de uma inspeção
 * @param id ID da inspeção
 * @param status Novo status
 * @returns Inspeção atualizada ou null se não encontrada
 */
export async function updateInspectionStatus(
  id: string, 
  status: 'draft' | 'in_progress' | 'completed'
): Promise<Inspection | null> {
  try {
    // Simular um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Carregar inspeções do localStorage
    loadInspectionsFromLocalStorage();
    
    // Buscar o índice da inspeção
    const index = inspections.findIndex(insp => insp.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Atualizar o status
    inspections[index] = {
      ...inspections[index],
      status,
      updatedAt: new Date().toISOString()
    };
    
    // Salvar no localStorage
    saveInspectionsToLocalStorage();
    
    return inspections[index];
  } catch (error) {
    console.error('Erro ao atualizar status da inspeção:', error);
    return null;
  }
}

/**
 * Salva as inspeções no localStorage
 */
function saveInspectionsToLocalStorage() {
  try {
    localStorage.setItem('geohome_inspections', JSON.stringify(inspections));
  } catch (error) {
    console.error('Erro ao salvar inspeções no localStorage:', error);
  }
}

/**
 * Carrega as inspeções do localStorage
 */
function loadInspectionsFromLocalStorage() {
  try {
    const storedInspections = localStorage.getItem('geohome_inspections');
    
    if (storedInspections) {
      inspections = JSON.parse(storedInspections);
    }
  } catch (error) {
    console.error('Erro ao carregar inspeções do localStorage:', error);
  }
}
