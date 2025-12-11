import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { FilePlus, Search, FileText } from 'lucide-react';
import { MockDatabase } from '../services/mockDatabase';
import { Client, Report } from '../types';

const ReportsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Report State
  const [reportName, setReportName] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    setReports(MockDatabase.getReports());
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      setClients(MockDatabase.getClients());
    }
  }, [isModalOpen]);

  const handleCreateReport = () => {
    if (!reportName || !selectedClient) return;

    const newReport: Report = {
      id: Date.now().toString(),
      name: reportName,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      createdAt: new Date().toISOString(),
      status: 'Borrador'
    };

    MockDatabase.addReport(newReport);
    setReports(MockDatabase.getReports());
    setIsModalOpen(false);
    
    // Reset
    setReportName('');
    setSelectedClient(null);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.nit.includes(searchTerm)
  );

  return (
    <Layout title="Reportes">
      <div className="p-4 flex flex-col h-full">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
               <FilePlus size={48} className="text-[#1b4332]" />
            </div>
            <h2 className="text-xl font-bold text-[#1b4332]">Gestión de Reportes</h2>
            <p className="text-gray-500 max-w-xs text-sm">Crea y administra los reportes de inspección de tus flotas.</p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1b4332] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#2d6a4f] mt-4"
            >
              Crear Nuevo Reporte
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
               <h2 className="font-bold text-[#1b4332]">Historial de Reportes</h2>
               <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[#1b4332] text-xs font-bold flex items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
               >
                 <FilePlus size={16} /> Nuevo
               </button>
            </div>
            {reports.map(report => (
              <div key={report.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                 <div className="flex items-center gap-3">
                    <div className="bg-[#e8f5e9] p-3 rounded-lg text-[#1b4332]">
                       <FileText size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-800">{report.name}</h3>
                       <p className="text-xs text-gray-500">{report.clientName}</p>
                       <p className="text-[10px] text-gray-400 mt-0.5">{new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${report.status === 'Borrador' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {report.status}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
         <h2 className="text-xl font-bold text-[#1b4332] mb-6">Crear nuevo reporte</h2>
         
         <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-400 mb-1 block uppercase">Nombre del reporte *</label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#1b4332] transition-all">
                 <div className="p-3 text-gray-400">
                    <FilePlus size={18} />
                 </div>
                 <input 
                   type="text" 
                   value={reportName}
                   onChange={e => setReportName(e.target.value)}
                   placeholder="Ej: Inspección Noviembre"
                   className="bg-transparent w-full p-2 outline-none text-gray-700 font-medium" 
                 />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 mb-1 block uppercase">Buscar clientes</label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#1b4332] transition-all">
                 <div className="p-3 text-gray-400">
                    <Search size={18} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Buscar por nombre..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="bg-transparent w-full p-2 outline-none text-gray-700 font-medium" 
                 />
              </div>
            </div>

            {selectedClient ? (
               <div className="bg-[#e8f5e9] p-3 rounded-xl flex justify-between items-center animate-in fade-in border border-[#c8e6c9]">
                 <div>
                    <p className="font-bold text-[#1b4332] text-sm">{selectedClient.name}</p>
                    <p className="text-xs text-[#2e7d32]">{selectedClient.nit}</p>
                 </div>
                 <button onClick={() => setSelectedClient(null)} className="text-xs text-red-500 font-bold bg-white px-2 py-1 rounded shadow-sm">Cambiar</button>
               </div>
            ) : (
               <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                 {filteredClients.slice(0, 3).map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedClient(c)}
                      className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer flex justify-between items-center group"
                    >
                       <div>
                          <p className="text-sm font-bold text-gray-700 group-hover:text-[#1b4332]">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.nit}</p>
                       </div>
                    </div>
                 ))}
               </div>
            )}

            <div className="flex gap-3 pt-4">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-gray-500 hover:text-gray-700">Cancelar</button>
               <button 
                 onClick={handleCreateReport} 
                 disabled={!reportName || !selectedClient}
                 className="flex-1 bg-[#1b4332] text-white py-3 rounded-xl font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d6a4f]"
               >
                 Crear Reporte
               </button>
            </div>
         </div>
      </Modal>
    </Layout>
  );
};

export default ReportsPage;