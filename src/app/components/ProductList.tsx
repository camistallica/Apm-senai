import { Edit2, Trash2, ShoppingCart } from 'lucide-react';

export function ProductList({ products, onEdit, onSale, onDelete }: any) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b text-[10px] font-black uppercase text-gray-400">
          <tr>
            <th className="p-4">Descrição do Material</th>
            <th className="p-4 text-center">Estoque</th>
            <th className="p-4 text-right">Custo de Aquisição (UN)</th> {/* Nova Coluna */}
            <th className="p-4 text-right">Preço (UN)</th>
            <th className="p-4 text-right px-8">Ações de Controle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs font-bold uppercase">
          {products.map((product: any) => {
            const isLowStock = Number(product.quantidade) <= Number(product.estoqueMinimo);
            
            return (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4 text-gray-800 font-black">{product.nome}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 inline-block min-w-[40px] ${
                    isLowStock ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-white'
                  }`}>
                    {product.quantidade}
                  </span>
                </td>
                {/* Visualização do Custo de Aquisição */}
                <td className="p-4 text-right text-gray-400 font-medium">
                  R$ {Number(product.custoUnitario || 0).toFixed(2)}
                </td>
                <td className="p-4 text-right text-gray-900">
                  R$ {Number(product.preco).toFixed(2)}
                </td>
                <td className="p-4 text-right px-8 space-x-2">
                  <button 
                    onClick={() => onSale(product)}
                    className="bg-[#da291c] text-white px-3 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition flex-inline items-center gap-2"
                  >
                    <ShoppingCart size={12} className="inline mr-1"/> Vender
                  </button>
                  <button 
                    onClick={() => onEdit(product)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition border border-transparent hover:border-gray-200"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition border border-transparent hover:border-gray-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}