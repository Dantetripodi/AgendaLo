import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarProps {
    days: Date[];
    selectedDate: Date;
    onSelect: (date: Date) => void;
}

export const Calendar = ({ days, selectedDate, onSelect }: CalendarProps) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">1</div>
            <h2 className="text-xl font-bold uppercase tracking-tight">Elegí el día</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
            {days.map((day) => (
                <button
                    key={day.toISOString()}
                    onClick={() => onSelect(day)}
                    className={`p-4 rounded-2xl flex flex-col items-center transition-smooth border-2 ${isSameDay(day, selectedDate)
                            ? 'bg-accent border-accent text-dark-bg shadow-lg shadow-accent/20'
                            : 'bg-neutral-900/40 border-neutral-800/50 hover:border-accent/40 text-neutral-400'
                        }`}
                >
                    <span className="text-[10px] uppercase font-bold mb-1 opacity-70">
                        {format(day, 'EEE', { locale: es })}
                    </span>
                    <span className="text-xl font-extrabold">{format(day, 'd')}</span>
                    <span className="text-[10px] uppercase font-bold opacity-70">
                        {format(day, 'MMM', { locale: es })}
                    </span>
                </button>
            ))}
        </div>
    </div>
);
