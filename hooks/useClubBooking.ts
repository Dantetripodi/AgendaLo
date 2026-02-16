import { useState, useEffect, useCallback } from 'react';
import { format, startOfToday, addMinutes, parse } from 'date-fns';
import { AvailabilitySlot, MessageState, BookingFormData, Court } from '../types';
import { CLUB_COURTS } from '../constants/club';

export function useClubBooking() {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<Court>(CLUB_COURTS[0]);
    const [duration, setDuration] = useState<number>(60);
    const [ocupadas, setOcupadas] = useState<AvailabilitySlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [formData, setFormData] = useState<BookingFormData>({ cliente: '', telefono: '' });
    const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
    const [reservationId, setReservationId] = useState<string | null>(null);

    const fetchDisponibilidad = useCallback(async () => {
        setLoading(true);
        try {
            const fechaStr = format(selectedDate, 'yyyy-MM-dd');
            const res = await fetch(`/api/disponibilidad?fecha=${fechaStr}&recurso=${selectedCourt.name}&business=Club`);
            const data = await res.json();
            setOcupadas(data.ocupadas || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate, selectedCourt]);

    useEffect(() => {
        fetchDisponibilidad();
    }, [selectedDate, selectedCourt, fetchDisponibilidad]);

    useEffect(() => {
        setMessage({ type: '', text: '' });
        setReservationId(null);
    }, [selectedDate, selectedCourt]);

    const isSlotOccupied = (slot: string) => {
        const slotInicio = slot;
        const slotFin = format(addMinutes(parse(slot, 'HH:mm', new Date()), duration), 'HH:mm');

        return ocupadas.some(occ => {
            return (slotInicio < occ.fin) && (slotFin > occ.inicio);
        });
    };

    const currentPrice = (selectedCourt.basePrice / 60) * duration;

    const handleReservar = async (e: React.FormEvent) => {
        e.preventDefault();
        setBooking(true);
        setMessage({ type: '', text: '' });
        setReservationId(null);

        try {
            const res = await fetch('/api/reservar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    business: 'Club',
                    fecha: format(selectedDate, 'yyyy-MM-dd'),
                    hora: selectedTime,
                    recurso: selectedCourt.name,
                    duracion: duration,
                    precioTotal: currentPrice,
                    montoSena: selectedCourt.deposit,
                    estado: 'Seña Pendiente',
                    ...formData
                })
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: '¡Cancha reservada con éxito!' });
                setReservationId(data.id);
                // NOTA: Quitamos el borrado inmediato de formData para que el mensaje de WhatsApp tome los datos reales
                fetchDisponibilidad();
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al reservar' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setBooking(false);
        }
    };

    return {
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
    };
}
