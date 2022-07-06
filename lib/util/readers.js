import fs from 'fs-extra';
import path from 'path';

export const getPackageJson = () => fs.readJsonSync(path.join(path.resolve(), 'package.json'));

export const getLernaJson = () => fs.readJsonSync(path.join(path.resolve(), 'lerna.json'));

export const getBabelConfigPath = () => path.join(path.resolve(), 'babel.config.js');
