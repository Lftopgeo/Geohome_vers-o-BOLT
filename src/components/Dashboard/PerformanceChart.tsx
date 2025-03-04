import React, { useEffect, useRef } from 'react';
import type { ChartData } from '../../types/dashboard';

interface PerformanceChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartData;
  height?: number;
}

export function PerformanceChart({ type, data, height = 250 }: PerformanceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  // Cores padrão para os gráficos
  const defaultColors = [
    '#19384A', // Azul escuro (primário)
    '#DDA76A', // Dourado (secundário)
    '#4A9D9F', // Azul esverdeado
    '#E57373', // Vermelho claro
    '#64B5F6', // Azul claro
    '#81C784', // Verde claro
    '#FFD54F', // Amarelo
    '#9575CD', // Roxo
    '#4DB6AC', // Turquesa
    '#F06292'  // Rosa
  ];

  useEffect(() => {
    // Importar Chart.js dinamicamente para evitar erros de SSR
    const loadChart = async () => {
      try {
        if (chartRef.current) {
          const Chart = (await import('chart.js/auto')).default;
          
          // Destruir o gráfico anterior se existir
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          // Configurar dados do gráfico
          const chartData = {
            labels: data.labels,
            datasets: [
              {
                label: 'Dados',
                data: data.values,
                backgroundColor: data.colors || defaultColors,
                borderColor: type === 'line' ? '#19384A' : data.colors || defaultColors,
                borderWidth: 1,
                tension: 0.4,
                borderRadius: type === 'bar' ? 4 : undefined,
              }
            ]
          };

          // Configurações específicas para cada tipo de gráfico
          const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: ['pie', 'doughnut'].includes(type),
                position: 'bottom' as const,
                labels: {
                  font: {
                    size: 12
                  },
                  padding: 20
                }
              },
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(25, 56, 74, 0.8)',
                titleFont: {
                  size: 14
                },
                bodyFont: {
                  size: 13
                },
                padding: 12,
                cornerRadius: 6
              }
            },
            scales: ['bar', 'line'].includes(type) ? {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    size: 11
                  }
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                  font: {
                    size: 11
                  }
                }
              }
            } : undefined
          };

          // Criar novo gráfico
          chartInstance.current = new Chart(chartRef.current, {
            type,
            data: chartData,
            options
          });
        }
      } catch (error) {
        console.error("Erro ao carregar Chart.js:", error);
      }
    };

    loadChart();

    // Limpar ao desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data]);

  return (
    <div style={{ height: `${height}px` }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
