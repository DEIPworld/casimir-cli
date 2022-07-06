import { packagesRelease } from './packagesRelease.js';
import { packagesBuild } from './packagesBuild.js';
import { packagesDev } from './packagesDev.js';
import { packagesBootstrap } from './packagesBootstrap.js';

const command = 'packages';

const describe = 'Operations with framework on project side';

const builder = (yargs) => yargs
  .command(packagesBuild)
  .command(packagesDev)
  .command(packagesRelease)
  .command(packagesBootstrap);

export const packagesCommand = {
  command,
  describe,
  builder
};
