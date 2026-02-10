
import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  AlertTriangle, 
  Ticket as TicketIcon, 
  Settings, 
  ShieldCheck,
  User,
  HelpCircle,
  Users,
  ChevronDown
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stores', label: 'Gestão de Lojas', icon: Store },
    { id: 'alerts', label: 'Monitor de Alertas', icon: AlertTriangle },
    { id: 'tickets', label: 'Central de Chamados', icon: TicketIcon },
    { id: 'users', label: 'Equipe Técnica', icon: Users },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden text-slate-300">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 border-r border-white/5 bg-[#0d0d0d] flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-2xl shadow-orange-900/40 flex-shrink-0">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter text-white">SENTINEL</span>
            <span className="text-[10px] font-black tracking-[0.3em] text-orange-500/80 uppercase">Infrascan</span>
          </div>
        </div>

        <nav className="flex-1 px-5 py-4 space-y-2">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 mb-8 bg-white/5 rounded-2xl mx-1 border border-white/5 cursor-pointer hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                <User size={18} className="text-orange-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors">Admin Sentinel</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Super User</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-600 group-hover:text-white transition-colors" />
          </div>

          <div className="space-y-1">
            <p className="px-4 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Menu Principal</p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeView === item.id 
                    ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-900/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={19} className={activeView === item.id ? 'text-orange-500' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className={`font-bold text-sm tracking-tight ${activeView === item.id ? 'text-orange-500' : ''}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-5 border-t border-white/5 space-y-1 bg-black/20">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all group">
            <HelpCircle size={19} className="group-hover:text-orange-400" />
            <span className="text-sm font-bold tracking-tight">Base de Conhecimento</span>
          </button>
          <button 
            onClick={() => onViewChange('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              activeView === 'settings' 
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Settings size={19} className={activeView === 'settings' ? 'text-orange-500' : 'group-hover:text-orange-400'} />
            <span className="text-sm font-bold tracking-tight">Configurações</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#080808] relative">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
