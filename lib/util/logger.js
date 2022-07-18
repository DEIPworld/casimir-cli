import chalk from 'chalk';
import ora from 'ora';
import kindOf from 'kind-of';

const spinner = ora();

export const logger = {
  error(error, exit = true) {
    if (kindOf(error) === 'error') {
      spinner.fail(chalk.red(error.toString()));
    } else {
      spinner.fail(chalk.red(error));
    }

    if (exit) {
      process.exit(1);
    }
  },

  succeed(msg) {
    spinner.succeed(msg);
  },

  start(msg) {
    spinner.start(msg);
  },

  stop(msg) {
    spinner.stop(msg);
  }
};
