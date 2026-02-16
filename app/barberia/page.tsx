'use client';

import { addDays, startOfToday, parse, addMinutes, format, getDay } from 'date-fns';
import { useBarberiaBooking } from '../../hooks/useBarberiaBooking';
import { BARBER_HOURS, BARBER_SERVICES, BARBER_AVAILABLE_DAYS, WHATSAPP_NUMBER } from '../../constants/barberia';
import { Calendar } from '../../components/Calendar';
import { TimeGrid } from '../../components/TimeGrid';
import { BookingForm } from '../../components/BookingForm';

export default function BarberiaPage() {
    const {
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        selectedService,
        setSelectedService,
        loading,
        booking,
        formData,
        setFormData,
        message,
        reservationId,
        isSlotOccupied,
        handleReservar
    } = useBarberiaBooking();

    const generateSlots = () => {
        const slots = [];
        let current = parse(BARBER_HOURS.START, 'HH:mm', new Date());
        const end = parse(BARBER_HOURS.END, 'HH:mm', new Date());
        while (current < end) {
            slots.push(format(current, 'HH:mm'));
            current = addMinutes(current, 15);
        }
        return slots;
    };

    const slots = generateSlots();
    const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i))
        .filter(d => BARBER_AVAILABLE_DAYS.includes(getDay(d)));

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:p-12 space-y-12">
            <header className="flex flex-col items-center space-y-4">
                <div className="bg-accent/10 p-4 rounded-full">
                    <span className="material-symbols-outlined text-accent text-5xl">content_cut</span>
                </div>
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#f8f7f6]">
                        ELITE <span className="text-accent">CUTS</span>
                    </h1>
                    <p className="text-neutral-500 font-medium tracking-widest text-xs mt-2 uppercase">Barbería & Spa</p>
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase text-neutral-500">Selecciona el Servicio</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {BARBER_SERVICES.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => { setSelectedService(s); setSelectedTime(null); }}
                                    className={`p-4 rounded-2xl flex justify-between items-center border-2 transition-smooth ${selectedService.id === s.id ? 'bg-accent border-accent text-dark-bg' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                                        }`}
                                >
                                    <div className="text-left">
                                        <p className="font-bold">{s.name}</p>
                                        <p className="text-[10px] opacity-70 uppercase font-bold">{s.duration} min</p>
                                    </div>
                                    <p className="text-lg font-black">${s.price.toLocaleString()}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Calendar days={days} selectedDate={selectedDate} onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }} />
                </div>

                <div className="lg:col-span-7 space-y-10">
                    <TimeGrid slots={slots} selectedTime={selectedTime} loading={loading} onSelect={setSelectedTime} isOccupied={isSlotOccupied} />

                    {selectedTime && (
                        <BookingForm
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            selectedService={selectedService.name}
                            formData={formData}
                            booking={booking}
                            message={message}
                            onChange={setFormData}
                            onSubmit={handleReservar}
                            price={selectedService.price}
                            whatsAppNumber={WHATSAPP_NUMBER}
                            reservationId={reservationId}
                            businessType="Barberia"
                        />
                    )}
                </div>
            </section>
        </main>
    );
}
