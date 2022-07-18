import { cleanLib } from './cleanLib.js';
import { processVueFiles } from './processVueFiles.js';
import { processBabelConfig } from './processBabelConfig.js';
import { processTsConfig } from './processTsConfig.js';
import { processOtherFiles } from './processOtherFiles.js';
import { postProcessingClean } from './postProcessingClean.js';

export const buildPackage = async (pkg) => {
  const { name: pkgName, path: pkgPath } = pkg;

  await cleanLib(pkgPath);

  await Promise.all([
    processVueFiles(pkgPath),
    processBabelConfig(pkgPath),
    processTsConfig(pkgPath),
    processOtherFiles(pkgPath)
  ]);

  await postProcessingClean(pkgPath);

  return pkgName;
};
