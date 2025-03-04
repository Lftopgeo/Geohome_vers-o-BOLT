import React from 'react';
import { Bell, User } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        {/* Notificações */}
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              3
            </span>
          </button>
        </div>
        
        {/* Avatar do usuário */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#19384A] flex items-center justify-center text-white mr-2">
            <User size={20} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">João Pereira</p>
            <p className="text-xs text-gray-500">Inspetor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
