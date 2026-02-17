import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

let jwt: any;

const initJwt = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    console.error('Environment variables missing:', { email: !!email, key: !!key, sheetId: !!sheetId });
    throw new Error('Missing Google Sheets environment variables. Check Vercel project settings.');
  }

  if (!jwt) {
    try {
      jwt = new JWT({
        email: email,
        key: key.replace(/\\n/g, '\n'),
        scopes: SCOPES,
      });
    } catch (err) {
      console.error('Error creating JWT:', err);
      throw err;
    }
  }
  return jwt;
};

export const getSheet = async (sheetNameOrIndex: string | number = 0): Promise<GoogleSpreadsheetWorksheet> => {
  const jwt = initJwt();
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, jwt);
  await doc.loadInfo();

  if (typeof sheetNameOrIndex === 'string') {
    let sheet = doc.sheetsByTitle[sheetNameOrIndex];
    if (!sheet) {
      // Create it if it doesn't exist (optional, but safer to error if not manually created)
      throw new Error(`Sheet with title "${sheetNameOrIndex}" not found. Please create it in the Google Spreadsheet.`);
    }
    return sheet;
  }

  return doc.sheetsByIndex[sheetNameOrIndex];
};
