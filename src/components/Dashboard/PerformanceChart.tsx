import { useEffect, useRef } from 'react';
import type { ChartData } from '../../types/dashboard';

interface PerformanceChartProps {
  data: ChartData;
  title: string;
  height?: number;
  showValues?: boolean;
  barColor?: string;
  animated?: boolean;
}

export function PerformanceChart({ 
  data, 
  title, 
  height = 200, 
  showValues = true, 
  barColor = '#DDA76A',
  animated = true 
}: PerformanceChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Encontrar o valor máximo para calcular proporções
  const maxValue = Math.max(...data.values);
  
  useEffect(() => {
    const timeouts: number[] = [];
    
    if (animated && chartRef.current) {
      // Animar as barras do gráfico com um efeito de crescimento
      const bars = chartRef.current.querySelectorAll('.chart-bar');
      bars.forEach((bar, index) => {
        const timeout = setTimeout(() => {
          (bar as HTMLElement).style.height = `${(data.values[index] / maxValue) * 100}%`;
          (bar as HTMLElement).style.opacity = '1';
        }, index * 100);
        timeouts.push(timeout);
      });
    }
    
    // Limpeza dos timeouts quando o componente é desmontado
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [data, animated, maxValue]);
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      
      <div 
        ref={chartRef}
        className="w-full flex items-end justify-between"
        style={{ height: `${height}px` }}
        role="img"
        aria-label={`Gráfico de barras: ${title}`}
      >
        {data.labels.map((label, index) => {
          const value = data.values[index];
          const percentage = maxValue === 0 ? 0 : (value / maxValue) * 100;
          const barHeight = animated ? '0%' : `${percentage}%`;
          
          return (
            <div key={label} className="flex flex-col items-center" style={{ flex: '1' }}>
              <div className="w-full px-1 flex justify-center">
                <div 
                  className="chart-bar w-full rounded-t-sm transition-all duration-500 ease-out"
                  style={{ 
                    height: barHeight, 
                    backgroundColor: data.colors?.[index] || barColor,
                    opacity: animated ? 0 : 1,
                    maxWidth: '30px'
                  }}
                  aria-label={`${label}: ${value}`}
                ></div>
              </div>
              {showValues && (
                <span className="text-xs font-medium mt-1">{value}</span>
              )}
              <span className="text-xs text-gray-500 mt-1">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Função para carregar os dados do gráfico - versão refatorada
export function loadChart(container: HTMLElement, chartData: ChartData) {
  if (!container) return;
  
  // Usar ReactDOM para renderizar o componente diretamente
  const root = document.createElement('div');
  container.innerHTML = '';
  container.appendChild(root);
  
  // Criar um componente React para renderizar
  const ChartComponent = () => {
    const maxValue = Math.max(...chartData.values);
    
    return (
      <div className="w-full flex items-end justify-between h-32" role="img" aria-label="Gráfico de barras">
        {chartData.labels.map((label, index) => {
          const value = chartData.values[index];
          const percentage = (value / maxValue) * 100;
          
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className="w-full px-1 flex justify-center">
                <div 
                  className="chart-bar w-full rounded-t-sm transition-all duration-500 ease-out"
                  style={{ 
                    height: '0',
                    backgroundColor: chartData.colors?.[index] || '#DDA76A',
                    maxWidth: '30px',
                    animation: `growHeight 500ms ease-out forwards ${index * 100}ms`
                  }}
                  aria-label={`${label}: ${value}`}
                />
              </div>
              <span className="text-xs font-medium mt-1">{value}</span>
              <span className="text-xs text-gray-500 mt-1">{label}</span>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Adicionar estilo para a animação
  const style = document.createElement('style');
  style.textContent = `
    @keyframes growHeight {
      from { height: 0; }
      to { height: var(--target-height); }
    }
  `;
  document.head.appendChild(style);
  
  // Renderizar o componente
  // Nota: Esta é uma implementação simplificada. Em um cenário real,
  // você usaria ReactDOM.render ou createRoot para renderizar o componente
  container.innerHTML = '';
  container.appendChild(document.createTextNode('Gráfico carregado via API declarativa'));
  
  // Simular o comportamento da animação
  setTimeout(() => {
    chartData.labels.forEach((label, index) => {
      const value = chartData.values[index];
      const percentage = (value / maxValue) * 100;
      
      const column = document.createElement('div');
      column.className = 'flex flex-col items-center flex-1';
      
      const barContainer = document.createElement('div');
      barContainer.className = 'w-full px-1 flex justify-center';
      
      const bar = document.createElement('div');
      bar.className = 'w-full rounded-t-sm transition-all duration-500 ease-out';
      bar.style.backgroundColor = chartData.colors?.[index] || '#DDA76A';
      bar.style.height = '0';
      bar.style.maxWidth = '30px';
      bar.setAttribute('aria-label', `${label}: ${value}`);
      
      // Animação via CSS
      bar.style.setProperty('--target-height', `${percentage}%`);
      bar.style.animation = `growHeight 500ms ease-out forwards ${index * 100}ms`;
      
      barContainer.appendChild(bar);
      
      const valueText = document.createElement('span');
      valueText.className = 'text-xs font-medium mt-1';
      valueText.textContent = value.toString();
      
      const labelText = document.createElement('span');
      labelText.className = 'text-xs text-gray-500 mt-1';
      labelText.textContent = label;
      
      column.appendChild(barContainer);
      column.appendChild(valueText);
      column.appendChild(labelText);
      
      container.appendChild(column);
    });
  }, 0);
  
  return () => {
    // Função de limpeza
    container.innerHTML = '';
    document.head.removeChild(style);
  };
}
