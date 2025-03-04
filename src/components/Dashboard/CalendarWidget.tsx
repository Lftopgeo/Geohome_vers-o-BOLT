import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { InspectionSummary } from '../../types/dashboard';

interface CalendarWidgetProps {
  inspections: InspectionSummary[];
}

export function CalendarWidget({ inspections }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Funções para navegação no calendário
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  // Obter dias do mês atual
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Obter dia da semana do primeiro dia do mês (0 = Domingo, 1 = Segunda, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Verificar se uma data tem inspeções
  const hasInspections = (date: Date) => {
    return inspections.some(inspection => {
      const inspDate = new Date(inspection.date);
      return (
        inspDate.getDate() === date.getDate() &&
        inspDate.getMonth() === date.getMonth() &&
        inspDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Renderizar o calendário
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Nomes dos dias da semana
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Nomes dos meses
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    // Criar array de dias para renderizar
    const days = [];
    
    // Adicionar dias vazios do mês anterior
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    // Adicionar dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const hasEvents = hasInspections(date);
      
      // Obter detalhes das inspeções para exibir no tooltip
      const dateInspections = inspections.filter(inspection => {
        const inspDate = new Date(inspection.date);
        return (
          inspDate.getDate() === date.getDate() &&
          inspDate.getMonth() === date.getMonth() &&
          inspDate.getFullYear() === date.getFullYear()
        );
      });
      
      // Criar texto para o tooltip com informações das inspeções
      const tooltipText = hasEvents 
        ? `${dateInspections.length} vistoria(s) agendada(s): ${dateInspections.map(i => i.address.split(',')[0]).join(', ')}`
        : '';
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`
            h-8 w-8 flex items-center justify-center rounded-full text-sm
            ${isToday ? 'bg-[#DDA76A] text-white' : ''}
            ${hasEvents && !isToday ? 'font-bold' : ''}
            ${!isToday && !hasEvents ? 'text-gray-700' : ''}
            relative cursor-pointer hover:bg-gray-100
          `}
          title={tooltipText}
        >
          {day}
          {hasEvents && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#DDA76A] rounded-full"></span>
          )}
        </div>
      );
    }
    
    return (
      <div>
        {/* Cabeçalho do calendário */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-100"
            title="Mês anterior"
            aria-label="Ir para o mês anterior"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h3 className="font-medium">
            {monthNames[month]} {year}
          </h3>
          
          <button 
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
            title="Próximo mês"
            aria-label="Ir para o próximo mês"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      {renderCalendar()}
    </div>
  );
}
