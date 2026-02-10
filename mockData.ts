
import { Store, AssetType, Status, Asset, Alert, Ticket } from './types';

const generateAssets = (storeId: string): Asset[] => [
  {
    id: `pdv-${storeId}-1`,
    name: `PDV 01`,
    type: AssetType.PDV,
    ip: `192.168.${storeId}.10`,
    mac: '00:1A:2B:3C:4D:5E',
    latency: 12,
    lastSeen: new Date().toISOString(),
    status: 'normal',
    storeId,
    os: 'Windows 10 IoT',
    model: 'Toshiba TCx700',
    cpuUsage: 24,
    diskUsage: 45
  },
  {
    id: `pdv-${storeId}-2`,
    name: `PDV 02`,
    type: AssetType.PDV,
    ip: `192.168.${storeId}.11`,
    mac: '00:1A:2B:3C:4D:5F',
    latency: 154,
    lastSeen: new Date().toISOString(),
    status: 'warning',
    storeId,
    os: 'Windows 10 IoT',
    model: 'Toshiba TCx700',
    cpuUsage: 89,
    diskUsage: 92
  },
  {
    id: `srv-${storeId}-1`,
    name: `Local Server`,
    type: AssetType.SERVER,
    ip: `192.168.${storeId}.2`,
    mac: 'AA:BB:CC:DD:EE:FF',
    latency: 2,
    lastSeen: new Date().toISOString(),
    status: 'normal',
    storeId,
    os: 'Ubuntu 22.04 LTS',
    model: 'Dell PowerEdge R640',
    cpuUsage: 12,
    diskUsage: 30
  },
  {
    id: `sw-${storeId}-1`,
    name: `Core Switch`,
    type: AssetType.SWITCH,
    ip: `192.168.${storeId}.1`,
    mac: '11:22:33:44:55:66',
    latency: 1,
    lastSeen: new Date().toISOString(),
    status: 'normal',
    storeId,
    model: 'Cisco Catalyst 9200',
    cpuUsage: 5,
    diskUsage: 0
  }
];

export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Loja Matriz - São Paulo',
    status: 'normal',
    region: 'Sudeste',
    address: 'Av. Paulista, 1000',
    assets: generateAssets('1')
  },
  {
    id: '2',
    name: 'Filial 02 - Rio de Janeiro',
    status: 'critical',
    region: 'Sudeste',
    address: 'Rua do Ouvidor, 50',
    assets: generateAssets('2')
  },
  {
    id: '3',
    name: 'Filial 03 - Curitiba',
    status: 'warning',
    region: 'Sul',
    address: 'Rua XV de Novembro, 200',
    assets: generateAssets('3')
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    timestamp: new Date().toISOString(),
    severity: 'critical',
    message: 'Servidor Local Offline em Filial 02',
    deviceId: 'srv-2-1',
    resolved: false
  },
  {
    id: 'a2',
    timestamp: new Date().toISOString(),
    severity: 'warning',
    message: 'Latência alta Detectada no PDV 02 - Matriz',
    deviceId: 'pdv-1-2',
    resolved: false
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 'T-1001',
    title: 'Falha na impressora fiscal PDV 05',
    description: 'A impressora não está respondendo aos comandos de impressão de cupom.',
    priority: 'high',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Operador Silva'
  }
];
