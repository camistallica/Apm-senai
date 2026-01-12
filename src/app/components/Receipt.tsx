import { CheckCircle, Download, X } from 'lucide-react';
import { generateReceiptPDF } from './ReceiptGenerator';

export function Receipt({ sale, onClose }: any) {
  // Função para lidar com o download
  const handleDownload = () => {
    generateReceiptPDF('pix-receipt-hidden', `comprovante_${sale.nomeProduto}`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* 1. INTERFACE VISUAL (O QUE VOCÊ VÊ NA TELA) */}
      <div className="bg-white max-w-sm w-full shadow-2xl overflow-hidden border-t-8 border-green-500">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          
          <h2 className="text-xl font-black uppercase tracking-tighter text-gray-800">Venda Sucesso!</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">O estoque foi baixado com êxito.</p>

          <div className="mt-8 space-y-3">
            <button 
              onClick={handleDownload}
              className="w-full py-4 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gray-900 active:scale-95 transition-all"
            >
              <Download size={16} /> Baixar Comprovante PDF
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-3 font-black text-[10px] uppercase border-2 border-gray-100 text-gray-400 hover:bg-gray-50 transition-all"
            >
              Fechar e Voltar
            </button>
          </div>
        </div>

        {/* 2. ESTRUTURA DO PDF (FICA ESCONDIDO NA TELA) */}
        {/* Usamos left: -9999px para que o html2canvas consiga "enxergar" e fotografar */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <div id="pix-receipt-hidden" style={{ 
            width: '320px', 
            padding: '40px 25px', 
            background: '#fff', 
            fontFamily: 'sans-serif',
            color: '#000'
          }}>
            {/* Cabeçalho do Comprovante */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#da291c', margin: 0, letterSpacing: '-1px' }}>SENAI</h1>
              <p style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '2px', color: '#666', marginTop: '4px' }}>AAPM - GESTÃO ESCOLAR</p>
            </div>

            {/* Valor Principal */}
            <div style={{ marginBottom: '25px', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Valor da Transação</span>
              <div style={{ fontSize: '36px', fontWeight: '900', marginTop: '5px' }}>R$ {sale.valorTotal.toFixed(2)}</div>
            </div>

            {/* Detalhes da Venda */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <span style={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', fontWeight: '800' }}>Produto</span>
                <p style={{ fontSize: '13px', fontWeight: '700', margin: '2px 0' }}>{sale.nomeProduto}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', fontWeight: '800' }}>Quantidade</span>
                  <p style={{ fontSize: '13px', fontWeight: '700', margin: '2px 0' }}>{sale.quantidade} un</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', fontWeight: '800' }}>Preço Unit.</span>
                  <p style={{ fontSize: '13px', fontWeight: '700', margin: '2px 0' }}>R$ {sale.precoUnitario.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', fontWeight: '800' }}>Data e Hora</span>
                <p style={{ fontSize: '13px', fontWeight: '700', margin: '2px 0' }}>{new Date(sale.data).toLocaleString('pt-BR')}</p>
              </div>

              <div>
                <span style={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', fontWeight: '800' }}>Vendedor Autorizado</span>
                <p style={{ fontSize: '13px', fontWeight: '700', margin: '2px 0' }}>{sale.vendedor || 'Sistema APM'}</p>
              </div>
            </div>

            {/* Rodapé de Autenticidade */}
            <div style={{ marginTop: '50px', paddingTop: '25px', borderTop: '1px dashed #ccc', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: '800', marginBottom: '15px' }}>Comprovante gerado com sucesso</p>
              
              <div style={{ background: '#f9f9f9', padding: '10px', fontSize: '9px', color: '#777', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                AUTENTICAÇÃO: {Math.random().toString(36).toUpperCase().substring(2, 18)}
              </div>

              <div style={{ marginTop: '25px' }}>
                <p style={{ fontSize: '9px', fontWeight: '900', color: '#000', margin: 0 }}>Desenvolvido por Camila Ferreira França</p>
                <p style={{ fontSize: '8px', color: '#da291c', fontWeight: '700' }}>AAPM SENAI 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}