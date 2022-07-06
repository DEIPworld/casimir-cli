import path from 'path';
import glob from 'glob';
import fs from 'fs-extra';

import { scriptExtensions, changePathToLib } from '../helpers/index.js';

export const processOtherFiles = async (pkgPath) => {
  const pattern = path.join(pkgPath, 'src', '**', '*.*');
  const files = glob.sync(
    pattern,
    {
      ignore: [`**/*.{${['vue', ...scriptExtensions].join(',')}}`]
    }
  );

  const operations = [];

  for (const file of files) {
    operations.push(() => fs.copy(file, changePathToLib(pkgPath, file)));
  }

  try {
    await Promise.all(operations.map((fn) => fn()));
  } catch (err) {
    console.info(err);
  }
};
