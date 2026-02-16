import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

let jwt: any;

const initJwt = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
    throw new Error('Missing Google Sheets environment variables');
  }

  if (!jwt) {
    jwt = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    });
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
