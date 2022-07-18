import { getPackages, BuildStack } from './helpers/index.js';
import { logger } from '../../util/index.js';
import { buildPackage } from './build-processing/index.js';

const command = 'build';

const describe = 'Build ts, js, vue packages in mono-repository';

const builder = (yargs) => yargs;

const handler = async () => {
  const packages = getPackages();

  logger.start('Building');

  const stack = new BuildStack(buildPackage);

  for (const pkg of packages) {
    stack.addPackage(pkg);
  }
  try {
    await stack.compile();
  } catch (e) {
    logger.error(e);
  }

  logger.succeed();
};

export const packagesBuild = {
  command,
  describe,
  builder,
  handler
};
