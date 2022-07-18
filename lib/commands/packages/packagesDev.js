import chokidar from 'chokidar';
import path from 'path';

import { findPackageRoot, getPackages } from './helpers/index.js';
import { buildPackage } from './build-processing/index.js';
import { logger } from '../../util/index.js';

const command = 'dev';

const describe = 'Enable watching and build for mono-repository';

const builder = (yargs) => yargs;

const handler = () => {
  const packages = getPackages();

  const packagesSrcFiles = packages
    .map((pkg) => path.join(pkg.path, 'src', '**', '*'));

  const watcher = chokidar.watch(packagesSrcFiles, {
    persistent: true,
    ignoreInitial: true
  });

  console.info('\n');
  logger.succeed('Watching enabled');

  watcher.on('all', (event, file) => {
    const targetPackage = packages.find((pkg) => pkg.path === findPackageRoot(file));

    logger.start(`Building: ${targetPackage.name}`);

    buildPackage(targetPackage).then(() => {
      logger.succeed();
    });
  });
};

export const packagesDev = {
  command,
  describe,
  builder,
  handler
};
