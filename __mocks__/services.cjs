'use strict';
/* global jest */

const showToast = jest.fn();
const promptDataMigration = jest.fn();
const SyncService = jest.fn(() => ({
  promptDataMigration,
}));

const resetServiceMocks = () => {
  showToast.mockReset();
  promptDataMigration.mockReset();
  SyncService.mockReset();

  showToast.mockImplementation(() => undefined);
  promptDataMigration.mockImplementation(async () => undefined);
  SyncService.mockImplementation(() => ({
    promptDataMigration,
  }));
};

module.exports = {
  showToast,
  promptDataMigration,
  SyncService,
  resetServiceMocks,
};
