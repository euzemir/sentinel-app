
import React, { useState } from 'react';
import { Alert, Asset } from '../types';
import { analyzeIncident } from '../services/geminiService';
import { 
  BrainCircuit, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  RefreshCcw,
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface AlertsProps {
  alerts: Alert[];
  onUpdateAlerts: (alerts: Alert[] | ((prev: Alert[]) => Alert[])) => void;
  assets: Asset[];
}

const Alerts: React.FC<AlertsProps> = ({ alerts, onUpdateAlerts, assets }) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const getAssetDetails = (id: string) => assets.find(a => a.id === id);

  const handleAiAnalysis = async (alert: Alert) => {
    const asset = getAssetDetails(alert.deviceId);
    const details = asset ? `IP: ${asset.ip}, Modelo: ${asset.model}, OS: ${asset.os}, Latência: ${asset.latency}ms` : "Desconhecido";
    
    setIsAnalyzing(true);
    const result = await analyzeIncident(alert.message, details);
    setAiResult(result || null);
    setIsAnalyzing(false);
  };

  const handleResolve = (id: string) => {
    onUpdateAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    setSelectedAlert(null);
    setAiResult(null);
  };

  const SeverityBadge = ({ severity }: { severity: string }) => {
    switch (severity) {
      case 'critical': return <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500 text-white">CRÍTICO</span>;
      case 'warning': return <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500 text-black">ALERTA</span>;
      default: return <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/10 text-slate-400">INFO</span>;
    }
  };

  // Filtrar apenas alertas não resolvidos para a lista principal
  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-10rem)] animate-in fade-in duration-500">
      {/* Alert List */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">Incidentes Ativos ({activeAlerts.length})</h2>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {activeAlerts.length > 0 ? activeAlerts.map((alert) => (
            <div 
              key={alert.id}
              onClick={() => { setSelectedAlert(alert); setAiResult(null); }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedAlert?.id === alert.id 
                  ? 'bg-white/10 border-white/20 ring-1 ring-orange-500/50' 
                  : 'bg-[#1a1a1a] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <SeverityBadge severity={alert.severity} />
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{alert.message}</h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                <MapPin size={10} /> {alert.deviceId}
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1a1a1a] border border-white/5 rounded-2xl opacity-50">
               <CheckCircle size={48} className="text-emerald-500 mb-4" />
               <p className="text-sm font-bold text-white uppercase tracking-widest">Tudo limpo por aqui</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail / AI Pane */}
      <div className="lg:col-span-7 flex flex-col h-full bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
        {selectedAlert ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedAlert.message}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500">ID: {selectedAlert.id}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-xs text-orange-500 font-bold uppercase tracking-widest">Status: Crítico</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleResolve(selectedAlert.id)}
                  className="px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white text-xs font-bold rounded-xl transition-all border border-emerald-500/20 flex items-center gap-2"
                >
                  <CheckCircle size={14} /> Fechar Incidente
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Hostname</p>
                  <p className="text-sm font-medium text-white truncate">{getAssetDetails(selectedAlert.deviceId)?.name || 'N/A'}</p>
                </div>
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Endereço IP</p>
                  <p className="mono text-sm text-orange-500">{getAssetDetails(selectedAlert.deviceId)?.ip || 'N/A'}</p>
                </div>
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Monitor</p>
                  <p className="text-sm text-white uppercase font-bold">Telemetria</p>
                </div>
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Impacto</p>
                  <p className="mono text-sm text-rose-500 font-bold">ALTO</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl overflow-hidden p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                      <BrainCircuit className="text-white" size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2 text-lg">
                        Sentinel AI Diagnostic
                        <Sparkles size={16} className="text-orange-500" />
                      </h4>
                      <p className="text-sm text-slate-500">Causa raiz e recomendações imediatas</p>
                    </div>
                  </div>
                  {!aiResult && !isAnalyzing && (
                    <button 
                      onClick={() => handleAiAnalysis(selectedAlert)}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-xl shadow-orange-900/30"
                    >
                      Processar Diagnóstico
                    </button>
                  )}
                </div>

                {isAnalyzing && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-orange-500 animate-pulse uppercase tracking-widest">Analisando Telemetria...</p>
                  </div>
                )}

                {aiResult && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-black/40 p-8 rounded-2xl border border-white/5 leading-relaxed text-slate-300 text-sm whitespace-pre-wrap">
                      {aiResult}
                    </div>
                    <div className="mt-4 flex justify-end">
                       <button onClick={() => setAiResult(null)} className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors">Limpar Análise</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
            <AlertTriangle size={64} className="text-slate-600 mb-6" />
            <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Selecione um evento para análise</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
