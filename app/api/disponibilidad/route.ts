import { NextRequest, NextResponse } from 'next/server';
import { getSheet } from '../../../lib/googleSheets';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');
    const recurso = searchParams.get('recurso');
    const business = searchParams.get('business'); // 'Barberia' o 'Club'

    if (!fecha || !recurso || !business) {
        return NextResponse.json({ error: 'Faltan parámetros (fecha, recurso, business)' }, { status: 400 });
    }

    try {
        // Usamos el nombre del business para seleccionar la pestaña correcta
        const sheet = await getSheet(business);
        const rows = await sheet.getRows();

        const ocupadas = rows
            .filter(row => row.get('Fecha') === fecha && row.get('Recurso') === recurso)
            .map(row => ({
                inicio: row.get('Hora Inicio'),
                fin: row.get('Hora Fin')
            }));

        return NextResponse.json({ ocupadas });
    } catch (error: any) {
        console.error('Error fetching availability:', error.message);
        return NextResponse.json({ error: 'Error al obtener disponibilidad' }, { status: 500 });
    }
}
