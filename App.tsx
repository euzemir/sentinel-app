
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Stores from './components/Stores';
import Alerts from './components/Alerts';
import Tickets from './components/Tickets';
import { mockStores as initialStores, mockAlerts as initialAlerts, mockTickets } from './mockData';
import { Asset, Store, Ticket, User, NotificationSettings, Alert } from './types';
import { Users, Shield, Mail, Send, BellRing, Settings as SettingsIcon, X, UserPlus, CheckCircle, Edit2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin Principal', email: 'admin@sentinel.com', role: 'admin', permissions: ['all'] }
  ]);
  
  // Simulação de Telemetria em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setStores(prevStores => prevStores.map(store => ({
        ...store,
        assets: store.assets.map(asset => {
          // Apenas dispositivos com sistema operacional/processamento simulam variação
          if (asset.cpuUsage !== undefined && asset.diskUsage !== undefined) {
            const cpuVar = Math.floor(Math.random() * 5) - 2; // Var de -2% a +2%
            return {
              ...asset,
              cpuUsage: Math.max(0, Math.min(100, asset.cpuUsage + cpuVar))
            };
          }
          return asset;
        })
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Modais de Usuário
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'tech' | 'viewer'>('viewer');

  // Configurações de Notificação
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>({
    telegramEnabled: false,
    telegramWebhook: '',
    discordEnabled: false,
    discordWebhook: '',
    emailEnabled: true,
    emailAddress: 'suporte@sentinel.com'
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  const allAssets: Asset[] = stores.flatMap(store => store.assets);

  const handleUpdateStores = (newStoresOrFn: Store[] | ((prev: Store[]) => Store[])) => {
    setStores(newStoresOrFn);
  };

  const handleUpdateAlerts = (newAlertsOrFn: Alert[] | ((prev: Alert[]) => Alert[])) => {
    setAlerts(newAlertsOrFn);
  };

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('viewer');
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserRole(user.role);
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (!newUserName || !newUserEmail) return;

    if (editingUser) {
      const updatedUsers = users.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: newUserName, email: newUserEmail, role: newUserRole, permissions: [newUserRole === 'admin' ? 'all' : 'restricted'] }
          : u
      );
      setUsers(updatedUsers);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        permissions: [newUserRole === 'admin' ? 'all' : 'restricted']
      };
      setUsers([...users, newUser]);
    }

    setShowUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setEditingUser(null);
  };

  const handleSaveSettings = () => {
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      alert('Configurações de envio atualizadas com sucesso!');
    }, 800);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard stores={stores} alerts={alerts} onViewChange={setActiveView} />;
      case 'stores':
        return <Stores stores={stores} onUpdateStores={handleUpdateStores} />;
      case 'alerts':
        return <Alerts alerts={alerts} onUpdateAlerts={handleUpdateAlerts} assets={allAssets} />;
      case 'tickets':
        return <Tickets tickets={tickets} onUpdateTickets={setTickets} />;
      case 'users':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Gestão de Usuários</h1>
                <p className="text-slate-500 mt-1 font-medium">Controle de acesso e permissões da equipe.</p>
              </div>
              <button 
                onClick={handleOpenAddUser}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-xl shadow-orange-900/20 flex items-center gap-2"
              >
                <UserPlus size={18} /> Adicionar Usuário
              </button>
            </div>
            
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-8 py-4">Nome / Email</th>
                    <th className="px-8 py-4">Função</th>
                    <th className="px-8 py-4">Acesso</th>
                    <th className="px-8 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{u.name}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-orange-500/20 text-orange-500' : 
                          u.role === 'tech' ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-400">
                        {u.role === 'admin' ? 'Acesso Total' : u.role === 'tech' ? 'Operação e Manutenção' : 'Apenas Leitura'}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleOpenEditUser(u)}
                          className="flex items-center gap-2 ml-auto text-slate-500 hover:text-white font-bold text-xs transition-colors"
                        >
                          <Edit2 size={14} /> Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showUserModal && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150] flex items-center justify-center p-6">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{editingUser ? 'Editar Membro da Equipe' : 'Novo Membro da Equipe'}</h2>
                    <button onClick={() => setShowUserModal(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome Completo</label>
                      <input value={newUserName} onChange={e => setNewUserName(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all" placeholder="Nome do colaborador" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Corporativo</label>
                      <input value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} type="email" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all" placeholder="email@empresa.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nível de Permissão</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['admin', 'tech', 'viewer'] as const).map((r) => (
                          <button 
                            key={r}
                            onClick={() => setNewUserRole(r)}
                            className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                              newUserRole === r ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/5 text-slate-500'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 border-t border-white/5 flex gap-4">
                    <button onClick={() => setShowUserModal(false)} className="flex-1 py-4 text-slate-500 font-bold text-sm uppercase">Cancelar</button>
                    <button onClick={handleSaveUser} className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase rounded-2xl">
                      {editingUser ? 'Salvar Alterações' : 'Cadastrar Agora'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Canais de Notificação</h1>
              <p className="text-slate-500 mt-1 font-medium">Configure os destinos para onde os alertas críticos serão disparados.</p>
            </div>
            
            <div className="grid gap-6">
              {[
                { 
                  id: 'telegram', 
                  label: 'Telegram Bot', 
                  icon: Send, 
                  color: 'text-sky-400', 
                  field: 'Webhook / Token API', 
                  enabled: notifSettings.telegramEnabled,
                  value: notifSettings.telegramWebhook,
                  setter: (val: string) => setNotifSettings({...notifSettings, telegramWebhook: val}),
                  toggler: () => setNotifSettings({...notifSettings, telegramEnabled: !notifSettings.telegramEnabled})
                },
                { 
                  id: 'discord', 
                  label: 'Discord Webhook', 
                  icon: BellRing, 
                  color: 'text-indigo-400', 
                  field: 'Server Webhook URL', 
                  enabled: notifSettings.discordEnabled,
                  value: notifSettings.discordWebhook,
                  setter: (val: string) => setNotifSettings({...notifSettings, discordWebhook: val}),
                  toggler: () => setNotifSettings({...notifSettings, discordEnabled: !notifSettings.discordEnabled})
                },
                { 
                  id: 'email', 
                  label: 'Email Dispatcher', 
                  icon: Mail, 
                  color: 'text-orange-400', 
                  field: 'Endereço de Destino', 
                  enabled: notifSettings.emailEnabled,
                  value: notifSettings.emailAddress,
                  setter: (val: string) => setNotifSettings({...notifSettings, emailAddress: val}),
                  toggler: () => setNotifSettings({...notifSettings, emailEnabled: !notifSettings.emailEnabled})
                },
              ].map(channel => (
                <div key={channel.id} className={`bg-[#1a1a1a] border transition-all p-8 rounded-3xl flex gap-6 items-start ${channel.enabled ? 'border-orange-500/20' : 'border-white/5'}`}>
                  <div className={`p-4 rounded-2xl bg-white/5 ${channel.color}`}>
                    <channel.icon size={32} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{channel.label}</h3>
                        <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Status: {channel.enabled ? 'Ativo' : 'Inativo'}</p>
                      </div>
                      <div 
                        onClick={channel.toggler}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${channel.enabled ? 'bg-orange-500' : 'bg-slate-800'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${channel.enabled ? 'right-1 shadow-sm' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <div className={`space-y-2 transition-opacity ${channel.enabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{channel.field}</label>
                      <input 
                        type="text" 
                        value={channel.value}
                        onChange={e => channel.setter(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all font-medium" 
                        placeholder="https://..." 
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4">
                <button 
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 text-white font-bold px-12 py-4 rounded-2xl shadow-xl shadow-orange-900/20 transition-all flex items-center justify-center gap-3"
                >
                  {isSavingSettings ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle size={20} />
                  )}
                  {isSavingSettings ? 'Sincronizando...' : 'Salvar Todas as Configurações'}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard stores={stores} alerts={alerts} onViewChange={setActiveView} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={(view) => setActiveView(view)}>
      {renderView()}
    </Layout>
  );
};

export default App;
