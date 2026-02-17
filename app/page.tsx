'use client';
// Version: 1.0.1 - Security Patched

import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-[#f8f7f6]">
                    ELITE <span className="text-accent">BOOK</span>
                </h1>
                <p className="text-neutral-500 font-bold tracking-[0.3em] text-sm uppercase">Sistema de Gestión Centralizada</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                <Link href="/barberia" className="group relative glass rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6 hover:border-accent/40 shadow-2xl transition-all hover:scale-[1.02]">
                    <div className="bg-accent/10 p-6 rounded-full group-hover:bg-accent/20 transition-colors">
                        <span className="material-symbols-outlined text-accent text-6xl">content_cut</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold uppercase tracking-tight">Barbería & Spa</h2>
                        <p className="text-neutral-500 mt-2 text-sm leading-relaxed">Gestión de turnos para cortes, barba y estética masculina.</p>
                    </div>
                    <div className="pt-4">
                        <span className="bg-accent text-dark-bg px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest group-hover:shadow-lg shadow-accent/20">Entrar</span>
                    </div>
                </Link>

                <Link href="/club" className="group relative glass rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6 hover:border-accent/40 shadow-2xl transition-all hover:scale-[1.02]">
                    <div className="bg-accent/10 p-6 rounded-full group-hover:bg-accent/20 transition-colors">
                        <span className="material-symbols-outlined text-accent text-6xl">sports_soccer</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold uppercase tracking-tight">Club Deportivo</h2>
                        <p className="text-neutral-500 mt-2 text-sm leading-relaxed">Alquiler de canchas de fútbol, pádel y complejos multideporte.</p>
                    </div>
                    <div className="pt-4">
                        <span className="bg-accent text-dark-bg px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest group-hover:shadow-lg shadow-accent/20">Entrar</span>
                    </div>
                </Link>
            </div>

            <footer className="fixed bottom-8 text-neutral-600 flex flex-col items-center gap-2">
                <Link href="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-accent transition-colors">
                    ⚙️ Acceso Administración
                </Link>
                <span className="text-[8px] opacity-30">v2.0.0-final</span>
            </footer>
        </main>
    );
}
