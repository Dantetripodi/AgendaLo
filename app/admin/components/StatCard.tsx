import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    description?: string;
}

export const StatCard = ({ title, value, icon: Icon, color, description }: StatCardProps) => (
    <div className="glass p-6 rounded-[1.5rem] border border-neutral-800 space-y-4">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
                <Icon size={24} />
            </div>
            {description && <span className="text-[10px] font-bold text-neutral-500 uppercase">{description}</span>}
        </div>
        <div>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-black text-[#f8f7f6] mt-1">{value}</h3>
        </div>
    </div>
);
