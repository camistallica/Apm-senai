import { useMemo } from 'react';
import { TrendingUp, Wallet, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export function FinancialSummary({ sales, products }: any) {
  
  // 1. Filtragem Reativa: Considera apenas vendas de produtos que ainda existem
  const activeSales = useMemo(() => {
    return sales.filter((sale: any) => 
      products.some((p: any) => p.id === sale.produtoId)
    );
  }, [sales, products]);

  // 2. Recálculo dos Totais baseado apenas nas vendas visíveis
  const totals = useMemo(() => {
    const vendasBrutas = activeSales.reduce((acc: number, s: any) => acc + (Number(s.valorTotal) || 0), 0);
    const custosTotal = activeSales.reduce((acc: number, s: any) => acc + (Number(s.quantidade) * (Number(s.custoUnitario) || 0)), 0);
    return {
      vendasBrutas,
      custosTotal,
      lucroLiquido: vendasBrutas - custosTotal
    };
  }, [activeSales]);

  const exportToExcel = () => {
    const data = activeSales.map((s: any) => {
      const p = products.find((prod: any) => prod.id === s.produtoId);
      return {
        Data: s.data?.toDate ? s.data.toDate().toLocaleDateString() : '10/01/2026',
        Produto: p?.nome || 'Excluído',
        Quantidade: s.quantidade,
        'Valor Total': s.valorTotal,
        Lucro: s.valorTotal - (s.quantidade * (s.custoUnitario || 0))
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio_Vendas");
    XLSX.writeFile(wb, "Movimentacao_AAPM_SENAI.xlsx");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Cards de Resumo Industrial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Vendas Brutas" 
          value={totals.vendasBrutas} 
          icon={<TrendingUp className="text-blue-600" />} 
          color="border-l-blue-600"
        />
        <StatCard 
          label="Custo de Aquisição" 
          value={totals.custosTotal} 
          icon={<Wallet className="text-gray-600" />} 
          color="border-l-gray-800"
        />
        <StatCard 
          label="Lucro Líquido" 
          value={totals.lucroLiquido} 
          icon={<ArrowUpRight className="text-red-600" />} 
          color="border-l-[#da291c]"
          isHighlight
        />
      </div>

      {/* Tabela de Histórico */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-black uppercase text-[10px] tracking-widest text-gray-500 italic">Histórico de Movimentação</h2>
          <button 
            onClick={exportToExcel}
            className="bg-[#da291c] text-white px-4 py-2 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition"
          >
            <FileSpreadsheet size={14} /> Exportar Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] font-black uppercase text-gray-400">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Produto</th>
                <th className="p-4 text-center">Qtd</th>
                <th className="p-4 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold uppercase divide-y divide-gray-100">
              {activeSales.length > 0 ? (
                activeSales.map((sale: any) => {
                  const product = products.find((p: any) => p.id === sale.produtoId);
                  return (
                    <tr key={sale.id} className="hover:bg-red-50/20 transition">
                      <td className="p-4 text-gray-400 font-medium">
                        {sale.data?.toDate ? sale.data.toDate().toLocaleDateString() : '10/01/2026'}
                      </td>
                      <td className="p-4 font-black text-gray-800">{product?.nome}</td>
                      <td className="p-4 text-center">{sale.quantidade}</td>
                      <td className="p-4 text-right text-red-600">R$ {sale.valorTotal.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-300 italic">Nenhuma movimentação ativa encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, isHighlight }: any) {
  return (
    <div className={`bg-white p-6 border border-gray-200 border-l-[6px] ${color} shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div className={`text-2xl font-black tracking-tighter ${isHighlight ? 'text-gray-900' : 'text-gray-800'}`}>
        R$ {value.toFixed(2)}
      </div>
    </div>
  );
}