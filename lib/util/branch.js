import { asyncExec } from './asyncExec.js';

export const allowedBranches = [
  { name: 'master' },
  { name: 'develop', prerelease: 'dev', channel: 'dev' },
  { name: 'next', prerelease: 'next', channel: 'next' }
];

export const allowedBranchesList = allowedBranches.map((b) => b.name);

export const getCurrentBranch = async () => {
  const stdout = await asyncExec('git rev-parse --abbrev-ref HEAD');
  const name = stdout.trim();

  const valid = allowedBranchesList.includes(name);
  return { name, valid };
};

export const isPrereleaseBranch = (branch) => allowedBranches
  .filter((b) => Object.prototype.hasOwnProperty.call(b, 'prerelease'))
  .map((b) => b.name)
  .includes(branch.name);

export const getBranchOptions = (branch) => allowedBranches.find((b) => b.name === branch.name);

export const checkIfAllowedBranch = async (branch) => {
  const { name, valid } = branch;

  if (valid) return;

  // eslint-disable-next-line max-len
  throw new Error(`Wrong branch ${name}. Publish can be started only from ${allowedBranchesList.join(' ,')}.`);
};

export const checkBranchUpToDate = async (branch) => {
  await asyncExec('git remote update');
  const { name: currentBranch } = branch;

  const stdout = await asyncExec('git status -uno');

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
