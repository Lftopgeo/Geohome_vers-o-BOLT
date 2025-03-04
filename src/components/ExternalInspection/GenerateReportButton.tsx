import { FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface GenerateReportButtonProps {
  onSave?: () => Promise<void>;
  className?: string;
}

export function GenerateReportButton({ onSave, className = '' }: GenerateReportButtonProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleClick = async () => {
    try {
      if (onSave) {
        await onSave();
      }
      // Navegar para a página de relatório com o ID da inspeção
      navigate(`/relatorio/${id}`);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-6 py-3 bg-[#DDA76A] text-white rounded-lg hover:bg-[#c89355] transition-colors ${className}`}
    >
      <FileText size={20} />
      <span>Gerar Relatório</span>
    </button>
  );
}