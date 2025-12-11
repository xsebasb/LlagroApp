import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Plus, User, CheckCircle2, Pencil, ArrowLeft } from 'lucide-react';
import { Client, TabType } from '../types';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { MockDatabase } from '../services/mockDatabase';

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [clientForm, setClientForm] = useState<Partial<Client>>({ isActive: true });

  useEffect(() => {
    setClients(MockDatabase.getClients());
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.nit.includes(searchTerm);
    if (activeTab === 'activos') return matchesSearch && client.isActive;
    if (activeTab === 'inactivos') return matchesSearch && !client.isActive;
    return matchesSearch;
  });

  const handleOpenCreate = () => {
    setClientForm({ isActive: true });
    setIsEditMode(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setClientForm({ ...client });
    setIsEditMode(true);
    setSelectedClient(null); 
    setIsAddModalOpen(true);
  };

  const handleSaveClient = () => {
    if (!clientForm.name || !clientForm.nit) return; 

    const clientToSave: Client = {
      id: isEditMode ? clientForm.id! : Date.now().toString(),
      name: clientForm.name,
      nit: clientForm.nit,
      email: clientForm.email || '',
      contact: clientForm.contact || '',
      location: clientForm.location || '',
      city: clientForm.city || '',
      address: clientForm.address || '',
      isActive: clientForm.isActive !== undefined ? clientForm.isActive : true
    };

    MockDatabase.saveClient(clientToSave);
    setClients(MockDatabase.getClients()); 
    setIsAddModalOpen(false);
  };

  return (
    <Layout 
      title="Gestión de Clientes" 
      showRefresh
      floatingActionButton={
        <button 
          onClick={handleOpenCreate}
          className="bg-[#1b4332] text-white p-4 rounded-2xl shadow-lg hover:bg-[#2d6a4f] transition-all hover:scale-105 active:scale-95 flex items-center justify-center ring-4 ring-[#f4f7f4]"
          title="Agregar nuevo cliente"
        >
          <Plus size={28} />
        </button>
      }
    >
      <div className="p-4 space-y-5">
        {/* Tabs */}
        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-100">
          {(['todos', 'activos', 'inactivos'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#1b4332] text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#1b4332] transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o NIT..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:border-transparent transition-all shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Client List */}
        <div className="space-y-3 pb-20">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <User size={32} className="opacity-20" />
               </div>
               <p className="font-medium">No se encontraron clientes</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-green-100 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e8f5e9] rounded-full flex items-center justify-center text-[#2e7d32] font-bold shadow-sm">
                    <User size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{client.name}</h3>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">NIT: {client.nit}</p>
                  </div>
                </div>
                {client.isActive && <div className="bg-[#1b4332] p-1 rounded-full"><CheckCircle2 size={14} className="text-white" /></div>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Client Details Modal */}
      <Modal isOpen={!!selectedClient} onClose={() => setSelectedClient(null)}>
        {selectedClient && (
          <div className="space-y-5">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-[#1b4332]">{selectedClient.name}</h2>
              <button 
                onClick={() => handleOpenEdit(selectedClient)}
                className="text-gray-400 hover:text-[#1b4332] p-2 bg-gray-50 rounded-full hover:bg-green-50 transition-colors"
              >
                <Pencil size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase">NIT</p>
                    <p className="text-base font-bold text-gray-700">{selectedClient.nit}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase">Estado</p>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedClient.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="font-bold text-sm text-gray-700">{selectedClient.isActive ? 'Activo' : 'Inactivo'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#f4f7f4] p-4 rounded-xl border border-gray-200 space-y-2">
              <p className="text-xs text-gray-500 flex justify-between">
                  <span className="font-bold">Email:</span> 
                  <span className="text-gray-800">{selectedClient.email || '-'}</span>
              </p>
              <p className="text-xs text-gray-500 flex justify-between">
                  <span className="font-bold">Teléfono:</span> 
                  <span className="text-gray-800">{selectedClient.contact || '-'}</span>
              </p>
              <p className="text-xs text-gray-500 flex justify-between">
                  <span className="font-bold">Ubicación:</span> 
                  <span className="text-gray-800">{selectedClient.city}</span>
              </p>
            </div>

            <button 
              onClick={() => {
                  setSelectedClient(null); 
                  navigate(`/clients/${selectedClient.id}/vehicles`);
              }}
              className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#2d6a4f] transition-all flex items-center justify-center gap-2 mt-2"
            >
              Gestionar Vehículos
            </button>
          </div>
        )}
      </Modal>

      {/* Add/Edit Client Full Screen Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#f4f7f4] flex flex-col animate-in slide-in-from-bottom duration-300">
           <header className="bg-[#1b4332] text-white p-4 flex items-center gap-3 shrink-0 shadow-md">
             <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full">
               <ArrowLeft size={24} />
             </button>
             <h1 className="text-lg font-bold">{isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}</h1>
           </header>
           <div className="p-6 flex-1 overflow-y-auto">
             <div className="space-y-5 max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <Input label="Nombre" placeholder="Ej: Transportes S.A." value={clientForm.name || ''} onChange={e => setClientForm({...clientForm, name: e.target.value})} />
                <Input label="NIT" placeholder="Ej: 900.123.456-1" value={clientForm.nit || ''} onChange={e => setClientForm({...clientForm, nit: e.target.value})} />
                <Input label="Correo electrónico" placeholder="contacto@empresa.com" value={clientForm.email || ''} onChange={e => setClientForm({...clientForm, email: e.target.value})} />
                <Input label="Número de contacto" placeholder="300 123 4567" value={clientForm.contact || ''} onChange={e => setClientForm({...clientForm, contact: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Ciudad" placeholder="Bogotá" value={clientForm.city || ''} onChange={e => setClientForm({...clientForm, city: e.target.value})} />
                    <Input label="Ubicación" placeholder="Zona Norte" value={clientForm.location || ''} onChange={e => setClientForm({...clientForm, location: e.target.value})} />
                </div>
                <Input label="Dirección" placeholder="Av. Siempre Viva 123" value={clientForm.address || ''} onChange={e => setClientForm({...clientForm, address: e.target.value})} />
                
                <div className="flex items-center justify-between mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-700 text-sm">Estado Activo</span>
                  <button 
                    onClick={() => setClientForm({...clientForm, isActive: !clientForm.isActive})}
                    className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${clientForm.isActive ? 'bg-[#2e7d32]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${clientForm.isActive ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="pt-6">
                  <button onClick={handleSaveClient} className="w-full bg-[#1b4332] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-md hover:bg-[#2d6a4f] transition-all">
                    <CheckCircle2 size={20} />
                    {isEditMode ? 'Actualizar Cliente' : 'Guardar Cliente'}
                  </button>
                </div>
             </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default ClientsPage;