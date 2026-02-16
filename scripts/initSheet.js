const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config({ path: '.env.local' });

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];

async function init() {
    const jwt = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt);
    await doc.loadInfo();

    const headers = [
        'ID',
        'Cliente',
        'Teléfono',
        'Fecha',
        'Hora Inicio',
        'Hora Fin',
        'Recurso',
        'Precio Total',
        'Monto Seña',
        'Estado'
    ];

    // Crear o actualizar hoja de "Barberia"
    let barberSheet = doc.sheetsByTitle['Barberia'];
    if (!barberSheet) {
        barberSheet = await doc.addSheet({ title: 'Barberia', headerValues: headers });
    } else {
        await barberSheet.setHeaderRow(headers);
    }

    // Crear o actualizar hoja de "Club"
    let clubSheet = doc.sheetsByTitle['Club'];
    if (!clubSheet) {
        clubSheet = await doc.addSheet({ title: 'Club', headerValues: headers });
    } else {
        await clubSheet.setHeaderRow(headers);
    }

    console.log('✅ Hojas "Barberia" y "Club" inicializadas correctamente.');
}

init().catch(console.error);
