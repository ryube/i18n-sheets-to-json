import { google } from 'googleapis';

export async function authorize(keyFilePath: string) {
  const auth = new google.auth.GoogleAuth({
    keyFilename: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const authClient = await auth.getClient();
  return authClient;
}

/**
 * Log in with a Google service account and get spreadsheet.
 * https://developers.google.com/sheets/api/reference/rest
 * @param keyFilePath
 * @param spreadsheetId
 * @returns
 */
export async function getSheet(keyFilePath: string, spreadsheetId: string) {
  const authClient = await authorize(keyFilePath);
  const docs = google.sheets({ version: 'v4', auth: authClient });
  const sheets = await docs.spreadsheets.get({
    spreadsheetId,
  });

  if (!sheets.data.sheets) throw new Error('No Sheet');
  // for multiple sheets
  const sheetTitles = sheets.data.sheets.map((sheets) => {
    return sheets.properties?.title;
  });

  return {
    docs,
    sheets,
    sheetTitles,
  };
}
