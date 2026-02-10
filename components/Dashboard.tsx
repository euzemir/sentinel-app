
import React, { useMemo } from 'react';
import { 
  Activity, 
  Server, 
  ShieldAlert, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronDown,
  Globe,
  PieChart,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Store, Alert, AssetType } from '../types';

const bandwidthData = [
  { time: 'Seg', mbps: 420 },
  { time: 'Ter', mbps: 380 },
  { time: 'Qua', mbps: 510 },
  { time: 'Qui', mbps: 290 },
  { time: 'Sex', mbps: 640 },
  { time: 'Sab', mbps: 245 },
  { time: 'Dom', mbps: 180 },
];

interface DashboardProps {
  stores: Store[];
  alerts: Alert[];
  onViewChange: (view: string) => void;
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendPositive, onClick, isCritical }: any) => (
  <div 
    onClick={onClick}
    className={`bg-[#1a1a1a] border p-6 rounded-2xl transition-all cursor-pointer hover:bg-white/[0.02] group relative overflow-hidden ${
      isCritical ? 'border-rose-500/40 shadow-lg shadow-rose-900/10' : 'border-white/5 hover:border-orange-500/30'
    }`}
  >
    {isCritical && (
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl -mr-16 -mt-16 animate-pulse" />
    )}
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-2 rounded-lg transition-colors ${
        isCritical ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/5 text-slate-400 group-hover:text-orange-500'
      }`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${trendPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="flex flex-col relative z-10">
      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold mt-1 transition-colors ${isCritical ? 'text-rose-500' : 'text-white group-hover:text-orange-500'}`}>
          {value}
        </span>
        {subtitle && <span className="text-[10px] text-slate-500 font-bold uppercase">{subtitle}</span>}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stores, alerts, onViewChange }) => {
  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  const isAlertCritical = activeAlertsCount > 0;

  const stats = useMemo(() => {
    const allAssets = stores.flatMap(s => s.assets);
    return {
      online: allAssets.filter(a => a.status === 'normal').length,
      total: allAssets.length,
      servers: allAssets.filter(a => a.type === AssetType.SERVER).length,
      pdvs: allAssets.filter(a => a.type === AssetType.PDV).length,
      switches: allAssets.filter(a => a.type === AssetType.SWITCH).length,
    };
  }, [stores]);

  const criticalAssets = useMemo(() => {
    return stores.flatMap(s => s.assets.filter(a => a.status === 'critical' || a.status === 'warning')).slice(0, 5);
  }, [stores]);

  // Cálculo preciso para o anel do gráfico
  const donutPercentage = stats.total > 0 ? (stats.online / stats.total) * 100 : 0;
  const strokeDasharray = 251.2; // 2 * PI * r (r=40)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * donutPercentage) / 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Dispositivos Online" 
          value={stats.online} 
          subtitle={`de ${stats.total}`}
          icon={Activity} 
          trend={12} 
          trendPositive={true}
          onClick={() => onViewChange('stores')}
        />
        <StatCard 
          title="Alertas Ativos" 
          value={activeAlertsCount} 
          icon={ShieldAlert} 
          trend={activeAlertsCount > 5 ? -15 : 5} 
          trendPositive={activeAlertsCount === 0}
          isCritical={isAlertCritical}
          onClick={() => onViewChange('alerts')}
        />
        <StatCard 
          title="Uptime Estimado" 
          value="99.9%" 
          subtitle="Últimos 30 dias"
          icon={Clock} 
          trend={0.1} 
          trendPositive={true}
          onClick={() => onViewChange('stores')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Consumo de Tráfego (Local)</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
              <span className="text-xs font-bold text-slate-300">Setembro / 2024</span>
              <ChevronDown size={14} className="text-slate-500" />
            </div>
          </div>
          
          <div className="flex-1 min-h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bandwidthData}>
                <defs>
                  <linearGradient id="colorMbps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={15}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                  stroke="#555" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}Mb`}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip 
                  cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: '#111', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#f97316', fontWeight: 'bold', fontSize: '12px' }}
                  labelStyle={{ color: '#999', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
                  formatter={(value: number) => [`${value} Mbps`, 'Download']}
                />
                <Area 
                  type="monotone" 
                  dataKey="mbps" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMbps)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div 
            onClick={() => onViewChange('stores')}
            className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 flex flex-col items-center cursor-pointer hover:border-orange-500/20 transition-all shadow-lg"
          >
            <div className="flex items-center justify-between w-full mb-8">
              <h3 className="text-lg font-bold text-white tracking-tight">Inventário de Rede</h3>
              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">SAUDÁVEL</span>
            </div>
            
            <div className="relative w-full aspect-square max-w-[200px] flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%" cy="50%" r="40%"
                  fill="transparent"
                  stroke="#222"
                  strokeWidth="16"
                />
                <circle
                  cx="50%" cy="50%" r="40%"
                  fill="transparent"
                  stroke="#f97316"
                  strokeWidth="16"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{stats.online}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Dispositivos</span>
              </div>
            </div>

            <div className="w-full space-y-4 mt-10">
              {[
                { label: 'Servidores', value: stats.servers, color: 'bg-orange-500' },
                { label: 'PDVs / Caixas', value: stats.pdvs, color: 'bg-orange-300' },
                { label: 'Infra (Switches)', value: stats.switches, color: 'bg-white' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm group-hover/item:scale-125 transition-transform`}></div>
                    <span className="text-xs font-semibold text-slate-400 group-hover/item:text-slate-200 transition-colors">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{item.value} Unid.</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-white tracking-tight">Dispositivos em Observação</h3>
            <span className="bg-rose-500/10 text-rose-500 text-[10px] px-2 py-0.5 rounded font-black">{criticalAssets.length} ALARMES</span>
          </div>
          <button 
            onClick={() => onViewChange('alerts')}
            className="text-[10px] uppercase font-black text-orange-500 hover:text-orange-400 transition-colors tracking-widest"
          >
            Análise Avançada
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-widest font-black border-b border-white/5 bg-black/20">
                <th className="px-8 py-4">Equipamento</th>
                <th className="px-8 py-4">Localização</th>
                <th className="px-8 py-4">Endereço IP</th>
                <th className="px-8 py-4">Latência</th>
                <th className="px-8 py-4">Status Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {criticalAssets.length > 0 ? criticalAssets.map((asset, i) => (
                <tr 
                  key={i} 
                  onClick={() => onViewChange('alerts')}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:border-orange-500/30 group-hover:text-orange-500 transition-all">
                         {asset.name.split(' ')[0].charAt(0)}{asset.name.split(' ')[1]?.charAt(0) || ''}
                       </div>
                       <span className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-400">{stores.find(s => s.id === asset.storeId)?.name}</td>
                  <td className="px-8 py-6 text-xs text-slate-500 mono font-medium">{asset.ip}</td>
                  <td className="px-8 py-6 text-xs font-bold text-orange-500 mono">{asset.latency}ms</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      asset.status === 'normal' ? 'bg-emerald-500/10 text-emerald-500' : 
                      asset.status === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {asset.status === 'normal' ? 'Ativo' : asset.status === 'warning' ? 'Atenção' : 'Crítico'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-500 font-bold uppercase tracking-widest opacity-50">Nenhum evento de alta prioridade nas últimas 24h.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
