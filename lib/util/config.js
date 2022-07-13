import path from 'path';
import merge from 'deepmerge';
import { cosmiconfigSync } from 'cosmiconfig';

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

const getConfigNames = (name) => ['rc.yaml', 'rc.yml']
  .map((suffix) => `.${name}${suffix}`);

const getConfigData = (name) => cosmiconfigSync(name, {
  searchPlaces: getConfigNames(name),
  transform(obj) {
    if (!obj) {
      return {
        config: {},
        filepath: path.resolve('.', `${name}rc.yml`)
      };
    }

    return obj;
  }
})
  .search()
  .config;

export const getConfig = () => {
  const mainConfig = getConfigData('cas');
  const overrideConfig = getConfigData('casrc.local');

  return merge.all([
    baseConfig,
    mainConfig,
    overrideConfig
  ]);
};
