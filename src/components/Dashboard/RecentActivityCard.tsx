import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  Bell, 
  Plus, 
  Edit 
} from 'lucide-react';
import type { Activity } from '../../types/dashboard';

interface RecentActivityCardProps {
  activity: Activity;
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  // Formatar data relativa (ex: "há 2 horas")
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return 'agora mesmo';
    if (diffMin < 60) return `há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    if (diffHour < 24) return `há ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
    return `há ${diffDay} ${diffDay === 1 ? 'dia' : 'dias'}`;
  };

  // Configuração de ícones e cores por tipo de atividade
  const activityConfig = {
    inspection_created: {
      icon: <Plus size={16} className="text-blue-500" />,
      bgColor: 'bg-blue-100'
    },
    inspection_updated: {
      icon: <Edit size={16} className="text-purple-500" />,
      bgColor: 'bg-purple-100'
    },
    inspection_completed: {
      icon: <CheckCircle size={16} className="text-green-500" />,
      bgColor: 'bg-green-100'
    },
    report_generated: {
      icon: <FileText size={16} className="text-indigo-500" />,
      bgColor: 'bg-indigo-100'
    },
    client_feedback: {
      icon: <MessageSquare size={16} className="text-yellow-500" />,
      bgColor: 'bg-yellow-100'
    },
    system_notification: {
      icon: <Bell size={16} className="text-red-500" />,
      bgColor: 'bg-red-100'
    }
  };

  const config = activityConfig[activity.type];

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex">
        <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center mr-3 flex-shrink-0`}>
          {config.icon}
        </div>
        
        <div>
          <p className="text-sm text-gray-800 mb-1">
            {activity.description}
          </p>
          
          <div className="flex items-center text-xs text-gray-500">
            <span>{activity.user}</span>
            <span className="mx-1">•</span>
            <span>{getRelativeTime(activity.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
