import { getSheet } from './google';
import { generateBackendFiles, GenerateFile } from './generateBackendFiles';
import { generateLocalResource } from './generateLocalResource';
import { generateFlattenResource } from './generateFlattenResource';

type Config = {
  keyFilePath: string;
  spreadsheetId: string;
  outputPath?: string;
  filename?: string;
  keyIndex?: number;
  langIndex?: number;
  beautify?: number;
  removeNamespaces?: string[];
  includeSheets?: string[];
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
  removeNamespaces,
  includeSheets,
  generateFile,
}: I18nToJson) {
  console.info('🐮 output path : ', { path: outputPath });

  const { sheetTitles, docs } = await getSheet(keyFilePath, spreadsheetId);
  console.info('🧾 sheet list');
  console.table(sheetTitles);

  for (let i = 0; i < sheetTitles.length; i++) {
    const namespace = String(sheetTitles[i]);

    const includeSheetsOption = () =>
      !includeSheets ||
      (includeSheets?.length > 0 && includeSheets.includes(namespace));

    // If the option is defined, skip the sheet that is not included.
    if (!includeSheetsOption()) {
      console.info('🥶 skip sheet :', namespace);
      continue;
    }

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
        removeNamespaces,
      });

      console.info(
        `\x1b[36m 🤩 sheet: \x1b[34m '${namespace}' ➡ \x1b[35m done !`
      );
    }
  }
}

/**
 * download sheet for i18next-http-backend
 * outputPath/{{lng}}/{{ns}}.json
 * https://github.com/i18next/i18next-http-backend
 * @param config
 */
function i18nForBackend(config: Config) {
  console.info('✅ download google sheet for i18n backend !');

  sheetsLoop({ ...config, generateFile: generateBackendFiles });
}

/**
 * download sheet for i18next resource
 * https://www.i18next.com/how-to/add-or-load-translations
 * @param config
 */
function i18nForResource(config: Config) {
  console.info('✅ download google sheet for i18n resource !');
  sheetsLoop({ ...config, generateFile: generateLocalResource });
}

/**
 * resource flatten {lng: namespace.key: value}
 * @param config
 */
function i18nForFlatten(config: Config) {
  console.info('✅ download google sheet for i18n flatten resource !');
  sheetsLoop({ ...config, generateFile: generateFlattenResource });
}

// const doc = '1mLrfzwPJmIkCExk5Qvcv3GIuBelnP1xJ_BWj2bp-61E';
// const doc1 = '1hK73eFibNRTln_7NFOD_QEzYB5bjvTfdNeYYhgL6Pj8';
// const config: Config = {
//   keyFilePath: './keys/bngdev-ecf08cb4b4f0.json',
//   spreadsheetId: doc,
//   outputPath: './public/locales',
// };

export { getSheet, i18nForBackend, i18nForResource, i18nForFlatten };
