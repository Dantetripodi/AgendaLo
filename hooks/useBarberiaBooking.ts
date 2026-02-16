import { useState, useEffect, useCallback } from 'react';
import { format, startOfToday, addMinutes, parse } from 'date-fns';
import { AvailabilitySlot, MessageState, BookingFormData } from '../types';
import { BARBER_SERVICES } from '../constants/barberia';

export function useBarberiaBooking() {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState(BARBER_SERVICES[0]);
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
            const res = await fetch(`/api/disponibilidad?fecha=${fechaStr}&recurso=Barberia_Gral&business=Barberia`);
            const data = await res.json();
            setOcupadas(data.ocupadas || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchDisponibilidad();
    }, [selectedDate, fetchDisponibilidad]);

    useEffect(() => {
        setMessage({ type: '', text: '' });
        setReservationId(null);
    }, [selectedDate, selectedService]);

    const isSlotOccupied = (slot: string) => {
        const slotInicio = slot;
        const slotFin = format(addMinutes(parse(slot, 'HH:mm', new Date()), selectedService.duration), 'HH:mm');

        return ocupadas.some(occ => {
            return (slotInicio < occ.fin) && (slotFin > occ.inicio);
        });
    };

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
                    business: 'Barberia',
                    fecha: format(selectedDate, 'yyyy-MM-dd'),
                    hora: selectedTime,
                    recurso: 'Barberia_Gral',
                    duracion: selectedService.duration,
                    precioTotal: selectedService.price,
                    estado: 'Pendiente',
                    ...formData
                })
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: '¡Turno agendado con éxito!' });
                setReservationId(data.id);
                // NOTA: Quitamos el borrado inmediato de formData para que el mensaje de WhatsApp tome los datos reales
                fetchDisponibilidad();
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al agendar' });
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
        loading,
        booking,
        formData,
        setFormData,
        message,
        reservationId,
        isSlotOccupied,
        handleReservar
    };
}
