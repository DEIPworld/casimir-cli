import { projectRelease } from './projectRelease.js';

const command = 'project';

const describe = 'Operations with current project';

const builder = (yargs) => yargs
  .command(projectRelease);

export const projectCommand = {
  command,
  describe,
  builder
};
