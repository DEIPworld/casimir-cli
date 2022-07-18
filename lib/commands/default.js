const command = '$0';

const handler = () => console.info('No command specified. Use \'cas --help\'.');

export const defaultCommand = {
  command,
  handler
};
