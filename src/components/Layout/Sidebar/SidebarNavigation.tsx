import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Settings,
  Users
} from 'lucide-react';

interface SidebarNavigationProps {
  currentPath: string;
}

const navigationItems = [
  {
    title: 'Principal',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Nova Vistoria', icon: ClipboardList, path: '/nova-vistoria' }
    ]
  },
  {
    title: 'Sistema',
    items: [
      { name: 'Configurações', icon: Settings, path: '/configuracoes' },
      { name: 'Usuários', icon: Users, path: '/usuarios' }
    ]
  }
];

export function SidebarNavigation({ currentPath }: SidebarNavigationProps) {
  return (
    <nav className="flex-1 overflow-y-auto py-4">
      {navigationItems.map((section, index) => (
        <div key={index} className="px-4 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {section.title}
          </h2>
          <ul className="space-y-1">
            {section.items.map((item, itemIndex) => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              
              return (
                <li key={itemIndex}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-[#DDA76A] text-white' 
                        : 'text-gray-300 hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}