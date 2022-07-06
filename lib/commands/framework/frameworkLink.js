import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import symlinkDir from 'symlink-dir';
import chalk from 'chalk';
import { askConfirm, logger } from '../../util/index.js';

const getPackagesPaths = () => {
  const monorepoPath = path.join(path.resolve(), '..', 'casimir-frontend');
  const { packages } = fs.readJsonSync(path.join(monorepoPath, 'lerna.json'));

  return packages
    .reduce((acc, pattern) => [
      ...acc,
      ...glob.sync(path.join(monorepoPath, pattern))
    ], []);
};

const getPackagesData = () => {
  const packagesPaths = getPackagesPaths();

  return packagesPaths.reduce((acc, pkg) => {
    const packageJson = path.join(pkg, 'package.json');
    const validPackage = fs.pathExistsSync(packageJson);

    return validPackage
      ? [
        ...acc,
        {
          name: fs.readJsonSync(path.join(pkg, 'package.json')).name,
          path: pkg
        }
      ]
      : acc;
  }, []);
};

const linkPackages = async (packages) => {
  const localNodeModules = path.join(path.resolve(), 'node_modules');

  const linkModulesPromises = packages.map(async (pkg) => {
    const destination = path.join(localNodeModules, ...pkg.name.split('/'));

    await symlinkDir(pkg.path, destination);

    logger.succeed(`${chalk.green('[linked]')} ${pkg.name}`);
  });

  await Promise.all(linkModulesPromises);
};

const command = 'link';

const describe = 'Link framework packages';

const builder = (yargs) => yargs.options({
  yes: {
    alias: 'y',
    describe: 'Confirm framework packages link'
  }
});

const handler = async (argv) => {
  logger.start('Get packages ...');
  const packages = getPackagesData();
  logger.succeed();

  if (argv.yes) {
    await linkPackages(packages);
  } else {
    const message = `Link packages:\n\n${packages.map((p) => p.name).join('\n')}\n`;
    await askConfirm(message, () => linkPackages(packages));
  }
};

export const frameworkLink = {
  command,
  describe,
  builder,
  handler
};
