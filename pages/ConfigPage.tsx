import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Bus, ChevronRight, Ruler, Component, Tag, Save, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MockDatabase } from '../services/mockDatabase';
import { TireBrand, TireDesign, TireDimension } from '../types';

type ConfigTab = 'dimensions' | 'designs' | 'brands' | 'menu';

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ConfigTab>('menu');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const ConfigListManager = () => {
    const [items, setItems] = useState<any[]>([]);
    const [newItemName, setNewItemName] = useState('');
    
    useEffect(() => {
        loadItems();
    }, [activeTab]);

    const loadItems = () => {
        if (activeTab === 'brands') setItems(MockDatabase.getBrands());
        if (activeTab === 'designs') setItems(MockDatabase.getDesigns());
        if (activeTab === 'dimensions') setItems(MockDatabase.getDimensions());
    };

    const handleSave = () => {
        if (!newItemName.trim()) return;

        const id = Date.now().toString();

        if (activeTab === 'brands') {
            MockDatabase.saveBrand({ id, name: newItemName, active: true });
        } else if (activeTab === 'designs') {
            MockDatabase.saveDesign({ id, name: newItemName, active: true });
        } else if (activeTab === 'dimensions') {
            MockDatabase.saveDimension({ id, size: newItemName, active: true });
        }

        setNewItemName('');
        loadItems();
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('¿Eliminar este registro?')) return;

        if (activeTab === 'brands') MockDatabase.deleteBrand(id);
        if (activeTab === 'designs') MockDatabase.deleteDesign(id);
        if (activeTab === 'dimensions') MockDatabase.deleteDimension(id);
        
        loadItems();
    };

    const getPlaceholder = () => {
        if (activeTab === 'brands') return "Nombre de la marca";
        if (activeTab === 'designs') return "Nombre del diseño";
        return "Medida (Ej: 295/80R22.5)";
    };

    const getButtonText = () => {
        if (activeTab === 'brands') return "Guardar Marca";
        if (activeTab === 'designs') return "Guardar Diseño";
        return "Guardar Dimensión";
    };

    return (
        <div className="space-y-4 animate-in fade-in">
            {/* Tabs Navigation */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('dimensions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap text-sm font-bold transition-all ${activeTab === 'dimensions' ? 'bg-[#1b4332] text-white border-[#1b4332]' : 'bg-white text-gray-600 border-gray-200'}`}>
                    <Ruler size={14} /> Dimensiones
                </button>
                <button 
                    onClick={() => setActiveTab('designs')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap text-sm font-bold transition-all ${activeTab === 'designs' ? 'bg-[#1b4332] text-white border-[#1b4332]' : 'bg-white text-gray-600 border-gray-200'}`}>
                    <Component size={14} /> Diseños
                </button>
                <button 
                    onClick={() => setActiveTab('brands')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap text-sm font-bold transition-all ${activeTab === 'brands' ? 'bg-[#1b4332] text-white border-[#1b4332]' : 'bg-white text-gray-600 border-gray-200'}`}>
                    <Tag size={14} /> Marcas
                </button>
            </div>

            <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-[#1b4332]">
                    {activeTab === 'brands' && 'Gestión de Marcas'}
                    {activeTab === 'designs' && 'Gestión de Diseños'}
                    {activeTab === 'dimensions' && 'Gestión de Dimensiones'}
                </h2>
            </div>

            {/* Input Area */}
            <div className="relative">
                <input 
                    type="text" 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#1b4332] font-medium" 
                    placeholder={getPlaceholder()} 
                />
            </div>

            <div className="flex justify-center mb-6">
                <button 
                    onClick={handleSave}
                    disabled={!newItemName}
                    className="bg-[#1b4332] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d6a4f] transition-all">
                    <Save size={18} /> {getButtonText()}
                </button>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pb-10">
                {items.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-400 text-sm font-medium">No hay registros configurados.</p>
                    </div>
                )}
                {items.map((item, index) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-gray-100 hover:border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#e8f5e9] rounded-full flex items-center justify-center text-[#1b4332] font-bold text-xs">
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{item.name || item.size}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                                    {activeTab === 'dimensions' ? 'Dimensión activa' : 'Registro activo'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const isSubPage = activeTab !== 'menu';

  return (
    <Layout title={isSubPage ? "Configuración Avanzada" : "Configuración"} showBack={isSubPage} >
       <div className="p-4 h-full">
          {isSubPage ? (
             <div>
                <button 
                    onClick={() => setActiveTab('menu')}
                    className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-[#1b4332] font-bold"
                >
                    &larr; Volver al menú
                </button>
                <ConfigListManager />
             </div>
          ) : (
            <div className="space-y-3 animate-in slide-in-from-left duration-300">
              <button 
                onClick={() => setActiveTab('dimensions')} 
                className="w-full bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md hover:border-green-100 transition-all group"
              >
                  <div className="flex items-center gap-4">
                    <div className="bg-[#e8f5e9] p-3 rounded-full text-[#1b4332] group-hover:scale-110 transition-transform">
                        <Bus size={24} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-[#1b4332] text-lg">Variables del Sistema</h3>
                        <p className="text-xs text-gray-500">Gestionar diseños, marcas y dimensiones</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-[#1b4332]" />
              </button>

              <div className="h-px bg-gray-200 my-6"></div>

              <button 
                onClick={handleLogout}
                className="w-full bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-red-50 group hover:bg-red-50 transition-colors"
              >
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-3 rounded-full text-red-500 group-hover:bg-red-100 transition-colors">
                        <LogOut size={24} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-red-600">Cerrar Sesión</h3>
                        <p className="text-xs text-red-400">Salir de la aplicación</p>
                    </div>
                  </div>
              </button>
            </div>
          )}
       </div>
    </Layout>
  );
};

export default ConfigPage;