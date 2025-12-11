import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Lock } from 'lucide-react';
import { MockDatabase } from '../services/mockDatabase';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor ingrese sus credenciales');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const users = MockDatabase.getUsers();
      const user = users.find(u => u.username === username && u.isActive);

      if (user && user.password === password) {
        localStorage.setItem('auth_token', 'mock_token_' + Date.now());
        localStorage.setItem('user_role', user.role);
        localStorage.setItem('user_name', user.name);
        localStorage.setItem('user_id', user.id); 
        navigate('/');
      } else {
        setError('Credenciales inválidas. Verifique usuario y contraseña.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-[#1b4332] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="text-center space-y-2">
           <div className="mx-auto flex items-center justify-center mb-6">
                <img 
                  src="https://llagro.com/wp-content/uploads/2021/12/logo-llagro-pequeno.png" 
                  alt="Llagro Logo" 
                  className="h-24 object-contain"
                />
           </div>
           <p className="text-gray-500 text-sm font-medium">
             Gestión de flotas e inspecciones
           </p>
        </div>

        {/* Form Container */}
        <div className="relative">
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                    <div className="group">
                        <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#1b4332]/20 focus:shadow-lg focus:shadow-green-50 transition-all text-sm font-semibold"
                        placeholder="Usuario (ej: admin, asesor1)"
                        />
                    </div>

                    <div className="group">
                        <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#1b4332]/20 focus:shadow-lg focus:shadow-green-50 transition-all text-sm font-semibold"
                        placeholder="Contraseña"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-xs text-center font-bold animate-pulse bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>
                )}

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1b4332] text-white py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-[#2d6a4f] hover:shadow-xl hover:shadow-[#1b4332]/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                        Ingresar al Sistema
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center pt-2 border-t border-gray-100">
            <button className="text-xs text-gray-400 hover:text-[#1b4332] transition-colors font-bold tracking-wide flex items-center gap-1">
                <Lock size={12} /> ¿Olvidaste tus credenciales?
            </button>
        </div>

        <div className="pt-4 text-center">
            <p className="text-[10px] text-gray-300 font-medium">
                © 2025 FleetTire Check v1.2
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;