'use strict';
/* global jest */

const clearAllStorage = jest.fn();

const resetStorageMocks = () => {
  clearAllStorage.mockReset();
  clearAllStorage.mockImplementation(() => undefined);
};

module.exports = {
  clearAllStorage,
  resetStorageMocks,
};
