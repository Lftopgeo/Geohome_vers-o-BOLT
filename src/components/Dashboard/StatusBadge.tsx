import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import type { InspectionStatus } from '../../types/dashboard';

interface StatusBadgeProps {
  status: InspectionStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true, 
  showLabel = true,
  className = ''
}: StatusBadgeProps) {
  const statusConfig = {
    completed: {
      label: 'Concluído',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    in_progress: {
      label: 'Em Andamento',
      icon: Clock,
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    pending: {
      label: 'Pendente',
      icon: AlertTriangle,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    cancelled: {
      label: 'Cancelado',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 border-red-200'
    }
  };

  const { label, icon: Icon, className: statusClassName } = statusConfig[status];

  // Definir tamanhos com base no prop size
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-2.5',
    lg: 'text-base py-1.5 px-3'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full border ${statusClassName} ${sizeClasses[size]} ${className}`}
      role="status"
    >
      {showIcon && <Icon size={iconSizes[size]} className={showLabel ? 'mr-1' : ''} />}
      {showLabel && <span>{label}</span>}
    </span>
  );
}
