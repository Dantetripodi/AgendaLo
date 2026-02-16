import { format } from 'date-fns';
import { BookingFormData, MessageState } from '../types';

interface BookingFormProps {
    selectedDate: Date;
    selectedTime: string;
    selectedService: string;
    formData: BookingFormData;
    booking: boolean;
    message: MessageState;
    onChange: (data: BookingFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    price?: number;
    deposit?: number;
    whatsAppNumber?: string;
    reservationId?: string | null;
    businessType?: 'Club' | 'Barberia';
}

export const BookingForm = ({
    selectedDate,
    selectedTime,
    selectedService,
    formData,
    booking,
    message,
    onChange,
    onSubmit,
    price,
    deposit,
    whatsAppNumber,
    reservationId,
    businessType
}: BookingFormProps) => {

    const cancelLink = reservationId ? `${window.location.origin}/cancelar/${reservationId}?b=${businessType}` : '';

    const handleWhatsApp = () => {
        const text = encodeURIComponent(
            `¡Hola! Quisiera confirmar mi reserva:\n\n` +
            `👤 Cliente: ${formData.cliente}\n` +
            `📅 Fecha: ${format(selectedDate, 'dd/MM')}\n` +
            `⏰ Hora: ${selectedTime}\n` +
            `📍 Recurso: ${selectedService}\n` +
            `💰 Total: $${price?.toLocaleString()}\n\n` +
            `🔗 Link de gestión/cancelación: ${cancelLink}`
        );
        window.open(`https://wa.me/${whatsAppNumber}?text=${text}`, '_blank');
    };

    return (
        <section id="form-reserva" className="glass rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-neutral-800 pb-6 md:pb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left uppercase">Confirmar Turno</h2>
                    <p className="text-neutral-500 mt-1 text-sm text-center md:text-left">Completa los datos para finalizar</p>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-4 bg-neutral-900/50 p-3 md:p-4 rounded-2xl border border-neutral-800/50">
                    <div className="text-center px-1 md:px-4 border-r border-neutral-800">
                        <p className="text-[9px] md:text-[10px] text-accent font-bold uppercase mb-1">Fecha</p>
                        <p className="text-sm md:text-lg font-bold">{format(selectedDate, "dd/MM")}</p>
                    </div>
                    <div className="text-center px-1 md:px-4 border-r border-neutral-800">
                        <p className="text-[9px] md:text-[10px] text-accent font-bold uppercase mb-1">Hora</p>
                        <p className="text-sm md:text-lg font-bold">{selectedTime}</p>
                    </div>
                    <div className="text-center px-1 md:px-4 flex flex-col justify-center">
                        <p className="text-[9px] md:text-[10px] text-accent font-bold uppercase mb-1">Recurso</p>
                        <p className="text-[10px] md:text-xs font-bold truncate max-w-[60px] leading-tight mx-auto">{selectedService}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold text-neutral-500 uppercase ml-1">Nombre Completo</label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: Juan Pérez"
                            className="w-full bg-neutral-950/50 border-2 border-neutral-800 rounded-xl p-3.5 focus:outline-none focus:border-accent transition-smooth text-[#f8f7f6]"
                            value={formData.cliente}
                            onChange={(e) => onChange({ ...formData, cliente: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold text-neutral-500 uppercase ml-1">WhatsApp / Celular</label>
                        <input
                            type="tel"
                            required
                            placeholder="Ej: +54 9 11 1234 5678"
                            className="w-full bg-neutral-950/50 border-2 border-neutral-800 rounded-xl p-3.5 focus:outline-none focus:border-accent transition-smooth text-[#f8f7f6]"
                            value={formData.telefono}
                            onChange={(e) => onChange({ ...formData, telefono: e.target.value })}
                        />
                    </div>
                </div>

                {price && (
                    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex justify-between items-center">
                        <div>
                            <p className="text-[9px] font-bold uppercase text-accent">Total a pagar</p>
                            <p className="text-2xl font-black text-accent">${price.toLocaleString()}</p>
                        </div>
                        {deposit && (
                            <div className="text-right">
                                <p className="text-[9px] font-bold uppercase text-neutral-500">Seña Requerida</p>
                                <p className="text-lg font-bold text-neutral-300">${deposit.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={booking}
                    className="w-full bg-accent hover:bg-[#c5a028] text-dark-bg font-black text-base py-4 rounded-xl transition-smooth shadow-2xl shadow-accent/20"
                >
                    {booking ? 'PROCESANDO...' : 'RESERVAR AHORA'}
                </button>
            </form>

            {message.type === 'success' && whatsAppNumber && (
                <div className="animate-in zoom-in-95 flex flex-col items-center space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-bold text-sm text-center w-full uppercase">
                        {message.text}
                    </div>

                    <div className="w-full space-y-3">
                        <button
                            onClick={handleWhatsApp}
                            className="flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 px-6 rounded-xl transition-smooth w-full justify-center shadow-xl shadow-green-500/20"
                        >
                            <span className="material-symbols-outlined">chat</span>
                            ENVIAR COMPROBANTE WHATSAPP
                        </button>

                        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl text-center space-y-3">
                            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Link de Gestión / Cancelación</p>
                            <div className="flex flex-col gap-3">
                                <code className="text-[11px] bg-black/40 p-4 rounded-xl text-neutral-300 break-all border border-neutral-800 leading-relaxed block">
                                    {cancelLink}
                                </code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(cancelLink);
                                        alert('¡Link copiado al portapapeles!');
                                    }}
                                    className="text-[10px] font-black text-neutral-500 hover:text-accent transition-colors uppercase tracking-widest"
                                >
                                    [ COPIAR LINK ]
                                </button>
                            </div>
                            <p className="text-[10px] text-neutral-600 italic mt-2">Guarda este link o envía el comprobante por WhatsApp para tenerlo a mano.</p>
                        </div>
                    </div>
                </div>
            )}

            {message.type === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-bold text-sm text-center uppercase">
                    {message.text}
                </div>
            )}
        </section>
    );
};
