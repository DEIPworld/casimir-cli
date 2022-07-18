import { asyncExec, logger } from '../../util/index.js';
import { packagesBuild } from './packagesBuild.js';

const command = 'bootstrap';

const describe = 'Bootstrap lerna packages';

const commandOptions = {
  ci: {
    type: 'boolean',

    describe: 'Enable/Disable CI verification',

    default: false
  }
};

const builder = (yargs) => yargs
  .options({
    ...commandOptions
  });

const handler = async (argv) => {
  const ciFlag = !argv.ci ? '--no-ci' : '--ci';
  logger.start('Bootstrapping packages');
  await asyncExec('npx lerna clean --yes', { silent: true });
  await asyncExec(`lerna bootstrap ${ciFlag} -- --legacy-peer-deps`, { silent: true });
  logger.succeed();
  await packagesBuild.handler();
};

export const packagesBootstrap = {
  command,
  describe,
  builder,
  handler
};
