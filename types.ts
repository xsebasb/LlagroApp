export interface Client {
  id: string;
  name: string;
  nit: string;
  email: string;
  contact: string;
  location: string;
  city: string;
  address: string;
  isActive: boolean;
}

export interface Vehicle {
  id: string;
  plate: string;
  clientId: string;
  tireCount: number;
  isActive: boolean;
  type: string;
}

export interface Tire {
  id: string;
  internalId: string;
  brand: string;
  design: string;
  dimension: string;
  type: 'Conversional (C)' | 'Radial (R)';
  mountingDate: string;
  isActive: boolean;
}

export interface InspectionData {
  position: number;
  pressure: number;
  odometer: number;
  depthExt: number;
  depthCent: number;
  depthInt: number;
  observations: string;
  tireId?: string;
}

export interface Report {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  status: 'Borrador' | 'Completado';
}

export type TabType = 'todos' | 'activos' | 'inactivos';

export type UserRole = 'admin' | 'advisor';

export interface InternalUser {
  id: string;
  name: string;
  username: string;
  password?: string; // Optional for display, required for auth
  profileImage?: string; // URL to user avatar
  role: UserRole;
  isActive: boolean;
}

export interface TireBrand {
  id: string;
  name: string;
  active: boolean;
}

export interface TireDesign {
  id: string;
  name: string;
  active: boolean;
}

export interface TireDimension {
  id: string;
  size: string;
  active: boolean;
}