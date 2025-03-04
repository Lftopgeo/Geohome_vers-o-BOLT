import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Users, 
  Building,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Componentes do Dashboard
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { StatCard } from '../components/Dashboard/StatCard';
import { InspectionCard } from '../components/Dashboard/InspectionCard';
import { RecentActivityCard } from '../components/Dashboard/RecentActivityCard';
import { CalendarWidget } from '../components/Dashboard/CalendarWidget';

// Serviços de API
import { getInspections, getActivities, getDashboardStats } from '../services/api';

// Tipos de dados
import type { InspectionSummary, Activity, DashboardStats } from '../types/dashboard';

export function DashboardPage() {
  const [inspections, setInspections] = useState<InspectionSummary[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus] = useState<string>('all');
  const [searchQuery] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Buscar dados das inspeções
        const inspectionsData = await getInspections();
        setInspections(inspectionsData);
        
        // Buscar dados das atividades recentes
        const activitiesData = await getActivities();
        setActivities(activitiesData);
        
        // Buscar estatísticas do dashboard
        const statsData = await getDashboardStats();
        setStats(statsData as DashboardStats);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Filtrar inspeções
  const filteredInspections = inspections.filter(inspection => {
    if (filterStatus !== 'all' && inspection.status !== filterStatus) return false;
    if (searchQuery && !inspection.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Dashboard" subtitle="Visão geral das vistorias e atividades" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <LayoutDashboard className="mr-2" size={24} />
            Dashboard
          </h1>
          
          <div className="flex space-x-2">
            <Link 
              to="/nova-vistoria" 
              className="flex items-center px-4 py-2 bg-[#DDA76A] text-white rounded-lg hover:bg-[#C89355] transition-colors"
            >
              <Plus size={18} className="mr-1" />
              Nova Vistoria
            </Link>
          </div>
        </div>
        
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total de Vistorias" 
            value={stats.total} 
            icon={<ClipboardCheck size={24} />} 
          />
          
          <StatCard 
            title="Vistorias Concluídas" 
            value={stats.completed} 
            icon={<Clock size={24} />} 
          />
          
          <StatCard 
            title="Vistorias Pendentes" 
            value={stats.pending} 
            icon={<AlertTriangle size={24} />} 
          />
          
          <StatCard 
            title="Em Andamento" 
            value={stats.inProgress} 
            icon={<TrendingUp size={24} />} 
          />
        </div>
        
        {/* Próximas Vistorias e Atividades Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Próximas Vistorias</h2>
              
              <div className="flex space-x-2">
                <button 
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  title="Buscar vistorias"
                  aria-label="Buscar vistorias"
                >
                  <Search size={18} />
                </button>
                <button 
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  title="Filtrar vistorias"
                  aria-label="Filtrar vistorias"
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">Carregando vistorias...</div>
              ) : filteredInspections.length > 0 ? (
                filteredInspections.map(inspection => (
                  <InspectionCard key={inspection.id} inspection={inspection} />
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">Nenhuma vistoria encontrada</div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <Link to="/vistorias" className="text-[#DDA76A] hover:text-[#C89355] font-medium text-sm">
                Ver todas as vistorias
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Atividades Recentes</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">Carregando atividades...</div>
              ) : activities.length > 0 ? (
                activities.map(activity => (
                  <RecentActivityCard key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">Nenhuma atividade recente</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Calendário e Equipe */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Calendar size={20} className="mr-2" />
                Calendário de Vistorias
              </h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center text-gray-500">Carregando calendário...</div>
              ) : (
                <CalendarWidget inspections={inspections} />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Users size={20} className="mr-2" />
                Equipe de Vistoriadores
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-4">
                    JP
                  </div>
                  <div>
                    <h3 className="font-medium">João Pereira</h3>
                    <p className="text-sm text-gray-500">12 vistorias este mês</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-4">
                    AS
                  </div>
                  <div>
                    <h3 className="font-medium">Ana Santos</h3>
                    <p className="text-sm text-gray-500">8 vistorias este mês</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mr-4">
                    RL
                  </div>
                  <div>
                    <h3 className="font-medium">Ricardo Lima</h3>
                    <p className="text-sm text-gray-500">6 vistorias este mês</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mr-4">
                    MC
                  </div>
                  <div>
                    <h3 className="font-medium">Mariana Costa</h3>
                    <p className="text-sm text-gray-500">4 vistorias este mês</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gráficos de Desempenho - Substituídos por mensagens informativas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Vistorias por Tipo de Imóvel</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center h-[250px] text-center">
                <Building size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Dados estatísticos</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-lg">42%</p>
                    <p className="text-sm text-gray-500">Apartamento</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-lg">28%</p>
                    <p className="text-sm text-gray-500">Casa</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-lg">18%</p>
                    <p className="text-sm text-gray-500">Comercial</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-lg">12%</p>
                    <p className="text-sm text-gray-500">Industrial</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Vistorias por Mês</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center h-[250px] text-center">
                <TrendingUp size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Tendência de crescimento</p>
                <div className="w-full max-w-md mt-4">
                  <div className="flex justify-between items-end h-32 px-2">
                    {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((month, index) => {
                      const values = [18, 22, 30, 25, 28, 32];
                      const maxValue = Math.max(...values);
                      const height = (values[index] / maxValue) * 100;
                      
                      return (
                        <div key={month} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-[#DDA76A] rounded-t-sm" 
                            style={{ height: `${height}%` }}
                            aria-label={`${values[index]} vistorias em ${month}`}
                          ></div>
                          <p className="text-xs text-gray-500 mt-2">{month}</p>
                          <p className="text-xs font-medium">{values[index]}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
