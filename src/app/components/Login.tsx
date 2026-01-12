import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface LoginProps {
  onLogin: (usuario: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // CONFIGURAÇÃO DA MATRÍCULA MESTRA (HARDCODED)
  const MASTER_USER = {
    matricula: 'admin',
    senha: '123', // Altere para sua senha de segurança
    nome: 'ADMINISTRADOR MESTRE'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const matriculaDigitada = matricula.trim();

    try {
      // 1. VERIFICAÇÃO DA MATRÍCULA MESTRA
      if (matriculaDigitada === MASTER_USER.matricula && senha === MASTER_USER.senha) {
        onLogin(MASTER_USER.nome);
        return;
      }

      // 2. VERIFICAÇÃO NO FIREBASE (USUÁRIOS CADASTRADOS)
      const q = query(
        collection(db, "usuarios"),
        where("matricula", "==", matriculaDigitada)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('Acesso Negado: Matrícula não encontrada no sistema');
        setLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();

      if (userData.senha === senha) {
        onLogin(userData.nome);
      } else {
        alert('Acesso Negado: Senha Inválida');
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert('Erro crítico: Falha na conexão com o banco de dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] p-4 font-sans">
      <div className="w-full max-w-sm bg-white border-t-[10px] border-[#da291c] shadow-2xl p-8 relative overflow-hidden">
        
        {/* Indicador de Carregamento */}
        {loading && <div className="absolute top-0 left-0 w-full h-1 bg-red-200 animate-pulse">
          <div className="bg-[#da291c] h-full animate-progress w-1/3"></div>
        </div>}

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">AAPM SENAI</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Portal de Gestão de Materiais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 tracking-widest">
              <User size={12} className="text-[#da291c]"/> Matrícula do Colaborador
            </label>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 focus:border-[#da291c] outline-none font-bold text-sm uppercase transition-all placeholder:text-gray-200"
              placeholder="DIGITE SUA MATRÍCULA"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 tracking-widest">
              <Lock size={12} className="text-[#da291c]"/> Senha de Acesso
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 focus:border-[#da291c] outline-none font-bold text-sm transition-all"
              placeholder="••••••"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 font-black uppercase text-xs tracking-widest transition-all shadow-lg flex justify-center items-center gap-2 ${
              loading 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 text-white hover:bg-black active:scale-[0.98] shadow-gray-200'
            }`}
          >
            {loading ? 'VALIDANDO ACESSO...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest leading-relaxed">
            Acesso Restrito <br/> 
            AAPM © 2026
          </p>
        </div>
      </div>
    </div>
  );
}