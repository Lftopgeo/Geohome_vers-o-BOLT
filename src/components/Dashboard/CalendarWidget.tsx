import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import type { InspectionSummary } from '../../types/dashboard';

interface CalendarWidgetProps {
  inspections: InspectionSummary[];
}

export function CalendarWidget({ inspections }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<JSX.Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
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
  
  // Obter inspeções para uma data específica
  const getInspectionsForDate = (date: Date) => {
    return inspections.filter(inspection => {
      const inspDate = new Date(inspection.date);
      return (
        inspDate.getDate() === date.getDate() &&
        inspDate.getMonth() === date.getMonth() &&
        inspDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Função para mostrar o tooltip
  const showInspectionTooltip = (event: React.MouseEvent | null, date: Date) => {
    const dateInspections = getInspectionsForDate(date);
    
    if (dateInspections.length > 0) {
      // Armazenar o conteúdo do tooltip como um objeto React
      setTooltipContent(
        <div>
          <p className="font-medium mb-1">{date.toLocaleDateString('pt-BR')}</p>
          <p className="text-sm mb-2">{dateInspections.length} vistoria(s):</p>
          <ul className="text-xs list-disc pl-4">
            {dateInspections.map(insp => (
              <li key={insp.id}>{insp.address.split(',')[0]}</li>
            ))}
          </ul>
        </div>
      );
      
      if (event) {
        // Calcular posição do tooltip considerando os limites da tela
        const tooltipWidth = 250; // Largura máxima do tooltip
        const tooltipHeight = 150; // Altura estimada do tooltip
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let x = event.clientX + 10;
        let y = event.clientY + 10;
        
        // Ajustar posição horizontal se estiver perto da borda direita
        if (x + tooltipWidth > windowWidth) {
          x = windowWidth - tooltipWidth - 10;
        }
        
        // Ajustar posição vertical se estiver perto da borda inferior
        if (y + tooltipHeight > windowHeight) {
          y = windowHeight - tooltipHeight - 10;
        }
        
        // Posicionar o tooltip
        setTooltipPosition({ x, y });
      }
      
      setShowTooltip(true);
    }
  };
  
  // Fechar o tooltip
  const hideTooltip = () => {
    setShowTooltip(false);
  };
  
  // Gerenciar navegação por teclado
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, date: Date) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setSelectedDate(date);
        showInspectionTooltip(null, date);
        break;
      case 'Escape':
        event.preventDefault();
        setSelectedDate(null);
        hideTooltip();
        break;
      default:
        break;
    }
  };
  
  // Efeito para fechar o tooltip quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        hideTooltip();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
      days.push(
        <div 
          key={`empty-${i}`} 
          className="h-8 w-8"
          role="presentation"
        ></div>
      );
    }
    
    // Adicionar dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const hasEvents = hasInspections(date);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`
            h-8 w-8 flex items-center justify-center rounded-full text-sm
            ${isToday ? 'bg-[#DDA76A] text-white' : ''}
            ${hasEvents && !isToday ? 'font-bold' : ''}
            ${isSelected ? 'ring-2 ring-[#DDA76A] ring-offset-2' : ''}
            ${!isToday && !hasEvents ? 'text-gray-700' : ''}
            relative cursor-pointer hover:bg-gray-100 transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#DDA76A] focus:ring-offset-2
          `}
          onClick={(e) => {
            setSelectedDate(date);
            if (hasEvents) {
              showInspectionTooltip(e, date);
            }
          }}
          onMouseEnter={(e) => hasEvents && showInspectionTooltip(e, date)}
          onMouseLeave={hideTooltip}
          onKeyDown={(e) => handleKeyDown(e, date)}
          role="button"
          tabIndex={0}
          aria-label={`${day} de ${monthNames[month]} de ${year}${hasEvents ? `, ${getInspectionsForDate(date).length} vistorias agendadas` : ''}`}
          aria-selected={isSelected}
        >
          {day}
          {hasEvents && (
            <span 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#DDA76A] rounded-full" 
              aria-hidden="true"
            ></span>
          )}
        </div>
      );
    }
    
    return (
      <div ref={calendarRef}>
        {/* Cabeçalho do calendário */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#DDA76A]"
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
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#DDA76A]"
            title="Próximo mês"
            aria-label="Ir para o próximo mês"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2" role="rowgroup">
          {weekdays.map(day => (
            <div 
              key={day} 
              className="text-center text-xs font-medium text-gray-500"
              aria-hidden="true"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Dias do mês */}
        <div 
          className="grid grid-cols-7 gap-1" 
          role="grid"
          aria-label={`Calendário de ${monthNames[month]} de ${year}`}
        >
          {days}
        </div>
        
        {/* Legenda */}
        <div className="mt-4 flex items-center text-xs text-gray-500">
          <Info size={12} className="mr-1" />
          <span>Clique nos dias com pontos para ver detalhes das vistorias</span>
        </div>
        
        {/* Tooltip */}
        {showTooltip && (
          <div 
            ref={tooltipRef}
            className="absolute z-10 p-3 bg-white shadow-lg rounded-lg border border-gray-200 text-left"
            style={{
              top: `${tooltipPosition.y + 10}px`,
              left: `${tooltipPosition.x + 10}px`,
              maxWidth: '250px'
            }}
            role="tooltip"
          >
            <div className="text-sm">
              {tooltipContent}
            </div>
            <button 
              className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
              onClick={hideTooltip}
              aria-label="Fechar informações"
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="relative">
      {renderCalendar()}
    </div>
  );
}
