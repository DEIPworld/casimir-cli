import { asyncExec } from './asyncExec.js';
import { logger } from './logger.js';

export const allowedBranches = [
  { name: 'master' },
  { name: 'staging', prerelease: 'beta', channel: 'beta' },
  { name: 'next', prerelease: 'next', channel: 'next' }
];

export const getCurrentBranch = async () => {
  const stdout = await asyncExec('git rev-parse --abbrev-ref HEAD', { silent: true });
  const name = stdout.trim();
  const branchInfo = allowedBranches.find((b) => b.name === name);

  return { ...(branchInfo || { name }), valid: !!branchInfo };
};

export const checkBranchAllowance = async (branch) => {
  const { name, valid } = branch;

  if (valid) return;

  const allowedBranchesList = allowedBranches
    .map((b) => b.name)
    .join(' ,');

  // eslint-disable-next-line max-len
  throw new Error(`Wrong branch ${name}. Publish can be started only from ${allowedBranchesList}.`);
};

export const checkBranchUpToDate = async (branch) => {
  await asyncExec('git remote update', { silent: true });
  const { name: currentBranch } = branch;

  const stdout = await asyncExec('git status -uno', { silent: true });

  const aheadMsg = {
    phrase: 'Your branch is ahead',
    recommend: 'Use "git push" to publish your local commits'
  };
  const behindMsg = {
    phrase: 'Your branch is behind',
    recommend: 'Use "git pull" to update your local branch'
  };
  const dirtyMsg = {
    phrase: 'Changes not staged',
    recommend: 'Use "git add [file]..." to update what will be committed'
  };

  const remoteBranch = `origin/${currentBranch}`;

  const isAhead = stdout.includes(aheadMsg.phrase);
  const isBehind = stdout.includes(behindMsg.phrase);
  const isDirty = stdout.includes(dirtyMsg.phrase);

  if (isAhead) {
    throw new Error(`${aheadMsg.phrase} of '${remoteBranch}'. ${aheadMsg.recommend}`);
  }
  if (isBehind) {
    throw new Error(`${behindMsg.phrase} of '${remoteBranch}'. ${behindMsg.recommend}`);
  }
  if (isDirty) {
    throw new Error(`${dirtyMsg.phrase} for commit. ${dirtyMsg.recommend}`);
  }

  return true;
};

export const makeBranchCheck = async (currentBranch) => {
  try {
    await checkBranchAllowance(currentBranch);
    await checkBranchUpToDate(currentBranch);
  } catch (e) {
    logger.error(e);
  }
};
