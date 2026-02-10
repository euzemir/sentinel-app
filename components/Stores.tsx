
import React, { useState } from 'react';
import { Store, AssetType, Status, Asset } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ChevronRight, 
  Cpu, 
  Wifi, 
  Clock, 
  Search,
  Plus,
  Monitor,
  Package,
  MapPin,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Notebook,
  HardDrive,
  Layers
} from 'lucide-react';

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'normal': return <CheckCircle2 className="text-emerald-500" size={20} />;
    case 'warning': return <AlertCircle className="text-amber-500" size={20} />;
    case 'critical': return <XCircle className="text-rose-500" size={20} />;
    default: return null;
  }
};

const UsageIndicator = ({ label, value, icon: Icon }: { label: string, value?: number, icon: any }) => {
  if (value === undefined) return <span className="text-slate-600 text-[10px] font-bold">--</span>;
  
  const getColor = (val: number) => {
    if (val > 80) return 'text-rose-500';
    if (val > 60) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="flex flex-col gap-1 w-24">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1"><Icon size={10} /> {label}</span>
        <span className={getColor(value)}>{value}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${value > 80 ? 'bg-rose-500' : value > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

interface StoreCardProps {
  store: Store;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick, onEdit, onDelete }) => (
  <div 
    onClick={onClick}
    className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-orange-500/50 transition-all group relative"
  >
    <div className="absolute top-4 right-4 flex gap-2 z-30">
      <button 
        onClick={(e) => { e.stopPropagation(); onEdit(e); }}
        className="p-2.5 bg-black/80 hover:bg-orange-500/20 text-slate-400 hover:text-orange-500 rounded-xl border border-white/10 backdrop-blur-md transition-all md:opacity-0 group-hover:opacity-100"
      >
        <Edit2 size={16} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(e); }}
        className="p-2.5 bg-black/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-xl border border-white/10 backdrop-blur-md transition-all md:opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={16} />
      </button>
    </div>

    <div className="flex items-start justify-between mb-4">
      <div className="p-2 bg-white/5 rounded-lg">
        <StatusIcon status={store.status} />
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-20 truncate">{store.region}</span>
    </div>
    <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">{store.name}</h3>
    <div className="flex items-center gap-1.5 mt-1 mb-6 text-slate-500">
      <MapPin size={12} />
      <p className="text-xs truncate">{store.address}</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col p-3 bg-white/5 rounded-xl border border-white/5">
        <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mb-1 uppercase font-bold tracking-wider">
          <Cpu size={12} className="text-orange-500" /> INVENTÁRIO
        </span>
        <span className="text-lg font-bold text-white">{store.assets.length} Itens</span>
      </div>
      <div className="flex flex-col p-3 bg-white/5 rounded-xl border border-white/5">
        <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mb-1 uppercase font-bold tracking-wider">
          <Wifi size={12} className="text-orange-500" /> REDE
        </span>
        <span className="text-lg font-bold text-white">Stable</span>
      </div>
    </div>
    
    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
        <Clock size={12} /> SYNC: AGORA
      </span>
      <ChevronRight size={16} className="text-slate-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
    </div>
  </div>
);

interface StoresProps {
  stores: Store[];
  onUpdateStores: (newStoresOrFn: Store[] | ((prev: Store[]) => Store[])) => void;
}

const Stores: React.FC<StoresProps> = ({ stores, onUpdateStores }) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [storeIdToDelete, setStoreIdToDelete] = useState<string | null>(null);

  // Store Form
  const [formName, setFormName] = useState('');
  const [formRegion, setFormRegion] = useState('');
  const [formAddress, setFormAddress] = useState('');

  // Device Form
  const [devName, setDevName] = useState('');
  const [devType, setDevType] = useState<AssetType>(AssetType.PDV);
  const [devIP, setDevIP] = useState('');
  const [devMAC, setDevMAC] = useState('');
  const [devObs, setDevObs] = useState('');
  const [devStoreId, setDevStoreId] = useState('');

  const selectedStore = stores.find(s => s.id === selectedStoreId) || null;

  const openRegisterModal = () => {
    setEditingStore(null);
    setFormName('');
    setFormRegion('');
    setFormAddress('');
    setShowStoreModal(true);
  };

  const openEditModal = (e: React.MouseEvent, store: Store) => {
    e.stopPropagation();
    setEditingStore(store);
    setFormName(store.name);
    setFormRegion(store.region);
    setFormAddress(store.address);
    setShowStoreModal(true);
  };

  const initiateDelete = (e: React.MouseEvent, storeId: string) => {
    e.stopPropagation();
    setStoreIdToDelete(storeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (storeIdToDelete) {
      onUpdateStores((prevStores: Store[]) => prevStores.filter(s => s.id !== storeIdToDelete));
      if (selectedStoreId === storeIdToDelete) setSelectedStoreId(null);
      setShowDeleteModal(false);
      setStoreIdToDelete(null);
    }
  };

  const handleSaveStore = () => {
    if (!formName.trim() || !formRegion.trim()) { alert('Preencha os campos obrigatórios.'); return; }
    if (editingStore) {
      onUpdateStores((prev: Store[]) => prev.map(s => s.id === editingStore.id ? { ...s, name: formName, region: formRegion, address: formAddress } : s));
    } else {
      const newStore: Store = { id: Math.random().toString(36).substr(2, 9), name: formName, region: formRegion, address: formAddress, status: 'normal', assets: [] };
      onUpdateStores((prev: Store[]) => [...prev, newStore]);
    }
    setShowStoreModal(false);
  };

  const handleOpenDeviceModal = (storeId?: string) => {
    setDevStoreId(storeId || '');
    setDevName('');
    setDevIP('');
    setDevMAC('');
    setDevObs('');
    setDevType(AssetType.PDV);
    setShowDeviceModal(true);
  };

  const handleSaveDevice = () => {
    if (!devName.trim() || !devIP.trim() || !devStoreId) { alert('Preencha Nome, IP e Localização.'); return; }
    
    const newAsset: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      name: devName,
      type: devType,
      ip: devIP,
      mac: devMAC,
      observation: devObs,
      storeId: devStoreId,
      status: 'normal',
      latency: 0,
      lastSeen: new Date().toISOString(),
      cpuUsage: 0,
      diskUsage: 0
    };

    onUpdateStores((prev: Store[]) => prev.map(s => s.id === devStoreId ? { ...s, assets: [...s.assets, newAsset] } : s));
    setShowDeviceModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {selectedStore ? (
        /* Detalhes da Loja Selecionada */
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedStoreId(null)} className="p-3 bg-[#1a1a1a] border border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedStore.name}</h2>
                <span className="text-[10px] px-2 py-0.5 bg-orange-500 text-white rounded font-bold uppercase tracking-wider">Unidade Monitorada</span>
              </div>
            </div>
            <button 
              onClick={() => handleOpenDeviceModal(selectedStore.id)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-xl shadow-orange-900/20 flex items-center gap-2"
            >
              <Plus size={18} /> Cadastrar Dispositivo
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2">
                    <Package size={16} className="text-orange-500" /> Inventário Local ({selectedStore.assets.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                        <th className="px-8 py-4">Patrimônio / Tipo</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">IP / MAC</th>
                        <th className="px-8 py-4">Telemetria</th>
                        <th className="px-8 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {selectedStore.assets.length > 0 ? selectedStore.assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-white">{asset.name}</span>
                              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{asset.type}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${asset.status === 'normal' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                              {asset.status === 'normal' ? 'Online' : 'Offline'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-1">
                              <span className="mono text-[11px] text-orange-500">{asset.ip}</span>
                              <span className="text-[10px] font-bold text-slate-500">{asset.mac}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-6">
                              <UsageIndicator label="CPU" value={asset.cpuUsage} icon={Cpu} />
                              <UsageIndicator label="Disco" value={asset.diskUsage} icon={HardDrive} />
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-2 bg-white/5 rounded-lg text-slate-500 hover:text-orange-500 transition-colors">
                              <Monitor size={16} />
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center text-slate-600 font-medium">Nenhum dispositivo cadastrado nesta unidade.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Lista de Todas as Lojas */
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Gestão de Unidades</h1>
              <p className="text-slate-500 mt-1 font-medium">Monitoramento centralizado de lojas e infraestrutura.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleOpenDeviceModal()}
                className="bg-white/5 hover:bg-white/10 text-slate-400 font-bold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2 border border-white/5"
              >
                <Plus size={18} /> Dispositivo
              </button>
              <button onClick={openRegisterModal} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-xl shadow-orange-900/20">
                <Plus size={18} /> Cadastrar Loja
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} onClick={() => setSelectedStoreId(store.id)} onEdit={(e) => openEditModal(e, store)} onDelete={(e) => initiateDelete(e, store.id)} />
            ))}
          </div>
        </>
      )}

      {/* Modais (Renderizados sempre, permitindo ativação em qualquer visão) */}
      
      {/* Modal Dispositivo */}
      {showDeviceModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Monitor className="text-orange-500" /> Cadastrar Dispositivo
              </h2>
              <button onClick={() => setShowDeviceModal(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome do Dispositivo</label>
                <input type="text" value={devName} onChange={e => setDevName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all font-medium" placeholder="Ex: PDV 01 - Caixa" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo de Ativo</label>
                <select 
                  value={devType} 
                  onChange={e => setDevType(e.target.value as AssetType)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                >
                  {Object.values(AssetType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Endereço IP</label>
                <input type="text" value={devIP} onChange={e => setDevIP(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all font-medium" placeholder="192.168..." />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unidade Destino</label>
                <select 
                  value={devStoreId} 
                  onChange={e => setDevStoreId(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all cursor-pointer"
                >
                  <option value="">Selecione a unidade...</option>
                  {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Endereço MAC</label>
                <input type="text" value={devMAC} onChange={e => setDevMAC(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all font-medium" placeholder="00:00..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Telemetria</label>
                <div className="flex items-center h-full px-4 border border-white/5 bg-white/5 rounded-xl text-slate-500 gap-2">
                  <Layers size={14} /> Automática
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Observações Técnicas</label>
                <textarea rows={3} value={devObs} onChange={e => setDevObs(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all resize-none" placeholder="Detalhes adicionais..." />
              </div>
            </div>
            <div className="p-8 border-t border-white/5 flex gap-4 bg-white/5">
              <button onClick={() => setShowDeviceModal(false)} className="flex-1 py-4 text-slate-500 font-bold text-sm uppercase">Cancelar</button>
              <button onClick={handleSaveDevice} className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase rounded-2xl shadow-xl shadow-orange-900/30">Confirmar Registro</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Loja */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">{editingStore ? 'Editar Unidade' : 'Cadastrar Unidade'}</h2>
              <button onClick={() => setShowStoreModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome da Loja</label>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Região</label>
                <input type="text" value={formRegion} onChange={e => setFormRegion(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Endereço</label>
                <input type="text" value={formAddress} onChange={e => setFormAddress(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all font-medium" />
              </div>
            </div>
            <div className="p-8 border-t border-white/5 flex gap-4 bg-white/5">
              <button onClick={() => setShowStoreModal(false)} className="flex-1 py-4 text-slate-500 font-bold text-sm uppercase hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleSaveStore} className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase rounded-2xl shadow-xl shadow-orange-900/30 transition-all">{editingStore ? 'Salvar Alterações' : 'Finalizar Cadastro'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Deletar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] border border-rose-500/20 rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-rose-500" /></div>
              <h2 className="text-xl font-bold text-white">Excluir Unidade?</h2>
              <p className="text-sm text-slate-400 leading-relaxed">Esta ação é irreversível.</p>
            </div>
            <div className="p-6 border-t border-white/5 flex gap-3 bg-white/5">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3.5 text-slate-400 font-bold text-xs uppercase">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase rounded-xl">Excluir Agora</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
