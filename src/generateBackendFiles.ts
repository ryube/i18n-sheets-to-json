import fs from 'fs';

export type GenerateFile = {
  rows: any;
  namespace: string;
  outputPath: string;
  keyIndex: number;
  langIndex: number;
  beautify: number;
};

export async function generateBackendFiles({
  rows,
  namespace = '',
  outputPath = '',
  keyIndex = 0,
  langIndex = 1,
  beautify = 0,
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
      translations[lang][key] = value;
    }
  }

  // Create output director
  for (let i = langIndex; i < header.length; i++) {
    const lang = header[i];
    const dir = `${outputPath}/${lang}`;
    if (!fs.existsSync(dir)) {
      console.info(`Creating ${dir} output directory`);
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.info(`${dir} has been created`);
      } catch (err) {
        throw new Error(`Error creating directory ${dir}`);
      }
    }
  }

  // Write file for each language
  for (let i = langIndex; i < header.length; i++) {
    const lang = header[i];
    const file = `${outputPath}/${lang}/${namespace}.json`;
    const data = `${JSON.stringify(translations[lang], null, beautify)}`;

    try {
      fs.writeFileSync(file, data);
      console.info(`${file} has been created`);
    } catch (err) {
      console.error(`Error writing file ${file}`);
    }
  }
}
