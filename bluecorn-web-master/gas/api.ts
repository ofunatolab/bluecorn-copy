const AUTH_KEY = '62a94055-6113-436d-8dac-7083b76d955f';
const SHEET_ID = '1dghobraV4hyW6DH4Por1iCu8efwxxvUl6qsgdXv3HM0';
const SHEET_NAME = 'takeoutMenu';

type Menu = {
  id: string;
  name: string;
  shopName: string;
  imageUri: string;
  price: number;
  description: string;
  cookingTime: number;
};

const doGet = (e: any) => {
  const authKey = e.parameter.auth_key;
  if (!authKey || authKey !== AUTH_KEY) {
    // GAS ではレスポンスの status code を設定できないため、text を返却している
    return displayError('401 unauthorized. Invalid auth_key.');
  }

  const data = getData();
  return ContentService.createTextOutput(
    JSON.stringify(data, null, 2)
  ).setMimeType(ContentService.MimeType.JSON);
};

const getData = (): {} => {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  const keys = rows.splice(0, 1)[0];
  return rows.map((row) => {
    const obj = {};
    row.map((item, index) => {
      obj[keys[index]] = item;
    });
    return obj;
  });
}

const displayError = (text: string): GoogleAppsScript.Content.TextOutput => {
  const output = ContentService.createTextOutput(text);
  return output.setMimeType(ContentService.MimeType.TEXT);
};
