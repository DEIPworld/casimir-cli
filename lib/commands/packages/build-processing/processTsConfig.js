import path from 'path';
import fs from 'fs-extra';
import { asyncExec } from '../../../util/index.js';

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
export const processTsConfig = async (pkgPath) => {
  const tsconfig = path.join(pkgPath, 'tsconfig.build.json');

  if (fs.existsSync(tsconfig)) {
    const tscCommandStack = [
      `-p ${tsconfig}`
    ].join(' ');

    try {
      await asyncExec(`npx tsc ${tscCommandStack}`, { silent: false });
    } catch (err) {
      console.info(err);
    }
  }

  return Promise.resolve();
};
