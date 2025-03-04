import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { AreaSelector } from '../components/InspectionAreas/AreaSelector';
import { getInspectionById, Inspection } from '../services/inspectionService';

export function InspectionAreasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInspection() {
      if (!id) {
        setError('ID da inspeção não encontrado');
        setLoading(false);
        return;
      }

      try {
        const data = await getInspectionById(id);
        
        if (!data) {
          setError('Inspeção não encontrada');
        } else {
          setInspection(data);
        }
      } catch (err) {
        setError('Erro ao carregar dados da inspeção');
        console.error('Erro ao carregar inspeção:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInspection();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#19384A]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Erro</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => navigate('/nova-vistoria')}
                className="px-4 py-2 bg-[#19384A] text-white rounded-lg hover:bg-[#0f2a3d] transition-colors"
              >
                Voltar para Nova Vistoria
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Ambientes da Vistoria</h1>
                <div className="text-right">
                  <h2 className="text-lg font-medium text-[#19384A]">{inspection?.propertyName}</h2>
                  <p className="text-sm text-gray-600">{inspection?.address}, {inspection?.city}</p>
                </div>
              </div>
              <AreaSelector />
            </>
          )}
        </div>
      </main>
    </div>
  );
}