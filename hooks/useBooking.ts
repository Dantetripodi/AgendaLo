import { useState, useEffect, useCallback } from 'react';
import { format, startOfToday, addMinutes, parse } from 'date-fns';
import { AvailabilitySlot, MessageState, BookingFormData } from '../types';
import { BUSINESS_HOURS } from '../constants';

export function useBooking() {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string>('Corte');
    const [ocupadas, setOcupadas] = useState<AvailabilitySlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [formData, setFormData] = useState<BookingFormData>({ cliente: '', telefono: '' });
    const [message, setMessage] = useState<MessageState>({ type: '', text: '' });

    const fetchDisponibilidad = useCallback(async () => {
        setLoading(true);
        try {
            const fechaStr = format(selectedDate, 'yyyy-MM-dd');
            const res = await fetch(`/api/disponibilidad?fecha=${fechaStr}`);
            const data = await res.json();
            setOcupadas(data.ocupadas || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (selectedDate) fetchDisponibilidad();
    }, [selectedDate, fetchDisponibilidad]);

    const isSlotOccupied = (slot: string) => {
        const slotInicio = slot;
        const slotFin = format(addMinutes(parse(slot, 'HH:mm', new Date()), BUSINESS_HOURS.SLOT_DURATION), 'HH:mm');

        return ocupadas.some(occ => {
            return (slotInicio < occ.fin) && (slotFin > occ.inicio);
        });
    };

    const handleReservar = async (e: React.FormEvent) => {
        e.preventDefault();
        setBooking(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/reservar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha: format(selectedDate, 'yyyy-MM-dd'),
                    hora: selectedTime,
                    servicio: selectedService,
                    ...formData
                })
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: '¡Turno reservado exitosamente!' });
                setFormData({ cliente: '', telefono: '' });
                setSelectedTime(null);
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
        selectedService,
        setSelectedService,
        ocupadas,
        loading,
        booking,
        formData,
        setFormData,
        message,
        isSlotOccupied,
        handleReservar
    };
}
