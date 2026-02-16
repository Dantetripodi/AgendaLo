export interface Booking {
    id: string;
    cliente: string;
    telefono: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    recurso: string;
    precioTotal: number;
    montoSena: number;
    estado: string;
}

export interface AvailabilitySlot {
    inicio: string;
    fin: string;
}

export interface Court {
    id: string;
    name: string;
    basePrice: number; // Cambio a basePrice para ser consistentes
    deposit: number;
}

export interface BookingFormData {
    cliente: string;
    telefono: string;
}

export interface MessageState {
    type: 'success' | 'error' | '';
    text: string;
}
