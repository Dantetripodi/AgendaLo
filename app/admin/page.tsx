'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Users,
    DollarSign,
    CalendarCheck,
    TrendingUp,
    RotateCcw,
    ArrowRight,
    ShieldCheck,
    Ban,
    Download
} from 'lucide-react';
import { StatCard } from './components/StatCard';
import { MaintenanceForm } from './components/MaintenanceForm';
import { CLUB_COURTS } from '../../constants/club';
import { BARBER_SERVICES } from '../../constants/barberia';

export default function AdminPage() {
    const [business, setBusiness] = useState<'Barberia' | 'Club'>('Barberia');
    const [reservas, setReservas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const auth = sessionStorage.getItem('admin_auth');
        if (auth === 'true') setIsAuthenticated(true);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Contraseña por defecto: admin123
        if (password === 'admin123') {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_auth', 'true');
            setError(false);
        } else {
            setError(true);
        }
    };

    const fetchReservas = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reservas?business=${business}`);
            const data = await res.json();
            setReservas(data.reservas || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, [business]);

    // Cálculos de Estadísticas
    const stats = useMemo(() => {
        const validReservas = reservas.filter(r => r.estado !== 'Bloqueado');
        const totalReservas = validReservas.length;
        const ingresosTotales = validReservas.reduce((acc, curr) => acc + (Number(curr.precioTotal) || 0), 0);
        const senasCobradas = validReservas.reduce((acc, curr) => acc + (Number(curr.montoSena) || 0), 0);

        // Recurso más popular
        const recursoCount: Record<string, number> = {};
        validReservas.forEach(r => {
            recursoCount[r.recurso] = (recursoCount[r.recurso] || 0) + 1;
        });
        const popular = Object.entries(recursoCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

        return { totalReservas, ingresosTotales, senasCobradas, popular };
    }, [reservas]);

    const updateStatus = async (id: string, nuevoEstado: string) => {
        try {
            await fetch('/api/admin/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_status',
                    id,
                    estado: nuevoEstado,
                    business
                })
            });
            fetchReservas();
        } catch (err) {
            console.error(err);
        }
    };

    const currentResources = business === 'Club'
        ? CLUB_COURTS.map(c => c.name)
        : ['Barberia_Gral']; // Podrías expandir esto a barberos reales

    const sendWhatsApp = (res: any) => {
        const businessName = business === 'Barberia' ? 'Elite Cuts' : 'Elite Club';
        const message = encodeURIComponent(
            `¡Hola ${res.cliente}! Te confirmamos tu reserva en *${businessName}*:\n\n` +
            `📅 *Fecha:* ${res.fecha}\n` +
            `⏰ *Hora:* ${res.horaInicio}\n` +
            `📍 *Recurso:* ${res.recurso}\n\n` +
            `¡Te esperamos!`
        );
        window.open(`https://wa.me/${res.telefono.replace(/\D/g, '')}?text=${message}`, '_blank');
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center p-6 bg-[#1a1811]">
                <div className="max-w-md w-full glass p-10 rounded-[2.5rem] border border-neutral-800 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-center space-y-2">
                        <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/20">
                            <ShieldCheck className="text-accent" size={32} />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Elite <span className="text-accent">Admin</span></h1>
                        <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Centro de Control Requerido</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Contraseña Máster</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full bg-neutral-900 border ${error ? 'border-red-500/50' : 'border-neutral-800'} rounded-2xl p-4 outline-none focus:border-accent/50 transition-all text-center tracking-widest font-bold`}
                                placeholder="••••••••"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center mt-2 animate-bounce">Contraseña Incorrecta</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-accent text-dark-bg font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 uppercase tracking-widest text-xs"
                        >
                            Ingresar al Sistema
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:p-12 space-y-12">
            {/* Header PRO */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-accent">
                        <ShieldCheck size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Acceso Seguro Administrador</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#f8f7f6]">
                        Elite <span className="text-accent">Metrics</span>
                    </h1>
                    <p className="text-neutral-500 text-sm font-medium">Control total de tu negocio en tiempo real</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('admin_auth');
                            setIsAuthenticated(false);
                        }}
                        className="px-4 py-2 border border-neutral-800 rounded-xl text-[10px] font-black text-neutral-500 hover:text-red-500 hover:border-red-500/30 transition-all uppercase tracking-widest bg-neutral-900/50"
                    >
                        Cerrar Sesión
                    </button>
                    <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 shadow-2xl">
                        <button
                            onClick={() => setBusiness('Barberia')}
                            className={`px-8 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${business === 'Barberia' ? 'bg-accent text-dark-bg shadow-lg shadow-accent/20' : 'text-neutral-500 hover:text-neutral-300'
                                }`}
                        >
                            BARBERÍA
                        </button>
                        <button
                            onClick={() => setBusiness('Club')}
                            className={`px-8 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${business === 'Club' ? 'bg-accent text-dark-bg shadow-lg shadow-accent/20' : 'text-neutral-500 hover:text-neutral-300'
                                }`}
                        >
                            CLUB
                        </button>
                    </div>
                </div>
            </header>

            {/* Grid de Estadísticas */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Turnos Totales"
                    value={stats.totalReservas}
                    icon={CalendarCheck}
                    color="blue"
                    description="Volumen"
                />
                <StatCard
                    title="Ingresos Estimados"
                    value={`$${stats.ingresosTotales.toLocaleString()}`}
                    icon={DollarSign}
                    color="emerald"
                    description="Potencial"
                />
                <StatCard
                    title="Señas en Caja"
                    value={`$${stats.senasCobradas.toLocaleString()}`}
                    icon={TrendingUp}
                    color="amber"
                    description="Efectivo"
                />
                <StatCard
                    title="Top Recurso"
                    value={stats.popular}
                    icon={Users}
                    color="purple"
                    description="Favorito"
                />
            </section>

            {/* Panel de Bloqueos */}
            <MaintenanceForm
                business={business}
                resources={currentResources}
                onSuccess={fetchReservas}
            />

            {/* Tabla de Reservas */}
            <section className="glass rounded-[2.5rem] overflow-hidden border border-neutral-800 shadow-2xl">
                <div className="p-8 border-b border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                        <h2 className="text-xl font-black uppercase tracking-tight">Registro de Operaciones</h2>
                    </div>
                    <button
                        onClick={fetchReservas}
                        className="p-2 text-neutral-500 hover:text-accent transition-colors"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-neutral-900/40 text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">
                                <th className="px-8 py-5">Fecha y Hora</th>
                                <th className="px-8 py-5">Cliente / Ref</th>
                                <th className="px-8 py-5">Ubicación/Cancha</th>
                                <th className="px-8 py-5">Monto</th>
                                <th className="px-8 py-5">Estado Actual</th>
                                <th className="px-8 py-5 text-right">Detalles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center animate-pulse text-neutral-600 font-bold uppercase text-xs">
                                        Sincronizando con base de datos...
                                    </td>
                                </tr>
                            ) : (
                                reservas.map(res => (
                                    <tr key={res.id} className="hover:bg-neutral-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-[#f8f7f6]">{res.fecha}</p>
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-widest">{res.horaInicio} \ {res.horaFin}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className={`text-sm font-black ${res.estado === 'Bloqueado' ? 'text-orange-500' : 'text-[#f8f7f6]'}`}>
                                                {res.cliente}
                                            </p>
                                            <p className="text-[10px] text-neutral-500 font-bold">{res.telefono}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-neutral-900 rounded-lg text-[9px] font-black text-neutral-400 border border-neutral-800">
                                                {res.recurso}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-accent">${Number(res.precioTotal).toLocaleString()}</p>
                                            <p className="text-[9px] text-neutral-500 font-bold">SEÑA: ${Number(res.montoSena).toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${res.estado === 'Seña Pagada' || res.estado === 'Total Pagado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                res.estado === 'Bloqueado' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                    res.estado === 'Cancelado' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                }`}>
                                                {res.estado}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                {res.estado !== 'Bloqueado' && (
                                                    <>
                                                        <button
                                                            onClick={() => sendWhatsApp(res)}
                                                            className="p-2.5 bg-neutral-900 hover:bg-green-600/20 rounded-xl text-neutral-400 hover:text-green-400 transition-all border border-neutral-800"
                                                            title="Enviar Confirmación WhatsApp"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">chat</span>
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(res.id, 'Total Pagado')}
                                                            className="p-2.5 bg-neutral-900 hover:bg-emerald-600/20 rounded-xl text-neutral-400 hover:text-emerald-400 transition-all border border-neutral-800"
                                                            title="Completar Pago"
                                                        >
                                                            <ShieldCheck size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(res.id, 'Cancelado')}
                                                            className="p-2.5 bg-neutral-900 hover:bg-red-600/20 rounded-xl text-neutral-400 hover:text-red-400 transition-all border border-neutral-800"
                                                            title="Dar de Baja"
                                                        >
                                                            <Ban size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                {res.estado === 'Bloqueado' && (
                                                    <button
                                                        onClick={() => updateStatus(res.id, 'Cancelado')}
                                                        className="p-2.5 bg-neutral-900 hover:bg-neutral-600 rounded-xl text-neutral-400 transition-all border border-neutral-800"
                                                        title="Liberar Bloqueo"
                                                    >
                                                        <RotateCcw size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Footer Info */}
            <footer className="text-center pb-12">
                <p className="text-neutral-700 text-[9px] font-black uppercase tracking-[0.4em]">Elite Control Center • v4.0 Secure Access</p>
            </footer>
        </main>
    );
}

