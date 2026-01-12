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
    </div>
  );
}