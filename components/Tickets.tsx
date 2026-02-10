
import React, { useState } from 'react';
import { Ticket } from '../types';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  X,
  Edit
} from 'lucide-react';

interface TicketsProps { 
  tickets: Ticket[]; 
  onUpdateTickets: (t: Ticket[]) => void;
}

const Tickets: React.FC<TicketsProps> = ({ tickets, onUpdateTickets }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'open' | 'in-progress' | 'closed'>('open');

  const handleOpenModal = (ticket?: Ticket) => {
    if (ticket) {
      setEditingTicket(ticket);
      setTitle(ticket.title);
      setDescription(ticket.description);
      setPriority(ticket.priority);
      setStatus(ticket.status);
    } else {
      setEditingTicket(null);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('open');
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    if (editingTicket) {
      const updated = tickets.map(t => t.id === editingTicket.id ? {
        ...t, title, description, priority, status, updatedAt: new Date().toISOString()
      } : t);
      onUpdateTickets(updated);
    } else {
      const newTicket: Ticket = {
        id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
        title,
        description,
        priority,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Admin User'
      };
      onUpdateTickets([...tickets, newTicket]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Suporte Técnico</h1>
          <p className="text-slate-500 mt-1 font-medium">Gerencie demandas e incidentes de campo.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all flex items-center gap-2 shadow-2xl shadow-orange-900/40"
        >
          <Plus size={18} /> Cadastrar Chamado
        </button>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-8 py-5">Protocolo / Assunto</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Prioridade</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/5 transition-colors group text-sm">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{ticket.id}</span>
                      <span className="text-xs text-slate-500 mt-1">{ticket.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                      ticket.status === 'open' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                      ticket.status === 'in-progress' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in-progress' ? 'Em Curso' : 'Resolvido'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[11px] font-bold uppercase ${ticket.priority === 'high' ? 'text-rose-500' : 'text-slate-400'}`}>{ticket.priority}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleOpenModal(ticket)} className="p-2 text-slate-500 hover:text-white transition-colors">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold text-white">{editingTicket ? 'Editar Chamado' : 'Novo Chamado'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Assunto</label>
                <input value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prioridade</label>
                  <select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white">
                    <option value="low">Baixa</option>
                    <option value="medium">Normal</option>
                    <option value="high">Crítica</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white">
                    <option value="open">Aberto</option>
                    <option value="in-progress">Em Curso</option>
                    <option value="closed">Concluído</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição</label>
                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-all resize-none" />
              </div>
            </div>
            <div className="p-8 border-t border-white/5 flex gap-4 bg-white/5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-bold text-sm uppercase">Cancelar</button>
              <button onClick={handleSave} className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase rounded-2xl">{editingTicket ? 'Salvar Alterações' : 'Abrir Chamado'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
