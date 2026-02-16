import { NextRequest, NextResponse } from 'next/server';
import { getSheet } from '@/lib/googleSheets';
import { parse, addMinutes, format } from 'date-fns';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const business = searchParams.get('business');

    if (!business) {
        return NextResponse.json({ error: 'Business is required' }, { status: 400 });
    }

    try {
        const sheet = await getSheet(business);
        const rows = await sheet.getRows();

        const reservas = rows.map(row => ({
            id: row.get('ID'),
            cliente: row.get('Cliente'),
            telefono: row.get('Teléfono'),
            fecha: row.get('Fecha'),
            horaInicio: row.get('Hora Inicio'),
            horaFin: row.get('Hora Fin'),
            recurso: row.get('Recurso'),
            precioTotal: row.get('Precio Total'),
            montoSena: row.get('Monto Seña'),
            estado: row.get('Estado')
        }));

        return NextResponse.json({ reservas });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { action, id, estado, business, blockData } = await request.json();
        const sheet = await getSheet(business);
        const rows = await sheet.getRows();

        // Acción: Actualizar Estado
        if (action === 'update_status') {
            const row = rows.find(r => r.get('ID') === id);
            if (!row) return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
            row.set('Estado', estado);
            await row.save();
            return NextResponse.json({ success: true });
        }

        // Acción: Bloquear Slot (Mantenimiento)
        if (action === 'block_slot') {
            const { fecha, hora, recurso, duracion, motivo } = blockData;

            const horaInicioDate = parse(hora, 'HH:mm', new Date());
            const horaFinDate = addMinutes(horaInicioDate, Number(duracion));
            const horaFin = format(horaFinDate, 'HH:mm');

            await sheet.addRow({
                ID: `BLOCK-${crypto.randomUUID()}`,
                Cliente: `⚠️ ${motivo || 'MANTENIMIENTO'}`,
                'Teléfono': '-',
                Fecha: fecha,
                'Hora Inicio': hora,
                'Hora Fin': horaFin,
                Recurso: recurso,
                'Precio Total': 0,
                'Monto Seña': 0,
                Estado: 'Bloqueado'
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
