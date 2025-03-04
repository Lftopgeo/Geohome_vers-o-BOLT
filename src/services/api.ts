// Implementação com suporte a fallback para dados mockados
import type { InspectionSummary, Activity } from '../types/dashboard';

// Variáveis para controle da conexão
let supabaseClient: any = null;
let isSupabaseAvailable = false;

// Tentar inicializar o Supabase - sem importação direta para evitar erros de compilação
async function initSupabase() {
  try {
    // Comentando a importação dinâmica que está causando erros
    // const { createClient } = await import('@supabase/supabase-js');
    
    // Em vez disso, vamos verificar se o objeto global 'supabase' existe (caso seja carregado via CDN)
    // ou tentar carregar via require em runtime (para ambientes Node.js)
    let createClient;
    
    // Verificar se estamos em ambiente de produção com Supabase carregado via CDN
    if (typeof window !== 'undefined' && (window as any).supabase) {
      console.log('Usando Supabase via CDN global');
      createClient = (window as any).supabase.createClient;
    } else {
      console.warn('Supabase não disponível, usando dados mockados');
      isSupabaseAvailable = false;
      return;
    }
    
    if (!createClient) {
      console.warn('Função createClient do Supabase não encontrada, usando dados mockados');
      isSupabaseAvailable = false;
      return;
    }
    
    // Valores deveriam vir de variáveis de ambiente
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anon-key';
    
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Testar conexão com o Supabase
    const { data, error } = await supabaseClient.from('inspections').select('count').limit(1);
    
    if (!error) {
      console.log('Conexão com Supabase estabelecida com sucesso');
      isSupabaseAvailable = true;
    } else {
      console.warn('Erro ao conectar com Supabase, usando dados mockados:', error.message);
      isSupabaseAvailable = false;
    }
  } catch (error) {
    console.warn('Erro ao inicializar Supabase, usando dados mockados:', error);
    isSupabaseAvailable = false;
  }
}

// Iniciar tentativa de conexão ao carregar o serviço
initSupabase();

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

// Funções para o dashboard com suporte a fallback
export async function getInspections(): Promise<InspectionSummary[]> {
  if (isSupabaseAvailable && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('inspections')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        ...item,
        date: new Date(item.date)
      }));
    } catch (error) {
      console.error('Erro ao buscar inspeções do Supabase, usando fallback:', error);
      // Em caso de erro, usar dados mockados como fallback
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(mockInspections);
        }, 500);
      });
    }
  }
  
  // Se Supabase não estiver disponível, usar dados mockados
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockInspections);
    }, 500);
  });
}

export async function getActivities(): Promise<Activity[]> {
  if (isSupabaseAvailable && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('activities')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Erro ao buscar atividades do Supabase, usando fallback:', error);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(mockActivities);
        }, 300);
      });
    }
  }
  
  // Se Supabase não estiver disponível, usar dados mockados
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockActivities);
    }, 300);
  });
}

export async function getDashboardStats() {
  if (isSupabaseAvailable && supabaseClient) {
    try {
      // Obter contagem de inspeções por status
      const { data, error } = await supabaseClient.rpc('get_inspection_stats');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do Supabase, usando fallback:', error);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(mockStats);
        }, 200);
      });
    }
  }
  
  // Se Supabase não estiver disponível, usar dados mockados
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockStats);
    }, 200);
  });
}

// Função de utilidade para verificar status da conexão com Supabase
export function getConnectionStatus() {
  return {
    isSupabaseAvailable,
    lastChecked: new Date().toISOString()
  };
}

// Função para forçar nova tentativa de conexão
export async function retryConnection() {
  await initSupabase();
  return getConnectionStatus();
}
