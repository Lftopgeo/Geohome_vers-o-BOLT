export function InspectionDetails() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Dados da Vistoria</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Vistoria
          </label>
          <select className="w-full px-3 py-2 border rounded-lg" required>
            <option value="">Selecione o tipo</option>
            <option value="entrada">Vistoria de Entrada</option>
            <option value="saida">Vistoria de Saída</option>
            <option value="periodica">Vistoria Periódica</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Preferencial
          </label>
          <input
            type="date"
            name="inspectionDate"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        
        {/* Novos campos: Nome do Vistoriador e CRECI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Vistoriador <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="inspectorName"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Nome completo do vistoriador"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CRECI <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="creciNumber"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Número do CRECI"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Informe o número de registro no Conselho Regional de Corretores de Imóveis
          </p>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            name="observations"
            className="w-full px-3 py-2 border rounded-lg h-32"
            placeholder="Descreva aqui informações importantes sobre a vistoria, como condições especiais do imóvel, restrições de acesso, ou qualquer outra observação relevante para o relatório."
          ></textarea>
        </div>
      </div>
    </div>
  );
}