import kindOf from 'kind-of';
import inquirer from 'inquirer';

const getPromptType = (opt) => {
  // input, number, confirm, list, rawlist, expand, checkbox, password, editor

  if (opt.type === 'string' && kindOf(opt.choices) === 'array') {
    return 'list';
  }

  if (opt.type === 'array' && kindOf(opt.choices) === 'array') {
    return 'checkbox';
  }

  if (opt.type === 'boolean') {
    return 'confirm';
  }

  return 'input';
};

export const convertOptionsToPrompt = (options) => Object.keys(options)
  .reduce((acc, key) => {
    const opt = options[key];

    return [...acc, {
      type: getPromptType(opt),
      name: key,
      message: opt.describe,
      default: opt.default,
      choices: opt.choices
    }];
  }, []);

export const askOptions = async (commandOptions) => inquirer
  .prompt(convertOptionsToPrompt(commandOptions));

export const askConfirm = async (
  message = 'Process action?',
  cb = () => {}
) => {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message
    }
  ]);

  if (confirmed) {
    await cb();
  }
};
