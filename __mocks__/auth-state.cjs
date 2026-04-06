'use strict';
/* global jest */

const createCell = (initial) => {
  let value = initial;

  return {
    get: jest.fn(() => value),
    set: jest.fn((next) => {
      value = next;
    }),
  };
};

const auth$ = {
  user: createCell(null),
  session: createCell(null),
  isInitialized: createCell(false),
  isLoading: createCell(false),
};

const resetAuthState = () => {
  auth$.user.set(null);
  auth$.session.set(null);
  auth$.isInitialized.set(false);
  auth$.isLoading.set(false);
};

module.exports = {
  auth$,
  createCell,
  resetAuthState,
};
