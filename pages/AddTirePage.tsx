import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Tire, TireBrand, TireDesign, TireDimension } from '../types';
import { MockDatabase } from '../services/mockDatabase';

const AddTirePage: React.FC = () => {
  const navigate = useNavigate();
  const [tire, setTire] = useState<Partial<Tire>>({
    isActive: true,
    mountingDate: new Date().toISOString().split('T')[0],
    type: 'Conversional (C)'
  });

  const [brands, setBrands] = useState<TireBrand[]>([]);
  const [designs, setDesigns] = useState<TireDesign[]>([]);
  const [dimensions, setDimensions] = useState<TireDimension[]>([]);

  useEffect(() => {
    setBrands(MockDatabase.getBrands());
    setDesigns(MockDatabase.getDesigns());
    setDimensions(MockDatabase.getDimensions());
  }, []);

  const handleSave = () => {
    if (!tire.internalId || !tire.brand || !tire.design || !tire.dimension) {
        alert("Por favor complete todos los campos obligatorios");
        return;
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col max-w-md mx-auto relative shadow-2xl">
      <header className="bg-[#1b4332] text-white p-4 flex items-center gap-3 shrink-0 shadow-md">
        <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Nueva Llanta</h1>
      </header>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        
        <div className="space-y-5">
          <div className="relative group">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-700 focus:ring-2 focus:ring-[#1b4332] focus:border-transparent outline-none transition-all font-medium bg-white"
              placeholder=" "
              value={tire.internalId || ''}
              onChange={e => setTire({...tire, internalId: e.target.value})}
            />
            <label className="absolute -top-2.5 left-3 bg-[#f4f7f4] px-1.5 text-xs font-bold text-gray-500 group-focus-within:text-[#1b4332] transition-colors">
              ID Interno / Código de Fuego *
            </label>
            <div className="text-right text-[10px] text-gray-400 mt-1 font-bold">{(tire.internalId?.length || 0)}/10</div>
          </div>

          <div className="relative group">
             <label className="absolute -top-2.5 left-3 bg-[#f4f7f4] px-1.5 text-xs font-bold text-gray-500 group-focus-within:text-[#1b4332] z-10">
              Marca de Llanta *
            </label>
             <select 
               value={tire.brand || ''}
               onChange={(e) => setTire({...tire, brand: e.target.value})}
               className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-700 bg-white focus:ring-2 focus:ring-[#1b4332] outline-none appearance-none font-medium"
             >
               <option value="">Seleccionar marca...</option>
               {brands.map(b => (
                   <option key={b.id} value={b.name}>{b.name}</option>
               ))}
             </select>
             <div className="absolute right-4 top-4 pointer-events-none text-gray-400">▼</div>
          </div>

          <div className="relative group">
             <label className="absolute -top-2.5 left-3 bg-[#f4f7f4] px-1.5 text-xs font-bold text-gray-500 group-focus-within:text-[#1b4332] z-10">
              Diseño de Llanta *
            </label>
             <select 
               value={tire.design || ''}
               onChange={(e) => setTire({...tire, design: e.target.value})}
               className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-700 bg-white focus:ring-2 focus:ring-[#1b4332] outline-none appearance-none font-medium"
             >
               <option value="">Seleccionar diseño...</option>
               {designs.map(d => (
                   <option key={d.id} value={d.name}>{d.name}</option>
               ))}
             </select>
             <div className="absolute right-4 top-4 pointer-events-none text-gray-400">▼</div>
          </div>

          <div className="relative group">
             <label className="absolute -top-2.5 left-3 bg-[#f4f7f4] px-1.5 text-xs font-bold text-gray-500 group-focus-within:text-[#1b4332] z-10">
              Dimensión de Llanta *
            </label>
             <select 
               value={tire.dimension || ''}
               onChange={(e) => setTire({...tire, dimension: e.target.value})}
               className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-700 bg-white focus:ring-2 focus:ring-[#1b4332] outline-none appearance-none font-medium"
             >
               <option value="">Seleccionar dimensión...</option>
               {dimensions.map(d => (
                   <option key={d.id} value={d.size}>{d.size}</option>
               ))}
             </select>
             <div className="absolute right-4 top-4 pointer-events-none text-gray-400">▼</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative border border-gray-300 rounded-xl px-3 py-1 bg-white focus-within:ring-1 focus-within:ring-[#1b4332]">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Tipo</label>
                <select 
                value={tire.type}
                onChange={(e) => setTire({...tire, type: e.target.value as any})}
                className="w-full bg-transparent outline-none font-bold text-gray-700 py-1 appearance-none"
                >
                <option value="Conversional (C)">Conversional (C)</option>
                <option value="Radial (R)">Radial (R)</option>
                </select>
            </div>

            <div className="relative border border-gray-300 rounded-xl px-3 py-1 bg-white focus-within:ring-1 focus-within:ring-[#1b4332]">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Fecha de Montaje</label>
                <input 
                type="date"
                value={tire.mountingDate}
                onChange={(e) => setTire({...tire, mountingDate: e.target.value})}
                className="w-full bg-transparent outline-none font-bold text-gray-700 py-1"
                />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <span className="font-bold text-gray-700 ml-1">Llanta activa</span>
            <button 
              onClick={() => setTire({...tire, isActive: !tire.isActive})}
              className={`w-14 h-8 rounded-full relative transition-colors duration-200 ${tire.isActive ? 'bg-[#388e3c]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all duration-200 ${tire.isActive ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <button 
            onClick={handleSave}
            className="w-full bg-[#1b4332] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg mt-8 hover:bg-[#2d6a4f] hover:shadow-xl transition-all"
        >
           <Save size={20} />
           Guardar Llanta
        </button>
      </div>
    </div>
  );
};

export default AddTirePage;