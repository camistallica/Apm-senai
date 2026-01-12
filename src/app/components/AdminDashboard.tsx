import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { UserPlus, Trash2, Shield, Lock } from 'lucide-react';
import { ConfirmRevokeDialog } from './ConfirmRevokeDialog';

interface AdminProps {
  isMasterAdmin: boolean;
}

export function AdminDashboard({ isMasterAdmin }: AdminProps) {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [novoUser, setNovoUser] = useState({ nome: '', matricula: '', senha: '', cargo: 'OPERADOR' });
  
  // ESTADO PARA CONTROLAR O DIÁLOGO DE REVOGAÇÃO
  const [userToRevoke, setUserToRevoke] = useState<any | null>(null);

  useEffect(() => {
    if (!isMasterAdmin) return;

    const q = query(collection(db, "usuarios"));
    const unsub = onSnapshot(q, (snaps) => {
      setUsuarios(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [isMasterAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMasterAdmin) return;

    try {
      await addDoc(collection(db, "usuarios"), {
        ...novoUser,
        matricula: novoUser.matricula.trim(),
        dataCriacao: new Date()
      });
      setNovoUser({ nome: '', matricula: '', senha: '', cargo: 'OPERADOR' });
      // Aqui você também pode substituir por um Toast futuramente
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

  // FUNÇÃO DE EXCLUSÃO LIMPA (CHAMADA PELO MODAL)
  const handleRevoke = async (id: string) => {
    try {
      await deleteDoc(doc(db, "usuarios", id));
    } catch (error) {
      console.error("Erro ao revogar acesso:", error);
    }
  };

  if (!isMasterAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white border-2 border-dashed border-gray-200 text-gray-400">
        <Lock size={48} className="mb-4 opacity-20" />
        <h3 className="font-black uppercase text-sm tracking-widest">Acesso Restrito</h3>
        <p className="text-[10px] font-bold uppercase mt-2">Apenas o Administrador Mestre pode gerir utilizadores.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white border-l-8 border-gray-800 shadow-sm p-6">
        <h3 className="text-xs font-black uppercase mb-4 flex items-center gap-2">
          <Shield size={16} className="text-[#da291c]"/> Painel de Controle de Acessos
        </h3>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            placeholder="NOME DO COLABORADOR" 
            className="p-3 bg-gray-50 border-2 border-gray-100 font-bold text-xs uppercase outline-none focus:border-[#da291c] transition-all"
            value={novoUser.nome}
            onChange={e => setNovoUser({...novoUser, nome: e.target.value.toUpperCase()})}
            required
          />
          <input 
            placeholder="MATRÍCULA" 
            className="p-3 bg-gray-50 border-2 border-gray-100 font-bold text-xs outline-none focus:border-[#da291c] transition-all"
            value={novoUser.matricula}
            onChange={e => setNovoUser({...novoUser, matricula: e.target.value})}
            required
          />
          <input 
            type="password"
            placeholder="SENHA" 
            className="p-3 bg-gray-50 border-2 border-gray-100 font-bold text-xs outline-none focus:border-[#da291c] transition-all"
            value={novoUser.senha}
            onChange={e => setNovoUser({...novoUser, senha: e.target.value})}
            required
          />
          <button className="bg-[#da291c] text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition shadow-lg shadow-red-100">
            Autorizar Acesso
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-[10px] font-black uppercase text-gray-400">
            <tr>
              <th className="p-4">Colaborador Ativo</th>
              <th className="p-4">ID / Matrícula</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-xs font-bold uppercase divide-y divide-gray-100">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="p-4 text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {u.nome}
                </td>
                <td className="p-4 text-gray-400">{u.matricula}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setUserToRevoke(u)} // APENAS ABRE O DIÁLOGO BONITO
                    className="text-gray-300 hover:text-red-600 transition p-2"
                  >
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPONENTE DE DIÁLOGO PERSONALIZADO */}
      {userToRevoke && (
        <ConfirmRevokeDialog
          isOpen={!!userToRevoke}
          userName={userToRevoke.nome}
          onClose={() => setUserToRevoke(null)}
          onConfirm={async () => {
            if (userToRevoke) {
              await handleRevoke(userToRevoke.id);
              setUserToRevoke(null);
            }
          }}
        />
      )}
    </div>
  );
}