import { asyncExec } from '../../../util/index.js';

export const cleanLib = async (pkgPath) => {
  await asyncExec(`npx shx rm -rf ${pkgPath}/lib`);
};
