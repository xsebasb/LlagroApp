import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { RefreshCw, ArrowRightLeft, HelpCircle, Save, Camera, X } from 'lucide-react';
import { InspectionData, Vehicle } from '../types';
import { MockDatabase } from '../services/mockDatabase';
import TruckVisualizer from '../components/TruckVisualizer';

const InspectionPage: React.FC = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPos, setCurrentPos] = useState(1);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<InspectionData>({
    position: 1,
    pressure: 130,
    odometer: 45885,
    depthExt: 13,
    depthCent: 12,
    depthInt: 13,
    observations: 'ok',
    images: []
  });

  const [hasTire, setHasTire] = useState(false);

  useEffect(() => {
    if (vehicleId) {
        const allVehicles = MockDatabase.getVehicles(); 
        const found = allVehicles.find(v => v.id === vehicleId);
        if (found) {
            setVehicle(found);
        }
    }
  }, [vehicleId]);

  // Handle position change
  useEffect(() => {
    // Reset form for new position (Simulation)
    setFormData(prev => ({
        ...prev, 
        position: currentPos, 
        images: [], // Clear images for new position
        observations: '' 
    }));
  }, [currentPos]);

  const handleNext = () => {
      if (vehicle && currentPos < vehicle.tireCount) {
        setCurrentPos(p => p + 1);
        setHasTire(true); 
      } else {
        alert("Inspección guardada con evidencias (Simulación)");
        navigate(-1);
      }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again if needed
    if (event.target) event.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  if (!vehicle) {
      return (
          <Layout title="Cargando..." showBack>
              <div className="p-4 text-center text-gray-500">Buscando vehículo...</div>
          </Layout>
      );
  }

  return (
    <Layout title={`Inspección - ${vehicle.plate}`} showBack>
      
      <div className="p-4 space-y-6 pb-24">
        {/* Truck Visualization */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-[#1b4332] mb-4 text-center text-sm uppercase tracking-wide">Esquema del Vehículo</h3>
           <TruckVisualizer 
             tireCount={vehicle.tireCount} 
             selectedPos={currentPos} 
             onSelectPos={(pos) => setCurrentPos(pos)}
           />
           <p className="text-center text-xs text-gray-400 mt-3 font-medium">Toque una llanta para inspeccionar</p>
        </div>

        <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold shadow-md">
                {currentPos}
            </div>
            <h2 className="text-xl font-bold text-[#1b4332]">Inspección Llanta {currentPos}</h2>
        </div>

        {/* Previous Info Block */}
        {!hasTire && (
          <div className="bg-[#eef2ee] p-4 rounded-xl border border-[#c8e6c9]/50">
            <div className="flex justify-between items-start">
               <h3 className="font-bold text-gray-600 mb-2">Información Previa</h3>
            </div>
            <p className="text-gray-400 text-sm">No hay información previa para esta llanta</p>
          </div>
        )}

        {hasTire && (
           <div className="bg-[#eef2ee] p-4 rounded-xl border border-[#c8e6c9]/50 text-sm space-y-1 shadow-sm">
             <div className="grid grid-cols-2 gap-x-4 gap-y-2">
               <div><span className="font-bold text-gray-500 block text-[10px] uppercase">ID Interno</span> <span className="text-[#1b4332] font-bold">1085</span></div>
               <div><span className="font-bold text-gray-500 block text-[10px] uppercase">Dimensiones</span> <span className="text-[#1b4332] font-bold">185/65R15</span></div>
               <div><span className="font-bold text-gray-500 block text-[10px] uppercase">Marca</span> <span className="text-[#1b4332] font-bold">Continental</span></div>
               <div><span className="font-bold text-gray-500 block text-[10px] uppercase">Diseño</span> <span className="text-[#1b4332] font-bold">Terminal Master</span></div>
             </div>
           </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
           {!hasTire ? (
              <div className="text-center py-2">
                  <h3 className="font-bold text-gray-600 text-left mb-4">Configuración de Llanta</h3>
                  <div className="flex justify-center mb-2">
                    <HelpCircle className="text-orange-400" size={32} />
                  </div>
                  <p className="text-orange-400 font-bold mb-1 text-sm">No hay llanta asignada</p>
                  
                  <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => setHasTire(true)}
                        className="flex-1 bg-white border border-gray-300 text-gray-600 py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50"
                      >
                         <RefreshCw size={16} /> Usar Misma
                      </button>
                      <button 
                        onClick={() => navigate('/add-tire')}
                        className="flex-1 bg-[#1b4332] text-white py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#2d6a4f]"
                      >
                         <ArrowRightLeft size={16} /> Asignar Nueva
                      </button>
                  </div>
              </div>
           ) : (
               <div className="flex gap-3">
                  <button className="flex-1 bg-white border border-gray-300 text-gray-600 py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                      <RefreshCw size={16} /> Usar Misma
                  </button>
                  <button 
                    onClick={() => navigate('/add-tire')}
                    className="flex-1 bg-[#1b4332] text-white py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#2d6a4f]">
                      <ArrowRightLeft size={16} /> Cambiar
                  </button>
               </div>
           )}
        </div>

        {/* Input Form */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-[#1b4332]"></div>
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#1b4332] flex items-center gap-2">
                Datos de Medición
              </h3>
              <span className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold px-2 py-1 rounded-md border border-[#c8e6c9] uppercase tracking-wide">Nuevo</span>
           </div>

           <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-gray-400 group-focus-within:text-[#1b4332] uppercase">Presión</label>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-3 focus-within:ring-2 focus-within:ring-[#1b4332] focus-within:border-transparent transition-all">
                        <input 
                        type="number" 
                        value={formData.pressure}
                        onChange={e => setFormData({...formData, pressure: Number(e.target.value)})}
                        className="w-full outline-none text-gray-800 font-bold text-lg" 
                        />
                        <span className="text-gray-400 font-bold text-xs ml-1">PSI</span>
                    </div>
                </div>

                <div className="relative group">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-gray-400 group-focus-within:text-[#1b4332] uppercase">Horómetro</label>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-3 focus-within:ring-2 focus-within:ring-[#1b4332] focus-within:border-transparent transition-all">
                        <input 
                        type="number" 
                        value={formData.odometer}
                        onChange={e => setFormData({...formData, odometer: Number(e.target.value)})}
                        className="w-full outline-none text-gray-800 font-bold text-lg" 
                        />
                        <span className="text-gray-400 font-bold text-xs ml-1">Hr</span>
                    </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 mb-3 text-center uppercase tracking-widest">Profundidad (mm)</p>
                <div className="grid grid-cols-3 gap-3">
                    <DepthInput label="EXT" value={formData.depthExt} onChange={v => setFormData({...formData, depthExt: v})} />
                    <DepthInput label="CEN" value={formData.depthCent} onChange={v => setFormData({...formData, depthCent: v})} />
                    <DepthInput label="INT" value={formData.depthInt} onChange={v => setFormData({...formData, depthInt: v})} />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Evidencias Fotográficas</p>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#1b4332] text-xs font-bold flex items-center gap-1 hover:bg-[#e8f5e9] px-2 py-1 rounded transition-colors"
                    >
                        <Camera size={14} /> Agregar
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>

                {(!formData.images || formData.images.length === 0) ? (
                    <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-xs">
                        <p>No hay imágenes adjuntas</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={img} alt="Evidencia" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 hover:scale-100"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
              </div>

              <div className="relative pt-2 group">
                 <label className="absolute top-0 left-2 bg-white px-1 text-xs font-bold text-gray-500 z-10 group-focus-within:text-[#1b4332]">Observaciones</label>
                 <textarea 
                    value={formData.observations}
                    onChange={e => setFormData({...formData, observations: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg bg-white px-3 py-3 pt-4 text-gray-700 outline-none h-20 resize-none focus:ring-2 focus:ring-[#1b4332] focus:border-transparent transition-all text-sm font-medium"
                 />
              </div>
           </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="fixed bottom-0 w-full max-w-md bg-[#f4f7f4]/95 backdrop-blur-sm p-4 border-t border-gray-200 z-20">
         <button 
           onClick={handleNext}
           className="w-full bg-[#1b4332] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#2d6a4f] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm tracking-wide"
         >
           <Save size={18} />
           {currentPos < vehicle.tireCount ? 'Guardar y Siguiente' : 'Finalizar Inspección'}
         </button>
      </div>
    </Layout>
  );
};

const DepthInput: React.FC<{ label: string, value: number, onChange: (v: number) => void }> = ({ label, value, onChange }) => (
    <div className="relative group">
        <label className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-50 px-1 text-[10px] font-bold text-gray-400 group-focus-within:text-[#1b4332]">{label}</label>
        <input 
            type="number" 
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg bg-white px-1 py-3 text-center text-gray-800 font-bold outline-none focus:ring-2 focus:ring-[#1b4332] focus:border-transparent transition-all text-lg" 
        />
    </div>
);

export default InspectionPage;