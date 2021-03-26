'use strict';

const DEFAULT_COMMAND = `--help`;
const DEFAULT_COUNT = 1;
const USER_ARGV_INDEX = 2;
const MAX_ANNOUNCE_COUNT = 5;
const FILE_MOCKS_NAME = `mocks.json`;
const MAX_PUBLICATION_COUNT = 1000;
const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};


module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_COUNT,
  USER_ARGV_INDEX,
  FILE_MOCKS_NAME,
  MAX_PUBLICATION_COUNT,
  ExitCode,
  MAX_ANNOUNCE_COUNT,
};
