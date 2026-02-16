'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import { WHATSAPP_NUMBER_CLUB } from '../../../constants/club';
import { WHATSAPP_NUMBER } from '../../../constants/barberia';

export default function CancelarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const business = searchParams.get('b') as 'Barberia' | 'Club';

    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [resData, setResData] = useState<any>(null);

    const ownerWhatsApp = business === 'Club' ? WHATSAPP_NUMBER_CLUB : WHATSAPP_NUMBER;

    const handleCancelar = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/cancelar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, business })
            });
            const data = await res.json();
            if (data.success) {
                setDone(true);
                setResData(data);
            } else {
                setError(data.error || 'Error al cancelar');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleNotifyNotify = () => {
        const message = encodeURIComponent(
            `❌ *CANCELACIÓN DE TURNO*\n\n` +
            `👤 Cliente: ${resData.cliente}\n` +
            `📅 Fecha: ${resData.fecha}\n` +
            `⏰ Hora: ${resData.hora}\n\n` +
            `El horario ya ha sido liberado automáticamente en el sistema.`
        );
        window.open(`https://wa.me/${ownerWhatsApp}?text=${message}`, '_blank');
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-dark-bg">
            <div className="max-w-md w-full glass p-8 md:p-10 rounded-[2.5rem] text-center space-y-8 border border-neutral-800 shadow-2xl">
                {!done ? (
                    <>
                        <div className="bg-red-500/10 p-5 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-red-500">
                            <ShieldAlert size={40} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">¿Cancelar Turno?</h1>
                            <p className="text-neutral-500 text-sm">Esta acción es irreversible y el horario se liberará para otro cliente.</p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase">
                                {error}
                            </div>
                        )}

                        <div className="pt-4 flex flex-col gap-3">
                            <button
                                onClick={handleCancelar}
                                disabled={loading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                                {loading ? 'PROCESANDO...' : 'SÍ, CANCELAR TURNO'}
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="w-full bg-neutral-900 text-neutral-400 font-bold py-4 rounded-2xl transition-all hover:text-white"
                            >
                                VOLVER
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-green-500/10 p-5 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-green-500">
                            <CheckCircle size={40} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Cancelado</h1>
                            <p className="text-neutral-500 text-sm">Tu turno ha sido dado de baja correctamente.</p>
                        </div>

                        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 space-y-2">
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Resumen</p>
                            <p className="text-lg font-black">{resData.fecha} - {resData.hora}</p>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button
                                onClick={handleNotifyNotify}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-500/10"
                            >
                                <span className="material-symbols-outlined">chat</span>
                                NOTIFICAR POR WHATSAPP
                            </button>
                            <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Aviso: El dueño del local será notificado.</p>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
