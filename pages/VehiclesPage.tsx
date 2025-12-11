import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Car, Plus, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';
import { Vehicle, Client } from '../types';
import Input from '../components/Input';
import { MockDatabase } from '../services/mockDatabase';

const VehiclesPage: React.FC = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({ isActive: true, tireCount: 6 });

  useEffect(() => {
    if (clientId) {
      setClient(MockDatabase.getClientById(clientId));
      setVehicles(MockDatabase.getVehicles(clientId));
    }
  }, [clientId]);

  const handleSaveVehicle = () => {
     if(!newVehicle.plate) return;
     
     const vehicleToAdd: Vehicle = {
       id: Date.now().toString(),
       plate: newVehicle.plate,
       clientId: clientId || '0',
       tireCount: newVehicle.tireCount || 6,
       isActive: newVehicle.isActive !== undefined ? newVehicle.isActive : true,
       type: 'Truck'
     };
     
     MockDatabase.saveVehicle(vehicleToAdd);
     setVehicles(MockDatabase.getVehicles(clientId));
     setIsAddOpen(false);
     setNewVehicle({ isActive: true, tireCount: 6 });
  };

  if (!client) return <div>Loading...</div>;

  return (
    <Layout 
        title="Vehículos" 
        showBack
        floatingActionButton={!isAddOpen ? (
            <button 
                onClick={() => setIsAddOpen(true)}
                className="bg-[#2e7d32] text-white p-4 rounded-2xl shadow-lg hover:bg-[#1b4332] transition-colors ring-4 ring-[#f4f7f4]"
            >
                <Plus size={28} />
            </button>
        ) : null}
    >
      {!isAddOpen ? (
        <>
          <div className="bg-[#1b4332] text-white p-6 rounded-b-[2rem] shadow-md mb-6 -mt-1 pt-2">
            <h2 className="text-2xl font-bold">{client.name}</h2>
            <div className="flex items-center gap-2 opacity-80 mt-1">
                <span className="text-xs font-mono bg-white/20 px-2 py-1 rounded">NIT: {client.nit}</span>
                <span className="text-xs font-bold">• {vehicles.length} Unidades</span>
            </div>
          </div>

          <div className="p-4 space-y-3 pb-20">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => navigate(`/inspection/${vehicle.id}`)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-green-200 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e8f5e9] rounded-2xl flex items-center justify-center text-[#2e7d32]">
                    <Car size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{vehicle.plate}</h3>
                    <p className="text-xs text-gray-400 font-bold">{vehicle.tireCount} Llantas</p>
                  </div>
                </div>
                {vehicle.isActive && (
                  <div className="bg-[#1b4332] rounded-full p-1">
                     <CheckCircle2 size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {vehicles.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p className="font-medium">No hay vehículos registrados.</p>
                </div>
            )}
          </div>
        </>
      ) : (
        /* Add Vehicle Form overlay */
        <div className="bg-[#f4f7f4] min-h-full p-4 animate-in fade-in">
           <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#1b4332] font-bold">
                  <Car size={18} />
                  <span>Información Básica</span>
                </div>
                <Input 
                  label="ID Interno/Placa *" 
                  placeholder="Ej: ABC123, VH-001..." 
                  value={newVehicle.plate || ''}
                  onChange={e => setNewVehicle({...newVehicle, plate: e.target.value})}
                  className="bg-gray-50 font-bold"
                />
             </div>

             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#1b4332] font-bold">
                  <SettingsIcon size={18} />
                  <span>Especificaciones Técnicas</span>
                </div>
                <Input 
                  label="Número de Llantas *" 
                  type="number"
                  placeholder="Ej: 4, 6, 8..." 
                  value={newVehicle.tireCount}
                  onChange={e => setNewVehicle({...newVehicle, tireCount: parseInt(e.target.value) || 0})}
                  className="bg-gray-50 font-bold"
                />
             </div>

             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#1b4332] font-bold">
                  <div className="w-5 h-3 border-2 border-[#1b4332] rounded-full"></div>
                  <span>Estado del Vehículo</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#2e7d32]">
                    <CheckCircle2 size={20} className="fill-current" />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Vehículo Activo</span>
                        <span className="text-xs text-gray-500">Está activo en el sistema</span>
                    </div>
                  </div>
                   <button 
                    onClick={() => setNewVehicle({...newVehicle, isActive: !newVehicle.isActive})}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-200 ${newVehicle.isActive ? 'bg-[#1b4332]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all duration-200 ${newVehicle.isActive ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
             </div>

             <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 bg-white text-gray-700 py-4 rounded-xl font-bold shadow-sm hover:bg-gray-50 border border-gray-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveVehicle}
                    className="flex-[2] bg-[#1b4332] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:bg-[#2d6a4f]"
                  >
                    <span className="bg-white/20 rounded p-0.5"><Plus size={16} strokeWidth={3}/></span>
                    Guardar Vehículo
                  </button>
                </div>

           </div>
        </div>
      )}
    </Layout>
  );
};

export default VehiclesPage;