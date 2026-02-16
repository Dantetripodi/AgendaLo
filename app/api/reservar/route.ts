import { NextRequest, NextResponse } from 'next/server';
import { getSheet } from '../../../lib/googleSheets';
import { parse, addMinutes, format } from 'date-fns';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const {
            fecha,
            hora,
            cliente,
            telefono,
            recurso,
            business, // 'Barberia' o 'Club'
            duracion = 60,
            precioTotal = 0,
            montoSena = 0,
            estado = 'Pendiente'
        } = data;

        if (!fecha || !hora || !cliente || !telefono || !recurso || !business) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        const horaInicioDate = parse(hora, 'HH:mm', new Date());
        const horaFinDate = addMinutes(horaInicioDate, Number(duracion));
        const horaFin = format(horaFinDate, 'HH:mm');

        // Seleccionamos la hoja según el negocio
        const sheet = await getSheet(business);
        const rows = await sheet.getRows();

        const colision = rows.find(row => {
            if (row.get('Fecha') !== fecha || row.get('Recurso') !== recurso) return false;
            const rowInicio = row.get('Hora Inicio');
            const rowFin = row.get('Hora Fin');
            return (hora < rowFin) && (horaFin > rowInicio);
        });

        if (colision) {
            return NextResponse.json({ error: 'El horario seleccionado ya está reservado' }, { status: 400 });
        }

        const id = crypto.randomUUID();

        await sheet.addRow({
            ID: id,
            Cliente: cliente,
            'Teléfono': telefono,
            Fecha: fecha,
            'Hora Inicio': hora,
            'Hora Fin': horaFin,
            Recurso: recurso,
            'Precio Total': precioTotal,
            'Monto Seña': montoSena,
            Estado: estado
        });

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error('Error in reservation:', error.message);
        return NextResponse.json({ error: 'Error al procesar la reserva' }, { status: 500 });
    }
}
