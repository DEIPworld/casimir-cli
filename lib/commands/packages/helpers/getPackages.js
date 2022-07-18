import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';

import { getLernaJson } from '../../../util/index.js';

const legacyExcludes = ['lib-crypto', 'RpcClient'];

export const getPackages = (forBuild = true) => getLernaJson().packages
  .reduce((acc, pattern) => [...acc, ...glob.sync(pattern, { absolute: true })], [])

  .filter((p) => {
    const pArr = path.parse(p);
    if (forBuild) {
      return fs.existsSync(path.join(p, 'src')) && !legacyExcludes.includes(pArr.name);
    }
    return true;
  })

  .map((pkgPath) => {
    const { name, dependencies } = fs.readJsonSync(`${pkgPath}/package.json`);

    let platformDependencies = [];

    if (dependencies) {
      platformDependencies = Object.keys(dependencies)
        .filter((key) => key.includes('@deip') || key.includes('@casimir'));
    }

    return {
      name,
      path: pkgPath,
      deps: platformDependencies
    };
  });
