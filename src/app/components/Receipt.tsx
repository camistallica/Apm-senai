import { X, Download } from 'lucide-react';
import { generateReceiptPDF } from './ReceiptGenerator'; // Importe a função que criamos

export function Receipt({ sale, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white max-w-sm w-full shadow-2xl overflow-hidden">
        
        {/* Visual na Tela */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={32} className="rotate-45" /> {/* Ícone de check improvisado */}
          </div>
          <h2 className="text-xl font-black uppercase">Venda Concluída!</h2>
          <p className="text-gray-500 text-xs font-bold uppercase mt-2">O estoque foi atualizado.</p>
          
          <div className="mt-8 flex flex-col gap-2">
            <button 
              onClick={() => generateReceiptPDF('pix-receipt-hidden', `comprovante_${sale.nomeProduto}`)}
              className="w-full py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Download size={14} /> Baixar Comprovante PDF
            </button>
            <button onClick={onClose} className="w-full py-3 font-black text-[10px] uppercase border text-gray-400">
              Fechar Janela
            </button>
          </div>
        </div>

        {/* --- HTML ESCONDIDO (O QUE VIRA O PDF ESTILO PIX) --- */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <div id="pix-receipt-hidden" style={{ 
            width: '300px', 
            padding: '40px 20px', 
            background: '#fff', 
            fontFamily: 'sans-serif',
            color: '#000'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#da291c' }}>SENAI</div>
              <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '3px', marginTop: '5px' }}>APM - GESTÃO DE ESTOQUE</div>
            </div>

            <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
              <span style={{ fontSize: '10px', color: '#666', display: 'block', textTransform: 'uppercase' }}>Valor Total</span>
              <span style={{ fontSize: '32px', fontWeight: '900' }}>R$ {sale.valorTotal.toFixed(2)}</span>
            </div>

            <div style={{ fontSize: '12px', lineHeight: '2' }}>
              <p><strong>PRODUTO:</strong> {sale.nomeProduto}</p>
              <p><strong>QUANTIDADE:</strong> {sale.quantidade} unidades</p>
              <p><strong>DATA:</strong> {new Date(sale.data).toLocaleString()}</p>
              <p><strong>TIPO:</strong> Saída de Material (Venda)</p>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed #ccc', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Comprovante gerado pelo sistema APM</p>
              <p style={{ fontSize: '9px', fontWeight: 'bold', marginTop: '10px' }}>Desenvolvido por Camila Ferreira França</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}