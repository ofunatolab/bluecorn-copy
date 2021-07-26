module.exports = {
  env: {
    GAS_AUTH_KEY: '62a94055-6113-436d-8dac-7083b76d955f',
    MENU_API_URL:
      'https://script.google.com/macros/s/AKfycbzGpUJmb7UlmDJ14PqQULRE5TahSfO8ZNQtZWO_7VS-Fbu9GSA/exec',
    LIFF_ID: '1655778168-ZLJpz269',
    SPREADSHEET_ID: '1dghobraV4hyW6DH4Por1iCu8efwxxvUl6qsgdXv3HM0',
  },
  webpack: (config) => {
    config.node = {
      fs: 'empty',
      child_process: 'empty',
      net: 'empty',
      dns: 'empty',
      tls: 'empty',
    };
    return config;
  },
};
