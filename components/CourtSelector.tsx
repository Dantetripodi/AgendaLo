import { Court } from '../types';

interface CourtSelectorProps {
    courts: Court[];
    selectedCourt: Court;
    onSelect: (court: Court) => void;
}

export const CourtSelector = ({ courts, selectedCourt, onSelect }: CourtSelectorProps) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold flex-shrink-0">1</div>
            <h2 className="text-xl font-bold uppercase tracking-tight">Selecciona la Cancha</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {courts.map((court) => (
                <button
                    key={court.id}
                    onClick={() => onSelect(court)}
                    className={`p-4 md:p-5 rounded-2xl flex flex-col items-start transition-smooth border-2 text-left ${selectedCourt.id === court.id
                            ? 'bg-accent border-accent text-dark-bg shadow-lg shadow-accent/20'
                            : 'bg-neutral-900/40 border-neutral-800/50 hover:border-accent/40 text-neutral-400'
                        }`}
                >
                    <span className="text-base md:text-lg font-bold leading-tight mb-1">{court.name}</span>
                    <div className="flex flex-wrap justify-between w-full mt-auto gap-2 opacity-90 text-[10px] md:text-sm font-bold">
                        <span className="bg-black/10 px-2 py-0.5 rounded">TOTAL: ${court.basePrice.toLocaleString()}</span>
                        <span className={`${selectedCourt.id === court.id ? 'text-dark-bg/80' : 'text-accent'} bg-black/5 px-2 py-0.5 rounded`}>
                            SEÑA: ${court.deposit.toLocaleString()}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);
