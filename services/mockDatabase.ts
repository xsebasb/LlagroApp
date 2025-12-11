import { Client, Vehicle, InternalUser, Report, TireBrand, TireDesign, TireDimension } from '../types';

const DB_KEY = 'fleettire_db_v1';

// Initial Seed Data
const initialClients: Client[] = [
  { id: '1', name: 'Cliente1', nit: '123456789-d', email: 'c1@test.com', contact: '555-0101', location: 'Norte', city: 'Bogota', address: 'Calle 123', isActive: true },
  { id: '2', name: 'Transportes SA', nit: '900100200-1', email: 'info@trans.com', contact: '555-0202', location: 'Sur', city: 'Medellin', address: 'Cra 45', isActive: true },
  { id: '3', name: 'Logistica Global', nit: '800500400-5', email: 'log@global.com', contact: '555-0303', location: 'Centro', city: 'Cali', address: 'Av 6', isActive: false },
];

const initialVehicles: Vehicle[] = [
  { id: '1', plate: 'TT305', clientId: '1', tireCount: 6, isActive: true, type: 'Truck' },
  { id: '2', plate: 'ABC-123', clientId: '1', tireCount: 4, isActive: true, type: 'Van' },
  { id: '3', plate: 'SXK-990', clientId: '2', tireCount: 6, isActive: true, type: 'Bus' },
];

const initialUsers: InternalUser[] = [
  { 
    id: '1', 
    name: 'Administrador Principal', 
    username: 'admin', 
    password: '123', 
    role: 'admin', 
    isActive: true,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  { 
    id: '2', 
    name: 'Juan Asesor', 
    username: 'asesor1', 
    password: '123', 
    role: 'advisor', 
    isActive: true,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  { 
    id: '3', 
    name: 'Maria Asesor', 
    username: 'asesor2', 
    password: '123', 
    role: 'advisor', 
    isActive: true,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
];

const initialBrands: TireBrand[] = [
  { id: '1', name: 'Continental', active: true },
  { id: '2', name: 'Michelin', active: true },
  { id: '3', name: 'Bridgestone', active: true },
];

const initialDesigns: TireDesign[] = [
  { id: '1', name: 'Terminal Master', active: true },
  { id: '2', name: 'Conti Hybrid', active: true },
  { id: '3', name: 'X Multi Z', active: true },
];

const initialDimensions: TireDimension[] = [
  { id: '1', size: '295/80R22.5', active: true },
  { id: '2', size: '11R22.5', active: true },
  { id: '3', size: '275/70R22.5', active: true },
];

interface DBSchema {
  clients: Client[];
  vehicles: Vehicle[];
  users: InternalUser[];
  reports: Report[];
  tireBrands: TireBrand[];
  tireDesigns: TireDesign[];
  tireDimensions: TireDimension[];
}

export const MockDatabase = {
  init: () => {
    if (!localStorage.getItem(DB_KEY)) {
      const db: DBSchema = {
        clients: initialClients,
        vehicles: initialVehicles,
        users: initialUsers,
        reports: [],
        tireBrands: initialBrands,
        tireDesigns: initialDesigns,
        tireDimensions: initialDimensions
      };
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
  },

  getDB: (): DBSchema => {
    MockDatabase.init();
    const parsed = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    // Ensure all arrays exist (migration safety)
    return {
      clients: parsed.clients || [],
      vehicles: parsed.vehicles || [],
      users: parsed.users || [],
      reports: parsed.reports || [],
      tireBrands: parsed.tireBrands || initialBrands,
      tireDesigns: parsed.tireDesigns || initialDesigns,
      tireDimensions: parsed.tireDimensions || initialDimensions
    };
  },

  saveDB: (db: DBSchema) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  },

  // --- Clients ---
  getClients: () => MockDatabase.getDB().clients,
  getClientById: (id: string) => MockDatabase.getDB().clients.find(c => c.id === id),
  
  saveClient: (client: Client) => {
    const db = MockDatabase.getDB();
    const index = db.clients.findIndex(c => c.id === client.id);
    if (index >= 0) {
      db.clients[index] = client; // Update
    } else {
      db.clients.unshift(client); // Create
    }
    MockDatabase.saveDB(db);
  },

  // --- Vehicles ---
  getVehicles: (clientId?: string) => {
    const all = MockDatabase.getDB().vehicles;
    return clientId ? all.filter(v => v.clientId === clientId) : all;
  },
  
  saveVehicle: (vehicle: Vehicle) => {
    const db = MockDatabase.getDB();
    const index = db.vehicles.findIndex(v => v.id === vehicle.id);
    if (index >= 0) {
      db.vehicles[index] = vehicle;
    } else {
      db.vehicles.push(vehicle);
    }
    MockDatabase.saveDB(db);
  },

  // --- Users ---
  getUsers: () => MockDatabase.getDB().users,
  
  saveUser: (user: InternalUser) => {
    const db = MockDatabase.getDB();
    const index = db.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      db.users[index] = user;
    } else {
      db.users.push(user);
    }
    MockDatabase.saveDB(db);
  },

  deleteUser: (id: string) => {
    const db = MockDatabase.getDB();
    db.users = db.users.filter(u => u.id !== id);
    MockDatabase.saveDB(db);
  },

  // --- Reports ---
  getReports: () => MockDatabase.getDB().reports,
  
  addReport: (report: Report) => {
    const db = MockDatabase.getDB();
    db.reports.unshift(report);
    MockDatabase.saveDB(db);
  },

  // --- Configuration: Brands ---
  getBrands: () => MockDatabase.getDB().tireBrands,
  saveBrand: (item: TireBrand) => {
    const db = MockDatabase.getDB();
    db.tireBrands.push(item);
    MockDatabase.saveDB(db);
  },
  deleteBrand: (id: string) => {
    const db = MockDatabase.getDB();
    db.tireBrands = db.tireBrands.filter(i => i.id !== id);
    MockDatabase.saveDB(db);
  },

  // --- Configuration: Designs ---
  getDesigns: () => MockDatabase.getDB().tireDesigns,
  saveDesign: (item: TireDesign) => {
    const db = MockDatabase.getDB();
    db.tireDesigns.push(item);
    MockDatabase.saveDB(db);
  },
  deleteDesign: (id: string) => {
    const db = MockDatabase.getDB();
    db.tireDesigns = db.tireDesigns.filter(i => i.id !== id);
    MockDatabase.saveDB(db);
  },

  // --- Configuration: Dimensions ---
  getDimensions: () => MockDatabase.getDB().tireDimensions,
  saveDimension: (item: TireDimension) => {
    const db = MockDatabase.getDB();
    db.tireDimensions.push(item);
    MockDatabase.saveDB(db);
  },
  deleteDimension: (id: string) => {
    const db = MockDatabase.getDB();
    db.tireDimensions = db.tireDimensions.filter(i => i.id !== id);
    MockDatabase.saveDB(db);
  }
};