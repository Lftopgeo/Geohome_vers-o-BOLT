import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AreaCard } from './AreaCard';
import { Home, Building2, Key } from 'lucide-react';

export function AreaSelector() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Definir as áreas com caminhos dinâmicos que incluem o ID da inspeção
  const areas = [
    {
      id: 'internal',
      title: 'Ambiente Interno',
      icon: Home,
      description: 'Quartos, salas, cozinha, banheiros e demais áreas internas',
      path: `/ambiente-interno/${id}`,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80'
    },
    {
      id: 'external',
      title: 'Ambiente Externo',
      icon: Building2,
      description: 'Fachada, jardim, garagem e áreas comuns',
      path: `/ambiente-externo/${id}`,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80'
    },
    {
      id: 'keys',
      title: 'Chaves e Medidores',
      icon: Key,
      description: 'Chaves, medidores de água, luz e gás',
      path: `/chaves-medidores/${id}`,
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80'
    }
  ];

  const handleAreaSelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {areas.map((area) => (
        <AreaCard
          key={area.id}
          {...area}
          onClick={() => handleAreaSelect(area.path)}
        />
      ))}
    </div>
  );
}