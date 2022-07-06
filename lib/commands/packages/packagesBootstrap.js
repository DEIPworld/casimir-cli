import { asyncExec } from '../../util/index.js';
import { packagesBuild } from './packagesBuild.js';

const command = 'bootstrap';

const describe = 'Bootstrap lerna packages';

const commandOptions = {
  ci: {
    type: 'boolean',

    describe: 'Enable/Disable CI verification',

    default: false
  },
  dryRun: {
    type: 'boolean',

    describe: 'Run command in test mode',

    default: false
  }
};

const builder = (yargs) => yargs
  .options({
    ...commandOptions
  });

const handler = async (argv) => {
  const ciFlag = !argv.ci ? '--no-ci' : '--ci';
  await asyncExec('npx lerna clean --yes');
  await asyncExec(`lerna bootstrap ${ciFlag} -- --legacy-peer-deps`);
  await packagesBuild.handler();
};

export const packagesBootstrap = {
  command,
  describe,
  builder,
  handler
};
