import { NextRequest, NextResponse } from 'next/server';
import { getSheet } from '@/lib/googlesheets';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
    try {
        const { id, business } = await request.json();

        if (!id || !business) {
            return NextResponse.json({ error: 'ID y Negocio son requeridos' }, { status: 400 });
        }

        const sheet = await getSheet(business);
        const rows = await sheet.getRows();

        const row = rows.find(r => r.get('ID') === id);
        if (!row) {
            return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }

        // Cambiamos el estado a Cancelado para liberar el slot y mantener registro
        const now = new Date();
        row.set('Estado', 'Cancelado');
        row.set('Fecha Cancelación', format(now, 'dd/MM/yyyy HH:mm:ss'));
        await row.save();

        return NextResponse.json({
            success: true,
            cliente: row.get('Cliente'),
            fecha: row.get('Fecha'),
            hora: row.get('Hora Inicio')
        });
    } catch (error: any) {
        console.error('Error in cancellation:', error.message);
        return NextResponse.json({ error: 'Error al procesar la cancelación' }, { status: 500 });
    }
}
