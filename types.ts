
export type Status = 'normal' | 'warning' | 'critical';

export enum AssetType {
  PDV = 'PDV',
  SCALE = 'Balança',
  SERVER = 'Servidor',
  PRINTER = 'Impressora',
  SWITCH = 'Switch'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  ip: string;
  mac: string;
  latency: number;
  lastSeen: string;
  status: Status;
  storeId: string;
  os?: string;
  model?: string;
  purchaseDate?: string;
  observation?: string;
  cpuUsage?: number;
  diskUsage?: number;
}

export interface Store {
  id: string;
  name: string;
  status: Status;
  region: string;
  address: string;
  assets: Asset[];
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: Status;
  message: string;
  deviceId: string;
  resolved: boolean;
  aiAnalysis?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'closed';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tech' | 'viewer';
  permissions: string[];
}

export interface NotificationSettings {
  telegramEnabled: boolean;
  telegramWebhook: string;
  discordEnabled: boolean;
  discordWebhook: string;
  emailEnabled: boolean;
  emailAddress: string;
}
