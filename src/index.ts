import { getSheet } from './google';
import { generateBackendFiles, GenerateFile } from './generateBackendFiles';
import { generateLocalResource } from './generateLocalResource';
import { generateVueI18n } from './generateVueI18n';

const config: Config = {
  keyFilePath: './keys/bngdev-ecf08cb4b4f0.json',
  spreadsheetId: '1hK73eFibNRTln_7NFOD_QEzYB5bjvTfdNeYYhgL6Pj8',
  outputPath: './public/locales',
};

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
  }
}

function i18nForBackend(config: Config) {
  sheetsLoop({ ...config, generateFile: generateBackendFiles });
}

function i18nForResource(config: Config) {
  sheetsLoop({ ...config, generateFile: generateLocalResource });
}

function i18nForVue(config: Config) {
  sheetsLoop({ ...config, generateFile: generateVueI18n });
}

i18nForVue(config);

export { getSheet, i18nForBackend, i18nForResource };
