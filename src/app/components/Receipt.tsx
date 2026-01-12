import { X, Download, CheckCircle } from 'lucide-react';
import { generateReceiptPDF } from './ReceiptGenerator'; // Importe a função que criamos

export function Receipt({ sale, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* 1. O QUE APARECE NA TELA (O CARD BRANCO) */}
      <div className="bg-white max-w-sm w-full shadow-2xl p-8 text-center border-t-8 border-green-500">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-xl font-black uppercase">Venda Registrada!</h2>
        
        <div className="mt-8 flex flex-col gap-2">
          {/* BOTÃO QUE CHAMA A FUNÇÃO DO PDF */}
          <button 
            onClick={() => generateReceiptPDF('pix-receipt', `recibo_${sale.nomeProduto}`)}
            className="w-full py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition"
          >
            <Download size={14} /> Baixar Comprovante (PDF)
          </button>
          
          <button onClick={onClose} className="w-full py-3 font-black text-[10px] uppercase border text-gray-400 hover:bg-gray-50">
            Voltar ao Início
          </button>
        </div>
      </div>

      {/* 2. O QUE VAI PRO PDF (FICA ESCONDIDO NA TELA) */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div id="pix-receipt" style={{ 
          width: '320px', 
          padding: '40px 20px', 
          background: '#fff', 
          fontFamily: 'sans-serif',
          color: '#000'
        }}>
          {/* O layout estilo PIX que definimos anteriormente */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
             <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#da291c', margin: 0 }}>APM SENAI</h2>
             <p style={{ fontSize: '9px', letterSpacing: '2px', fontWeight: 'bold' }}>COMPROVANTE OFICIAL</p>
          </div>

          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Valor Total</p>
            <p style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>R$ {sale.valorTotal.toFixed(2)}</p>
          </div>

          <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
            <p><strong>ITEM:</strong> {sale.nomeProduto}</p>
            <p><strong>QUANTIDADE:</strong> {sale.quantidade} un</p>
            <p><strong>DATA:</strong> {new Date().toLocaleString('pt-BR')}</p>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
             <p style={{ fontSize: '9px', fontWeight: 'bold' }}>Desenvolvido por Camila Ferreira França</p>
             <p style={{ fontSize: '8px', color: '#999' }}>ID: {Math.random().toString(36).toUpperCase().substring(2, 10)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}