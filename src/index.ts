import { getSheet } from './google';
import { generateBackendFiles, GenerateFile } from './generateBackendFiles';
import { generateLocalResource } from './generateLocalResource';
import { generateVueI18n } from './generateVueI18n';
import log from 'log-beautify';

log.setSymbols({
  success: '👍 ',
  info: '✅ ',
});

// const config: Config = {
//   keyFilePath: './keys/bngdev-ecf08cb4b4f0.json',
//   spreadsheetId: '1hK73eFibNRTln_7NFOD_QEzYB5bjvTfdNeYYhgL6Pj8',
//   outputPath: './public/locales',
// };

type Config = {
  keyFilePath: string;
  spreadsheetId: string;
  outputPath?: string;
  filename?: string;
  keyIndex?: number;
  langIndex?: number;
  beautify?: number;
};

type Callback = (param: GenerateFile) => Promise<void>;
type I18nToJson = Config & { generateFile: Callback };

async function sheetsLoop({
  keyFilePath,
  spreadsheetId,
  outputPath = './public/locales',
  keyIndex = 0,
  langIndex = 1,
  beautify = 0,
  filename,
  generateFile,
}: I18nToJson) {
  log.info('output path : ', { path: outputPath });
  const { sheetTitles, docs } = await getSheet(keyFilePath, spreadsheetId);
  for (let i = 0; i < sheetTitles.length; i++) {
    const namespace = String(sheetTitles[i]);
    const resData = await docs.spreadsheets.values.get({
      spreadsheetId,
      range: namespace,
    });
    const rows = resData.data.values;
    if (rows) {
      await generateFile({
        rows,
        namespace,
        outputPath,
        keyIndex,
        langIndex,
        beautify,
        filename,
      });
    }
    log.success(`${namespace} done !`);
  }
}

/**
 * download sheet for i18next-http-backend
 * outputPath/{{lng}}/{{ns}}.json
 * https://github.com/i18next/i18next-http-backend
 * @param config
 */
function i18nForBackend(config: Config) {
  log.info('download google sheet for i18n backend !');

  sheetsLoop({ ...config, generateFile: generateBackendFiles });
}

/**
 * download sheet for i18next resource
 * https://www.i18next.com/how-to/add-or-load-translations
 * @param config
 */
function i18nForResource(config: Config) {
  log.info('download google sheet for i18n resource !');
  sheetsLoop({ ...config, generateFile: generateLocalResource });
}

/**
 * resource flatten {lng: namespace.key: value}
 * @param config
 */
function i18nForFlatten(config: Config) {
  log.info('download google sheet for i18n flatten resource !');
  sheetsLoop({ ...config, generateFile: generateVueI18n });
}

export { getSheet, i18nForBackend, i18nForResource, i18nForFlatten };
