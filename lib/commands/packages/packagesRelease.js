import {
  asyncExec,
  askConfirm,
  askOptions,
  getLernaJson,
  logger,
  getCurrentBranch,
  makeBranchCheck
} from '../../util/index.js';

import { packagesBuild } from './packagesBuild.js';

const makePrepare = async (argv) => {
  if (argv.clean) {
    await asyncExec('npx lerna clean --yes');
  }
  if (argv.bootstrap) {
    await asyncExec('npx lerna bootstrap --no-ci -- --legacy-peer-deps');
  }
};

const revertPublish = async () => {
  const { version } = getLernaJson();
  await asyncExec('git reset --hard HEAD~1');
  await asyncExec(`git tag -d v${version}`);
};

const tryPublish = async (versionFlags = [], publishFlags = []) => {
  const requiredVersionFlags = [
    '--include-merged-tags',
    '--no-push',
    '--exact'
  ];
  const combinedVersionFlags = [...versionFlags, ...requiredVersionFlags];

  try {
    await asyncExec(`lerna version ${combinedVersionFlags.join(' ')} --yes`);
    await asyncExec('git push --tags');
    await asyncExec(`npx lerna publish from-package ${publishFlags.join(' ')} --yes`);
  } catch (e) {
    await revertPublish();
    logger.error(e);
  }
};

const makePrereleasePublish = async (currentBranch) => {
  const { prerelease: preid, channel: distTag } = currentBranch;

  const versionFlags = [
    '--conventional-prerelease',
    `--preid ${preid}`
  ];
  const publishFlags = [
    `--dist-tag ${distTag}`
  ];

  await tryPublish(versionFlags, publishFlags);
};

const makeReleasePublish = async () => {
  const { version } = getLernaJson();
  const devRegex = /^v\d+\.\d+\.\d+-.*$/;

  const needGraduate = devRegex.test(version);

  if (needGraduate) {
    await asyncExec(`git tag -d $(git tag -l | grep -E '${devRegex.toString()}')`);
  }

  const versionFlags = needGraduate ? ['--conventional-graduate'] : [];

  await tryPublish(versionFlags, []);

  if (needGraduate) {
    await asyncExec('git pull --tags');
  }
};

const makePublish = async (currentBranch, argv) => {
  logger.start('Preparing for release...');
  await makePrepare(argv);
  await packagesBuild.handler();
  logger.succeed();

  logger.start('Make release...');
  if (currentBranch.prerelease) {
    await makePrereleasePublish(currentBranch);
  } else {
    await makeReleasePublish(currentBranch);
  }
  logger.succeed();
};

// //////////////////////////////

const command = 'release';

const commandOptions = {
  bootstrap: {
    type: 'boolean',
    describe: 'Bootstrap packages',
    default: true
  },
  clean: {
    type: 'boolean',
    describe: 'Clean packages',
    default: true
  }
};

const describe = 'Release and publish framework packages';

const builder = (yargs) => yargs
  .options({
    ...commandOptions,
    yes: {
      alias: 'y',
      describe: 'Confirm packages release'
    }
  })
  .example([
    [
      `$0 ${command}`,
      'Make default packages publish'
    ],
    [
      `$0 ${command} --prerelease`,
      'Make prerelease packages publish with \'beta\' identifier'
    ],
    [
      `$0 ${command} --prerelease --preid next`,
      'Make prerelease packages publish with \'next\' identifier'
    ]
  ]);

const handler = async (argv) => {
  const _argv = argv.interactive ? await askOptions(commandOptions) : argv;

  const currentBranch = await getCurrentBranch();

  logger.start('Check brunch ...');
  await makeBranchCheck(currentBranch);
  logger.succeed('All check passed.');

  if (_argv.yes) {
    await makePublish(currentBranch, _argv);
  } else {
    await askConfirm('Release packages?\n', () => makePublish(currentBranch, _argv));
  }
};

export const packagesRelease = {
  command,
  describe,
  builder,
  handler
};
