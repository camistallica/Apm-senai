import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { X, Save, Package } from 'lucide-react';

export function ProductEditor({ product, onSave, onCancel }: any) {
  // Garantimos que os valores iniciais sejam números válidos para evitar erros de renderização
  const [form, setForm] = useState({
    nome: product?.nome || '',
    quantidade: product?.quantidade || 0,
    preco: product?.preco || 0,
    custoUnitario: product?.custoUnitario || 0,
    estoqueMinimo: product?.estoqueMinimo || 0
  });

  const isEditing = !!product?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Forçamos a conversão para número antes de enviar ao Firebase
      const dataToSave = {
        ...form,
        quantidade: Number(form.quantidade),
        preco: Number(form.preco),
        custoUnitario: Number(form.custoUnitario),
        estoqueMinimo: Number(form.estoqueMinimo),
        nome: form.nome.toUpperCase() // Padronização SENAI em caixa alta
      };

      if (isEditing) {
        await updateDoc(doc(db, "produtos", product.id), dataToSave);
      } else {
        await addDoc(collection(db, "produtos"), dataToSave);
      }
      onSave();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Falha ao processar operação no banco de dados.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000] animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg border-t-[12px] border-[#da291c] shadow-2xl relative overflow-hidden">
        
        {/* Header do Formulário */}
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 p-2 text-white">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm tracking-tighter leading-none">
                {isEditing ? 'Editar Registro' : 'Novo Material'}
              </h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Formulário de Controle Técnico
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-300 hover:text-red-600 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Nome do Produto */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Descrição do Material</label>
            <input 
              className="w-full p-3 bg-gray-50 border-2 border-gray-100 focus:border-[#da291c] outline-none font-bold text-sm uppercase transition-all"
              placeholder="Ex: RAQUETE DE PINGPONG"
              value={form.nome}
              onChange={e => setForm({...form, nome: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Quantidade */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Qtd. em Estoque</label>
              <input 
                type="number"
                className="w-full p-3 bg-gray-50 border-2 border-gray-100 focus:border-[#da291c] outline-none font-bold text-sm"
                value={form.quantidade}
                onChange={e => setForm({...form, quantidade: e.target.value})}
                required
              />
            </div>

            {/* Preço de Venda */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#da291c] uppercase tracking-widest">Preço de Venda (R$)</label>
              <input 
                type="number"
                step="0.01"
                className="w-full p-3 bg-red-50 border-2 border-red-100 focus:border-[#da291c] outline-none font-black text-sm text-[#da291c]"
                value={form.preco}
                onChange={e => setForm({...form, preco: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Custo Unitário */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Custo de Aquisição (R$)</label>
              <input 
                type="number"
                step="0.01"
                className="w-full p-3 bg-gray-50 border-2 border-gray-100 focus:border-[#da291c] outline-none font-bold text-sm"
                value={form.custoUnitario}
                onChange={e => setForm({...form, custoUnitario: e.target.value})}
                required
              />
            </div>

            {/* Estoque Mínimo */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Alerta de Estoque Mínimo</label>
              <input 
                type="number"
                className="w-full p-3 bg-gray-50 border-2 border-gray-100 focus:border-[#da291c] outline-none font-bold text-sm text-orange-600"
                value={form.estoqueMinimo}
                onChange={e => setForm({...form, estoqueMinimo: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Footer de Ações */}
          <div className="flex gap-3 pt-6 border-t border-gray-50">
            <button 
              type="button" 
              onClick={onCancel} 
              className="flex-1 py-4 border-2 border-gray-100 font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition shadow-xl shadow-gray-200"
            >
              <Save size={14} /> Confirmar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}