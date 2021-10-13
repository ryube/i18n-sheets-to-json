# i18n-sheets-to-json

Convert the i18n document to JSON locale files for i18next.

## installation

```
npm i -D @ryube/i18n-sheets-to-json
```

## Require

- google service account [doc](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
- _`service-key.json` need_
- Permission of the spreadsheet is given to the service account.

## Usage

create js script file

```js
// i18n-download.js
const {
  i18nForBackend,
  i18nForResource,
  i18nForFlatten,
} = require('@ryube/i18n-sheets-to-json');

const config = {
  keyFilePath: './google-spreadsheet-service-account-key.json',
  spreadsheetId: 'id',
  outputPath: './public/locales',
};

i18nForBackend(config);
i18nForResource(config);
i18nForFlatten(config);
```

```
node i18n-download.js
```

## config option

```js
type Config = {
  keyFilePath: string,
  spreadsheetId: string,
  outputPath?: string,
  filename?: string,
  keyIndex?: number, // 0
  langIndex?: number, // 1
  beautify?: number, // 0 : JSON.stringify indent space
  removeNamespaces?: string[], // filter sheet name for flatten function
  includeSheets?: string[], // default all sheet, If you define a sheet name, parse only that.
};
```
