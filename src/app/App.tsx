import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [usuario, setUsuario] = useState<string | null>(null);

  const handleLogin = (matricula: string) => {
    setUsuario(matricula);
  };

  const handleLogout = () => {
    setUsuario(null);
  };

  return (
    <div className="size-full">
      {!usuario ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard usuario={usuario} onLogout={handleLogout} />
      )}
    </div>
  );
}
