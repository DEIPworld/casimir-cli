import { getConfig } from './config.js';

const packageManagerCommands = {
  install: {
    npm: 'npm install',
    yarn: 'yarn'
  }
};

export const getPackageManager = () => {
  const { packageManager } = getConfig();

  const res = {};

  for (const cmd of Object.keys(packageManagerCommands)) {
    res[cmd] = packageManagerCommands[cmd][packageManager];
  }

  return res;
};
