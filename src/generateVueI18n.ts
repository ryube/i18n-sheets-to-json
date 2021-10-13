import fs from 'fs';
import { GenerateFile } from './generateBackendFiles';
import { mergeDeep } from './util/mergeDeep';

export async function generateVueI18n({
  rows = [],
  namespace = '',
  outputPath = '',
  keyIndex = 0,
  langIndex = 1,
  beautify = 0,
  filename = 'lang',
}: GenerateFile) {
  if (rows.length === 0) {
    throw new Error('No data found in spreadsheet');
  }

  const header = rows[0];
  let translations: any = {}; // Result object containing all translations

  // Create sub-object for each language
  for (let i = langIndex; i < header.length; i++) {
    const lang = header[i];
    translations[lang] = {};
  }

  // For each data row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const key = row[keyIndex];

    // For each language
    for (let j = langIndex; j < row.length; j++) {
      const lang = header[j];
      const value = row[j];

      // Generate and add sub-object to translations
      translations[lang][`${namespace}.${key}`] = value;
    }
  }

  // Create output director
  for (let i = langIndex; i < header.length; i++) {
    const dir = `${outputPath}`;
    if (!fs.existsSync(dir)) {
      console.info(`Creating ${dir} output directory`);
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.info(`${dir} has been created`);
      } catch (err) {
        throw new Error(`Error creating directory ${dir} ${err}`);
      }
    }
  }

  const file = `${outputPath}/${filename}.json`;
  const data = `${JSON.stringify(translations, null, beautify)}`;

  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, data);
    } else {
      const beforeData = JSON.parse(fs.readFileSync(file, 'utf8'));
      fs.writeFileSync(
        file,
        JSON.stringify(mergeDeep(beforeData, translations), null, beautify)
      );
      // console.info(`update`, updateData);
    }
  } catch (err) {
    console.error(`Error writing file ${file} ${err}`);
  }
}
