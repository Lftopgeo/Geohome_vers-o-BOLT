import React from 'react';
import { Key } from 'lucide-react';

interface KeyFormProps {
  onSubmit: (data: KeyData) => void;
}

interface KeyData {
  name: string;
  quantity: number;
  room: string;
}

export function KeyForm({ onSubmit }: KeyFormProps) {
  const [formData, setFormData] = React.useState<KeyData>({
    name: '',
    quantity: 1,
    room: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', quantity: 1, room: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#DDA76A]/10 rounded-lg">
          <Key size={24} className="text-[#DDA76A]" />
        </div>
        <h2 className="text-xl font-semibold">Adicionar Chave</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Chave
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ambiente
          </label>
          <select
            value={formData.room}
            onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Selecione o ambiente</option>
            <option value="Sala">Sala</option>
            <option value="Quarto">Quarto</option>
            <option value="Cozinha">Cozinha</option>
            <option value="Banheiro">Banheiro</option>
            <option value="Garagem">Garagem</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#DDA76A] text-white rounded-lg hover:bg-[#c89355]"
          >
            Adicionar Chave
          </button>
        </div>
      </form>
    </div>
  );
}