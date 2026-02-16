interface TimeGridProps {
    slots: string[];
    selectedTime: string | null;
    loading: boolean;
    onSelect: (time: string) => void;
    isOccupied: (time: string) => boolean;
}

export const TimeGrid = ({ slots, selectedTime, loading, onSelect, isOccupied }: TimeGridProps) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold flex-shrink-0">2</div>
            <h2 className="text-xl font-bold uppercase tracking-tight">Horarios Disponibles</h2>
        </div>
        {loading ? (
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3 animate-pulse">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                    <div key={i} className="h-10 md:h-12 bg-neutral-900 rounded-lg md:rounded-xl" />
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3">
                {slots.map((hour) => {
                    const occupied = isOccupied(hour);
                    return (
                        <button
                            key={hour}
                            disabled={occupied}
                            onClick={() => onSelect(hour)}
                            className={`py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-smooth border-2 ${selectedTime === hour
                                    ? 'bg-accent border-accent text-dark-bg transition-none'
                                    : occupied
                                        ? 'bg-neutral-950/50 border-transparent text-neutral-700 cursor-not-allowed line-through'
                                        : 'bg-neutral-900/40 border-neutral-800 hover:border-accent/40 text-neutral-300'
                                }`}
                        >
                            {hour}
                        </button>
                    );
                })}
            </div>
        )}
    </div>
);
