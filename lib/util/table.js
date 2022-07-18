import Table from 'cli-table';

const simpleSet = {
  top: '',
  'top-mid': '',
  'top-left': '',
  'top-right': '',
  bottom: '',
  'bottom-mid': '',
  'bottom-left': '',
  'bottom-right': '',
  left: '',
  'left-mid': '',
  mid: '',
  'mid-mid': '',
  right: '',
  'right-mid': '',
  middle: ''
};

export const makeTable = (
  rows = [],
  headers = [],
  simple = false,
  options = {}
) => {
  const opt = {
    ...options,
    ...(simple ? { chars: simpleSet } : {}),
    headers,
    rows
  };
  return new Table(opt);
};
