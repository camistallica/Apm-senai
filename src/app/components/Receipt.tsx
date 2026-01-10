import { Printer, X } from 'lucide-react';

export function Receipt({ sale, onClose }: any) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] no-print-overlay">
      {/* Área do Recibo */}
      <div id="printable-receipt" className="bg-white w-full max-w-sm p-8 shadow-2xl border-t-8 border-gray-800">
        
        <div className="text-center border-b-2 border-dashed border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-black uppercase tracking-tighter">APM SENAI</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comprovante de Venda</p>
        </div>

        <div className="space-y-4 mb-8 text-left">
          <div className="flex justify-between text-xs font-bold uppercase">
            <span className="text-gray-400">Data:</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs font-bold uppercase">
            <span className="text-gray-400">Produto:</span>
            <span className="text-red-600">{sale.nomeProduto}</span>
          </div>
          <div className="flex justify-between text-xs font-bold uppercase">
            <span className="text-gray-400">Quantidade:</span>
            <span>{sale.quantidade} UN</span>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase">Total Pago</span>
            <span className="text-2xl font-black text-gray-900">
              R$ {sale.valorTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Botões (Escondidos na Impressão) */}
        <div className="flex gap-3 print:hidden">
          <button onClick={onClose} className="flex-1 py-3 border font-black uppercase text-[10px]">Fechar</button>
          <button onClick={handlePrint} className="flex-1 py-3 bg-black text-white font-black uppercase text-[10px] flex items-center justify-center gap-2">
            <Printer size={14} /> Imprimir
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          /* Esconde tudo no site */
          body * { visibility: hidden; }
          /* Mostra apenas a div do recibo e seus filhos */
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            border: none !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}