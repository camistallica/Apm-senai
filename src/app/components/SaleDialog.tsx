import { useState } from 'react';
import { X, Printer } from 'lucide-react';
import { db } from '../../firebase';
import { doc, updateDoc, collection, addDoc, increment } from 'firebase/firestore';
import { Receipt } from './Receipt';

export function SaleDialog({ product, onSale, onCancel, usuario }: any) {
  const [quantidade, setQuantidade] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedData, setCompletedData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantidade > 0 && product.quantidade >= quantidade) {
      const saleData = {
        produtoId: product.id,
        nomeProduto: product.nome,
        quantidade: quantidade,
        valorTotal: quantidade * product.preco,
        precoUnitario: product.preco, // Adicionado para o recibo
        custoUnitario: product.custoUnitario,
        data: new Date()
      };


      await addDoc(collection(db, "vendas"), saleData);
      await updateDoc(doc(db, "produtos", product.id), {
        quantidade: increment(-quantidade)
      });

      setCompletedData(saleData);
      setShowReceipt(true);
    }
  };

  if (showReceipt) return <Receipt sale={completedData} onClose={onSale} />;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white max-w-sm w-full border-t-8 border-[#da291c] shadow-2xl">
        <div className="p-6">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4">Registrar Venda</h3>
          <p className="text-xs font-bold text-gray-500 mb-1 uppercase">Item: {product.nome}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="number" 
              value={quantidade} 
              onChange={e => setQuantidade(Number(e.target.value))}
              max={product.quantidade}
              className="w-full p-3 bg-gray-50 border-2 border-gray-100 font-black"
            />
            <div className="bg-gray-100 p-4 border-l-4 border-red-600">
              <p className="text-[10px] font-black uppercase text-gray-400">Total a Pagar</p>
              <p className="text-2xl font-black text-gray-900">R$ {(quantidade * product.preco).toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onCancel} className="flex-1 py-3 font-black text-[10px] uppercase border">Cancelar</button>
              <button type="submit" className="flex-1 py-3 bg-[#da291c] text-white font-black text-[10px] uppercase">Confirmar</button>
            </div>
          </form>
        </div>
      </div>
      {/* Container invisível para o PDF */}
<div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
  <div id="pix-receipt" style={{ 
    width: '320px', 
    padding: '30px', 
    background: '#fff', 
    color: '#000',
    fontFamily: 'sans-serif' 
  }}>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>AAPM SENAI</h2>
      <p style={{ fontSize: '10px', letterSpacing: '2px' }}>COMPROVANTE DE ENTREGA</p>
    </div>

    <div style={{ borderTop: '1px dashed #eee', paddingTop: '15px', fontSize: '13px' }}>
      <p style={{ marginBottom: '8px' }}><strong>VALOR:</strong> R$ {product.preco.toFixed(2)}</p>
      <p style={{ marginBottom: '8px' }}><strong>DATA:</strong> {new Date().toLocaleString()}</p>
      <p style={{ marginBottom: '8px' }}><strong>PRODUTO:</strong> {product.nome}</p>
      <p style={{ marginBottom: '8px' }}><strong>VENDEDOR:</strong> {usuario}</p>
    </div>

    <div style={{ marginTop: '30px', textAlign: 'center' }}>
      <div style={{ background: '#f5f5f5', padding: '10px', fontSize: '10px' }}>
        Código: {Math.random().toString(36).toUpperCase().substring(2, 15)}
      </div>
    </div>

    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '9px', color: '#999' }}>
      <p>Desenvolvido por Camila Ferreira França</p>
      <p>© 2026 - Sistema AAPM</p>
    </div>
  </div>
</div>
    </div>
  );
}