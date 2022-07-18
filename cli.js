#!/usr/bin/env node

import yargs from 'yargs';

import {
  defaultCommand,
  frameworkCommand,
  packagesCommand,
  projectCommand
} from './lib/commands/index.js';

const commonOptions = {
  interactive: {
    alias: 'i',
    describe: 'Enable interactive prompts'
  }
};

yargs(process.argv.slice(2))
  .usage('$0 <command> <action> [options]')

  .command(defaultCommand)

  .command(frameworkCommand)
  .command(packagesCommand)
  .command(projectCommand)

  .options(commonOptions)
  .alias('h', 'help')
  .alias('v', 'version')
  .help()

  .wrap(null)

  .parse();
