import path from 'path';
import fs from 'fs-extra';

export const findPackageRoot = (file) => {
  const { dir } = path.parse(file);

  if (fs.existsSync(path.join(dir, 'package.json'))) {
    return dir;
  }

  return findPackageRoot(dir);
};
