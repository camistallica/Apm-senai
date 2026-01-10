import { AlertTriangle, Package } from 'lucide-react';
import { Product } from './Dashboard';

interface StockAlertsProps {
  products: Product[];
}

export function StockAlerts({ products }: StockAlertsProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Package className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum alerta de estoque
        </h3>
        <p className="text-gray-600">
          Todos os produtos estão com estoque adequado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800 mb-1">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">Atenção!</span>
        </div>
        <p className="text-sm text-red-700">
          {products.length} {products.length === 1 ? 'produto está' : 'produtos estão'} com estoque baixo ou zerado. Considere fazer reposição.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Produtos com Estoque Baixo</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {products.map((product) => (
            <div key={product.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.nome}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Quantidade atual: <span className="font-medium text-red-600">{product.quantidade}</span>
                      </span>
                      <span className="text-gray-600">
                        Estoque mínimo: <span className="font-medium">{product.estoqueMinimo}</span>
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Necessário repor: <span className="font-medium text-red-600">
                        {Math.max(0, product.estoqueMinimo - product.quantidade)} unidades
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {product.quantidade === 0 ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Esgotado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Estoque Baixo
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
