import { frameworkUpdate } from './frameworkUpdate.js';
import { frameworkLink } from './frameworkLink.js';

const command = 'framework';

const describe = 'Operations with framework on project side';

const builder = (yargs) => yargs
  .command(frameworkUpdate)
  .command(frameworkLink);

export const frameworkCommand = {
  command,
  describe,
  builder
};
