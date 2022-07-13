import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import merge from 'deepmerge';

const baseConfig = {
  packageManager: 'npm',
  command: {
    framework: {
      link: [],
      update: null
    },
    packages: {
      bootstrap: null,
      build: null,
      dev: null,
      release: null
    },
    project: {
      release: null
    }
  }
};

export const getConfig = () => {
  const mainPath = path.join(path.resolve(), '.casrc.yml');
  const overridePath = path.join(path.resolve(), '.casrc.local.yml');

  const mainConfig = fs.existsSync(mainPath)
    ? yaml.load(fs.readFileSync(mainPath, 'utf8'))
    : {};

  const overrideConfig = fs.existsSync(overridePath)
    ? yaml.load(fs.readFileSync(overridePath, 'utf8'))
    : {};

  return merge.all([
    baseConfig,
    mainConfig,
    overrideConfig
  ]);
};
