'use client';

import { useState } from 'react';
import { ShieldAlert, Calendar, Clock, Construction } from 'lucide-react';

interface MaintenanceFormProps {
    business: 'Barberia' | 'Club';
    resources: string[];
    onSuccess: () => void;
}

export const MaintenanceForm = ({ business, resources, onSuccess }: MaintenanceFormProps) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        fecha: '',
        hora: '',
        recurso: resources[0] || '',
        duracion: '60',
        motivo: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'block_slot',
                    business,
                    blockData: data
                })
            });
            if (res.ok) {
                onSuccess();
                setData({ ...data, motivo: '', hora: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-8 rounded-[2rem] border border-orange-500/20 bg-orange-500/5 space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/20 text-orange-500">
                    <ShieldAlert size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black uppercase text-orange-500">Bloqueo de Seguridad</h2>
                    <p className="text-neutral-500 text-xs">Mantenimiento o Bloqueo Manual</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Fecha</label>
                    <input
                        type="date"
                        required
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-orange-500 outline-none"
                        value={data.fecha}
                        onChange={e => setData({ ...data, fecha: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Hora</label>
                    <input
                        type="time"
                        required
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-orange-500 outline-none"
                        value={data.hora}
                        onChange={e => setData({ ...data, hora: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Recurso</label>
                    <select
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-orange-500 outline-none"
                        value={data.recurso}
                        onChange={e => setData({ ...data, recurso: e.target.value })}
                    >
                        {resources.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Motivo</label>
                    <input
                        type="text"
                        placeholder="Mantenimiento..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-orange-500 outline-none"
                        value={data.motivo}
                        onChange={e => setData({ ...data, motivo: e.target.value })}
                    />
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-dark-bg font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs"
                    >
                        {loading ? '...' : <><Construction size={16} /> Bloquear</>}
                    </button>
                </div>
            </form>
        </div>
    );
};
