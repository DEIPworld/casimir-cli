import ncu from 'npm-check-updates';
import path from 'path';

import {
  logger,
  makeTable,
  asyncExec,
  getPackageJson,
  askOptions,
  askConfirm,
  getPackageManager
} from '../../util/index.js';

const pkgScopes = ['casimir', 'deip'];
const pkgVersions = ['latest', 'greatest', 'newest', 'minor', 'patch'];
const pkgFile = path.join(path.resolve(), 'package.json');

const makeUpdate = async ({ target, scope }, upgrade = false) => {
  const filter = `/^@(${scope.join('|')})\\/.*$/`;

  return ncu.run({
    pkgFile,
    target,
    filter,
    upgrade
  });
};

const makeInstall = async () => {
  const { install } = getPackageManager();
  await asyncExec(install, { silent: true });
};

const updatePackages = async (_argv) => {
  logger.start('Update packages ...');
  await makeUpdate(_argv, true);
  await makeInstall();
  logger.succeed('Done.');
};

const getUpdatePath = (needUpdate) => {
  const { dependencies, devDependencies } = getPackageJson();
  const res = [];

  for (const [pkg, version] of Object.entries(needUpdate)) {
    res.push({
      package: pkg,
      oldVersion: dependencies[pkg] || devDependencies[pkg] || 'undefined version',
      newVersion: version
    });
  }

  return res;
};

// //////////////////////////////

const commandOptions = {
  target: {
    alias: 't',
    type: 'string',

    describe: 'point to target packages version',

    choices: pkgVersions,
    default: pkgVersions[0]
  },
  scope: {
    alias: 's',
    type: 'array',

    describe: 'Packages scopes',

    choices: pkgScopes,
    default: pkgScopes
  }
};

// //////////////////////////////

const command = 'update';

const describe = 'Update framework packages';

const builder = (yargs) => yargs
  .options({
    ...commandOptions,
    yes: {
      alias: 'y',
      describe: 'Confirm framework packages update'
    }
  })
  .example([
    [
      `$0 ${command}`,
      'Update to whatever the package\'s "latest" git tag points to.'
    ],
    [
      `$0 ${command} --target greatest`,
      'Update to the highest version number. Includes prereleases.'
    ],
    [
      `$0 ${command} --scope deip`,
      'Update only @deip/* packages'
    ]
  ]);

const handler = async (argv) => {
  const _argv = argv.interactive ? await askOptions(commandOptions) : argv;

  logger.start('Check updates ...');
  const needUpdate = getUpdatePath(await makeUpdate(_argv));
  logger.stop();

  if (needUpdate.length) {
    if (argv.yes) {
      await updatePackages(_argv);
    } else {
      const table = makeTable(
        needUpdate.map((entry) => [entry.package, entry.oldVersion, '→', entry.newVersion]),
        [],
        true,
        {
          colAligns: ['left', 'right', 'center', 'right'],
          style: { 'padding-left': 2, 'padding-right': 2 }
        }
      );
      const message = `Update packages:\n\n${table.toString()}\n\n`;

      await askConfirm(message, () => updatePackages(_argv));
    }
  } else {
    logger.succeed('Your packages is up to date');
  }
};

export const frameworkUpdate = {
  command,
  describe,
  builder,
  handler
};
