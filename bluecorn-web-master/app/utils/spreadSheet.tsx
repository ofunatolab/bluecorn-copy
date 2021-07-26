import { GoogleSpreadsheet } from 'google-spreadsheet';
import auth from '../credentials.json';

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID as string);
export const authorize = async (): Promise<any> => {
  await doc.useServiceAccountAuth({
    client_email: auth.client_email,
    private_key: auth.private_key,
  });
};
export const insert = async (value: any): Promise<any> => {
  await doc.loadInfo();
  const orderBookSheet = doc.sheetsByIndex[0];
  return await orderBookSheet.addRow(value);
};
