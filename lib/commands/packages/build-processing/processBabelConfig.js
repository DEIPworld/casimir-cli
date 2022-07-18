import path from 'path';
import fs from 'fs-extra';

import { getBabelConfigPath, asyncExec } from '../../../util/index.js';
import { scriptExtensions } from '../helpers/index.js';

export const processBabelConfig = async (pkgPath) => {
  const babelExt = scriptExtensions.map((ext) => `.${ext}`).join(',');
  const localConfigPath = path.join(pkgPath, 'babel.config.js');

  const babelConfig = fs.existsSync(localConfigPath) ? localConfigPath : getBabelConfigPath();

  const babelCommandStack = [
    `--config-file ${babelConfig}`,
    `${pkgPath}/src`,
    `--out-dir ${pkgPath}/lib`,
    `--extensions "${babelExt}"`
  ].join(' ');

  try {
    await asyncExec(`npx cross-env NODE_ENV=lib babel ${babelCommandStack}`, { silent: true });
  } catch (err) {
    console.info(err);
  }
};
