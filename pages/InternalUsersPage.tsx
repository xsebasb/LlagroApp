import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Plus, ShieldCheck, User, Trash2, CheckCircle2, Pencil, Image as ImageIcon } from 'lucide-react';
import { InternalUser } from '../types';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { MockDatabase } from '../services/mockDatabase';

const InternalUsersPage: React.FC = () => {
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<InternalUser>>({ role: 'advisor', isActive: true });
  const [passwordInput, setPasswordInput] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const currentUserId = localStorage.getItem('user_id');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(MockDatabase.getUsers());
  };

  const handleOpenCreate = () => {
    setEditingUser({ role: 'advisor', isActive: true, profileImage: '' });
    setPasswordInput('');
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: InternalUser) => {
    setEditingUser({ ...user });
    setPasswordInput('');
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!editingUser.name || !editingUser.username) {
        alert("El nombre y usuario son obligatorios");
        return;
    }

    if (!isEditMode && !passwordInput) {
        alert("La contraseña es obligatoria para nuevos usuarios");
        return;
    }

    let passwordToSave = passwordInput;
    if (isEditMode && !passwordInput) {
        const currentUser = users.find(u => u.id === editingUser.id);
        passwordToSave = currentUser?.password || '';
    }

    const userToSave: InternalUser = {
      id: isEditMode ? editingUser.id! : Date.now().toString(),
      name: editingUser.name,
      username: editingUser.username,
      password: passwordToSave,
      role: editingUser.role || 'advisor',
      isActive: editingUser.isActive !== undefined ? editingUser.isActive : true,
      profileImage: editingUser.profileImage
    };

    MockDatabase.saveUser(userToSave);
    loadUsers();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id === currentUserId) {
        alert("No puedes eliminar tu propio usuario mientras estás logueado.");
        return;
    }
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
        MockDatabase.deleteUser(id);
        loadUsers();
    }
  };

  return (
    <Layout 
      title="Usuarios Internos" 
      floatingActionButton={
        <button 
          onClick={handleOpenCreate}
          className="bg-[#1b4332] text-white p-4 rounded-2xl shadow-lg hover:bg-[#2d6a4f] transition-all hover:scale-105 active:scale-95 ring-4 ring-[#f4f7f4]"
          title="Crear nuevo usuario"
        >
          <Plus size={28} />
        </button>
      }
    >
      <div className="p-4 space-y-4">
        <div className="bg-[#e8f5e9] p-5 rounded-2xl border border-[#c8e6c9] flex items-start gap-4">
             <div className="bg-[#1b4332] p-2 rounded-lg text-white shrink-0">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h3 className="font-bold text-[#1b4332]">Panel de Administrador</h3>
                <p className="text-xs text-gray-600 mt-1">Gestione los asesores y administradores que tienen acceso a la aplicación.</p>
             </div>
        </div>

        <div className="space-y-3 pb-24">
           {users.map(user => (
              <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                      {user.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt={user.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${user.role === 'admin' ? 'bg-[#1b4332]' : 'bg-[#43a047]'}`}>
                            {user.role === 'admin' ? <ShieldCheck size={20} /> : <User size={20} />}
                        </div>
                      )}
                      
                      <div>
                          <h4 className="font-bold text-gray-800 text-base">{user.name}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                             <p className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">@{user.username}</p>
                             <span className="text-[10px] text-gray-400">•</span>
                             <p className="text-xs font-bold text-[#1b4332] capitalize">{user.role === 'advisor' ? 'Asesor' : 'Admin'}</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                       <button onClick={() => handleOpenEdit(user)} className="text-gray-300 hover:text-[#1b4332] p-2 rounded-full hover:bg-green-50 transition-colors">
                           <Pencil size={18} />
                       </button>
                       {user.id !== '1' && user.id !== currentUserId && (
                           <button onClick={() => handleDelete(user.id)} className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                               <Trash2 size={18} />
                           </button>
                       )}
                  </div>
              </div>
           ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Editar Usuario" : "Registrar Usuario"}>
         <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
             {/* Profile Picture Preview/Input */}
             <div className="flex flex-col items-center gap-4 pb-2">
                <div className="relative group cursor-pointer">
                  {editingUser.profileImage ? (
                    <img src={editingUser.profileImage} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-[#1b4332] shadow-sm" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-300">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  {editingUser.role === 'admin' && (
                    <div className="absolute bottom-0 right-1 bg-[#1b4332] text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                      <ShieldCheck size={14} />
                    </div>
                  )}
                </div>
                <Input 
                  placeholder="URL de la imagen de perfil" 
                  value={editingUser.profileImage || ''} 
                  onChange={e => setEditingUser({...editingUser, profileImage: e.target.value})}
                  className="text-center text-xs bg-gray-50"
                />
             </div>

             <Input 
                label="Nombre Completo" 
                placeholder="Ej: Pedro Perez" 
                value={editingUser.name || ''} 
                onChange={e => setEditingUser({...editingUser, name: e.target.value})}
             />
             <Input 
                label="Nombre de Usuario" 
                placeholder="Ej: pperez" 
                value={editingUser.username || ''} 
                onChange={e => setEditingUser({...editingUser, username: e.target.value})}
             />

             <Input 
                type="password"
                label={isEditMode ? "Contraseña (Opcional)" : "Contraseña"}
                placeholder={isEditMode ? "••••••" : "Ingrese contraseña"}
                value={passwordInput} 
                onChange={e => setPasswordInput(e.target.value)}
             />
             
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-3 text-center">Rol del Sistema</label>
                 <div className="flex bg-gray-200 p-1 rounded-xl">
                     <button 
                       onClick={() => setEditingUser({...editingUser, role: 'advisor'})}
                       className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${editingUser.role === 'advisor' ? 'bg-white text-[#1b4332] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        Asesor
                     </button>
                     <button 
                       onClick={() => setEditingUser({...editingUser, role: 'admin'})}
                       className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${editingUser.role === 'admin' ? 'bg-white text-[#1b4332] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        Admin
                     </button>
                 </div>
             </div>

             <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <span className="font-bold text-gray-700 text-sm">Usuario Activo</span>
                  <button 
                    onClick={() => setEditingUser({...editingUser, isActive: !editingUser.isActive})}
                    className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${editingUser.isActive ? 'bg-[#2e7d32]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${editingUser.isActive ? 'left-6' : 'left-1'}`} />
                  </button>
             </div>

             <div className="pt-2">
                <button 
                  onClick={handleSaveUser}
                  className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold hover:bg-[#2d6a4f] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <CheckCircle2 size={20} /> {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
             </div>
         </div>
      </Modal>
    </Layout>
  );
};

export default InternalUsersPage;