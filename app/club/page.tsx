'use client';

import { addDays, startOfToday, parse, addMinutes, format } from 'date-fns';
import { useClubBooking } from '../../hooks/useClubBooking';
import { CLUB_HOURS, CLUB_COURTS, DURATION_OPTIONS, WHATSAPP_NUMBER_CLUB } from '../../constants/club';
import { Calendar } from '../../components/Calendar';
import { TimeGrid } from '../../components/TimeGrid';
import { BookingForm } from '../../components/BookingForm';
import { CourtSelector } from '../../components/CourtSelector';

export default function ClubPage() {
    const {
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        selectedCourt,
        setSelectedCourt,
        duration,
        setDuration,
        loading,
        booking,
        formData,
        setFormData,
        message,
        reservationId,
        isSlotOccupied,
        handleReservar,
        currentPrice
    } = useClubBooking();

    const generateSlots = () => {
        const slots = [];
        let current = parse(CLUB_HOURS.START, 'HH:mm', new Date());
        const end = parse(CLUB_HOURS.END, 'HH:mm', new Date());
        while (current < end) {
            slots.push(format(current, 'HH:mm'));
            current = addMinutes(current, 30);
        }
        return slots;
    };

    const slots = generateSlots();
    const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:p-12 space-y-12">
            <header className="flex flex-col items-center space-y-4">
                <div className="bg-accent/10 p-4 rounded-full">
                    <span className="material-symbols-outlined text-accent text-5xl">sports_soccer</span>
                </div>
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#f8f7f6]">
                        ELITE <span className="text-accent">CLUB</span>
                    </h1>
                    <p className="text-neutral-500 font-medium tracking-widest text-xs mt-2 uppercase">Alquiler de Canchas</p>
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-8">
                    <CourtSelector
                        courts={CLUB_COURTS}
                        selectedCourt={selectedCourt}
                        onSelect={setSelectedCourt}
                    />

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase text-neutral-500">Duración del Turno</h3>
                        <div className="flex gap-2">
                            {DURATION_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setDuration(opt.value); setSelectedTime(null); }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-smooth ${duration === opt.value ? 'bg-accent border-accent text-dark-bg' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                                        }`}
                                >
                                    {opt.label}
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
                            selectedService={selectedCourt.name}
                            formData={formData}
                            booking={booking}
                            message={message}
                            onChange={setFormData}
                            onSubmit={handleReservar}
                            price={currentPrice}
                            deposit={selectedCourt.deposit}
                            whatsAppNumber={WHATSAPP_NUMBER_CLUB}
                            reservationId={reservationId}
                            businessType="Club"
                        />
                    )}
                </div>
            </section>
        </main>
    );
}
