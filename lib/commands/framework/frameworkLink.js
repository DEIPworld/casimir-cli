import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import symlinkDir from 'symlink-dir';
import chalk from 'chalk';
import { askConfirm, getConfig, logger } from '../../util/index.js';

const getPackagesPaths = () => {
  const config = getConfig();
  const link = config?.command?.framework?.link || [];

  const pkgList = [];

  for (const linkedPath of link) {
    const lernaConfig = path.join(linkedPath, 'lerna.json');

    if (fs.existsSync(lernaConfig)) {
      const { packages } = fs.readJsonSync(lernaConfig);
      const result = packages
        .reduce((acc, pattern) => [
          ...acc,
          ...glob.sync(path.join(linkedPath, pattern))
        ], []);
      pkgList.push(...result);
    }
  }
  return pkgList;
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
