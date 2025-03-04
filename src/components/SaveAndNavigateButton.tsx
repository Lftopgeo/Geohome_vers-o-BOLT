import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SaveAndNavigateButtonProps {
  onSave?: () => Promise<void>;
  className?: string;
}

export function SaveAndNavigateButton({ onSave, className = '' }: SaveAndNavigateButtonProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleClick = async () => {
    try {
      if (onSave) {
        await onSave();
      }
      // Navega para a página de ambiente externo com o ID da inspeção
      navigate(`/ambiente-externo/${id}`);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-6 py-3 bg-[#DDA76A] text-white rounded-lg hover:bg-[#c89355] transition-colors ${className}`}
    >
      <span>Continuar para Ambiente Externo</span>
      <ArrowRight size={20} />
    </button>
  );
}