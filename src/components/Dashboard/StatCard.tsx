import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: number;
  suffix?: string;
  prefix?: string;
}

export function StatCard({ title, value, icon, trend = 0, suffix = '', prefix = '' }: StatCardProps) {
  const formattedValue = Intl.NumberFormat('pt-BR').format(value);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {prefix}{formattedValue}{suffix}
          </h3>
        </div>
        <div className="p-3 rounded-lg bg-gray-50">
          {icon}
        </div>
      </div>
      
      {trend !== 0 && (
        <div className="mt-4 flex items-center">
          {trend > 0 ? (
            <>
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-xs font-medium text-green-500">
                +{trend}% desde o último mês
              </span>
            </>
          ) : (
            <>
              <TrendingDown size={16} className="text-red-500 mr-1" />
              <span className="text-xs font-medium text-red-500">
                {trend}% desde o último mês
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
