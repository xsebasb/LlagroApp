import React from 'react';
import { Users, FileBarChart, Settings, ArrowLeft, RotateCw, UserCog } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  showRefresh?: boolean;
  floatingActionButton?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack = false, showRefresh = false, floatingActionButton }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  // Check user role
  const userRole = localStorage.getItem('user_role');
  const isAdmin = userRole === 'admin';

  return (
    <div className="flex flex-col h-screen bg-[#f4f7f4] max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200 font-sans">
      {/* Header */}
      <header className="bg-[#1b4332] text-white p-4 flex items-center justify-between shrink-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-1 rounded-full transition-colors active:scale-95">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-lg font-bold tracking-wide truncate">{title}</h1>
        </div>
        {showRefresh && (
          <button className="hover:bg-white/10 p-1 rounded-full transition-colors active:rotate-180 duration-500">
            <RotateCw size={20} />
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 relative scroll-smooth bg-[#f4f7f4]">
        {children}
      </main>

      {/* Floating Action Button Container */}
      {floatingActionButton && (
        <div className="absolute bottom-24 right-5 z-20 animate-in zoom-in duration-300 drop-shadow-xl">
          {floatingActionButton}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bg-[#1b4332] text-white flex justify-around items-center py-2 absolute bottom-0 w-full shrink-0 z-10 border-t border-white/5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <NavButton icon={<Users size={22} />} label="Clientes" isActive={isActive('/')} onClick={() => navigate('/')} />
        <NavButton icon={<FileBarChart size={22} />} label="Reportes" isActive={isActive('/reports')} onClick={() => navigate('/reports')} />
        
        {isAdmin && (
          <NavButton icon={<UserCog size={22} />} label="Usuarios" isActive={isActive('/users')} onClick={() => navigate('/users')} />
        )}

        <NavButton icon={<Settings size={22} />} label="Config" isActive={isActive('/config')} onClick={() => navigate('/config')} />
      </nav>
    </div>
  );
};

const NavButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-white/10 text-white scale-105 font-bold shadow-inner' : 'text-gray-400 hover:text-gray-100'}`}
    >
      {icon}
      <span className="text-[10px] tracking-wide">{label}</span>
    </button>
);

export default Layout;