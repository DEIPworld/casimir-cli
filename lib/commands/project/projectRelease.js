import semanticRelease from 'semantic-release';

import {
  allowedBranches,
  askConfirm,
  asyncExec,
  getCurrentBranch,
  makeBranchCheck,
  logger
} from '../../util/index.js';

const releaseConfig = {
  branches: allowedBranches,
  tagFormat: 'v${version}'
};

const getNextVersion = async () => {
  const { nextRelease } = await semanticRelease({
    ...releaseConfig,
    dryRun: true,
    plugins: ['@semantic-release/commit-analyzer']
  });

  return nextRelease ? nextRelease.version : false;
};

const makeRelease = async (argv) => {
  const { ci, dryRun, npmPublish } = argv;

  await semanticRelease({
    ci,
    dryRun,
    ...releaseConfig,
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
      ['@semantic-release/npm', { npmPublish }],
      ['@semantic-release/git', {
        message: 'chore: release v${nextRelease.version}\n\n${nextRelease.notes}'
      }]
    ]
  });
};

const command = 'release';

const commandOptions = {
  ci: {
    type: 'boolean',

    describe: 'Enable/Disable CI verification',

    default: true
  },
  dryRun: {
    type: 'boolean',

    describe: 'Run command in test mode',

    default: false
  },
  npmPublish: {
    type: 'boolean',

    describe: 'Publish to npm registry',

    default: false
  }
};

const describe = 'Release current projectCommand';

const builder = (yargs) => yargs
  .options({
    ...commandOptions,
    yes: {
      alias: 'y',
      describe: 'Confirm projectCommand release'
    }
  });

const handler = async (argv) => {
  const currentBranch = await getCurrentBranch();

  logger.start('Check brunch ...');
  await makeBranchCheck(currentBranch);
  logger.succeed('All check passed.');

  if (argv.yes) {
    await makeRelease(argv);
  } else {
    const nextVersion = await getNextVersion();

    if (!nextVersion) {
      logger.succeed('Nothing to release');
    }

    await askConfirm(`Do you want release ${nextVersion}?`, () => makeRelease(argv));
  }
  await asyncExec('git fetch');
};

export const projectRelease = {
  command,
  describe,
  builder,
  handler
};
