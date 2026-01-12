import { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, doc, writeBatch } from 'firebase/firestore';
import { ProductList } from './ProductList';
import { ProductEditor } from './ProductEditor';
import { StockAlerts } from './StockAlerts';
import { FinancialSummary } from './FinancialSummary';
import { SaleDialog } from './SaleDialog';
import { AdminDashboard } from './AdminDashboard';
import { LogOut, Package, TrendingUp, AlertTriangle, ShieldCheck, Plus } from 'lucide-react';

export interface Product {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  custoUnitario: number;
  estoqueMinimo: number;
}

export interface Sale {
  id: string;
  produtoId: string;
  quantidade: number;
  valorTotal: number;
  data: any;
  custoUnitario: number;
}

const handleDelete = async (id: string) => {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../../firebase'); // ajuste o caminho se necessário
      await deleteDoc(doc(db, "produtos", id));
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    }
  }
};

const initialProducts = [
  { nome: 'Bolinha de pingpong', quantidade: 150, preco: 2.50, custoUnitario: 1.20, estoqueMinimo: 50 },
  { nome: 'Raquete de pingpong', quantidade: 25, preco: 45.00, custoUnitario: 28.00, estoqueMinimo: 10 },
  { nome: 'Caderno 200 folhas', quantidade: 8, preco: 18.00, custoUnitario: 12.00, estoqueMinimo: 20 },
];

export function Dashboard({ usuario, onLogout }: { usuario: string, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'products' | 'alerts' | 'financial' | 'admin'>('financial');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [saleProduct, setSaleProduct] = useState<any>(null);
  
  const isMasterAdmin = usuario === 'ADMINISTRADOR MESTRE';

  // Função para formatar o nome (Ex: CAMILA FERREIRA -> Camila)
  const formatarNome = (nomeCompleto: string) => {
    if (!nomeCompleto) return "";
    const primeiroNome = nomeCompleto.split(' ')[0].toLowerCase();
    return primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1);
  };


  // Escuta em tempo real para Produtos
  useEffect(() => {
    const qProds = query(collection(db, "produtos"));
    const unsub = onSnapshot(qProds, (snaps) => {
      if (snaps.empty) {
         const batch = writeBatch(db);
         initialProducts.forEach(p => batch.set(doc(collection(db, "produtos")), p));
         batch.commit();
      }
      const updatedProducts = snaps.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(updatedProducts);
    });
    return () => unsub();
  }, []);

  // Escuta em tempo real para Vendas
  useEffect(() => {
    const qSales = query(collection(db, "vendas"), orderBy("data", "desc"));
    const unsub = onSnapshot(qSales, (snaps) => {
      setSales(snaps.docs.map(d => ({ id: d.id, ...d.data() } as Sale)));
    });
    return () => unsub();
  }, []);

  const lowStock = useMemo(() => {
    return products.filter(p => Number(p.quantidade) <= Number(p.estoqueMinimo));
  }, [products]);

  const stats = useMemo(() => {
    const totalVendas = sales.reduce((acc, s) => acc + (Number(s.valorTotal) || 0), 0);
    const totalCusto = sales.reduce((acc, s) => acc + (Number(s.quantidade) * (Number(s.custoUnitario) || 0)), 0);
    return { totalVendas, totalCusto, lucro: totalVendas - totalCusto };
  }, [sales]);

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans text-gray-800">
      <header className="bg-[#da291c] text-white p-4 shadow-lg border-b-4 border-black/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package size={28} />
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter leading-none">APM SENAI</h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80">Gestão de Materiais e Fluxo</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Saudação com o nome em Preto (Texto Black) */}
            <div className="text-right hidden sm:block border-r border-white/20 pr-6">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 leading-none mb-1">Acesso Autorizado</p>
              <p className="text-sm font-bold text-black uppercase italic">Olá, {formatarNome(usuario)}</p>
            </div>

            <button 
              onClick={onLogout} 
              className="bg-black/20 p-2 px-4 rounded hover:bg-black/40 transition flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/10"
            >
              Sair <LogOut size={16}/>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 overflow-x-auto">
          <TabBtn active={activeTab==='financial'} label="Resumo" icon={<TrendingUp size={18}/>} onClick={()=>setActiveTab('financial')} />
          <TabBtn active={activeTab==='products'} label="Inventário" icon={<Package size={18}/>} onClick={()=>setActiveTab('products')} />
          <TabBtn active={activeTab==='alerts'} label="Alertas" icon={<AlertTriangle size={18}/>} onClick={()=>setActiveTab('alerts')} count={lowStock.length}/>
          <TabBtn active={activeTab==='admin'} label="Configurações" icon={<ShieldCheck size={18}/>} onClick={()=>setActiveTab('admin')} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'financial' && (
          <FinancialSummary 
            totalVendas={stats.totalVendas} 
            totalCusto={stats.totalCusto} 
            lucro={stats.lucro} 
            sales={sales} 
            products={products} 
          />
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-5 border border-gray-200 shadow-sm border-l-8 border-gray-800">
              <div>
                <h2 className="font-black uppercase text-sm tracking-tighter text-gray-800">Controle de Estoque</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase italic">Listagem oficial de materiais APM</p>
              </div>
              <button 
                onClick={() => setEditingProduct({ nome: '', quantidade: 0, preco: 0, custoUnitario: 0, estoqueMinimo: 5 })}
                className="bg-gray-900 text-white px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus size={16} /> Adicionar Novo Item
              </button>
            </div>

            <ProductList 
              products={products} 
              onEdit={setEditingProduct} 
              onSale={setSaleProduct} 
              onDelete={handleDelete}
            />
          </div>
        )}

        {activeTab === 'alerts' && <StockAlerts products={lowStock} />}
        {activeTab === 'admin' && <AdminDashboard isMasterAdmin={isMasterAdmin}/>}
      </main>

      {editingProduct && (
        <ProductEditor 
          product={editingProduct} 
          onSave={() => setEditingProduct(null)} 
          onCancel={() => setEditingProduct(null)} 
        />
      )}
      
      {saleProduct && (
        <SaleDialog 
          product={saleProduct} 
          onSale={() => setSaleProduct(null)} 
          onCancel={() => setSaleProduct(null)} 
        />
      )}
    </div>
  );
}

function TabBtn({ active, label, icon, onClick, count }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-2 px-4 py-5 border-b-4 font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
        active 
          ? 'border-[#da291c] text-[#da291c] bg-red-50/50' 
          : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      {icon} {label} 
      {count > 0 && (
        <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[9px] animate-pulse">
          {count}
        </span>
      )}
    </button>
  );
}