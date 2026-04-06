'use strict';
/* global jest */

const fetchOrRestoreUser = jest.fn();
const syncWithSupabase = jest.fn();
const patchUser = jest.fn();
const signInWithPassword = jest.fn();
const handleError = jest.fn((fallback, _error) => fallback);
const createSupabaseUser = jest.fn();
const performSignOut = jest.fn();
const createGuest = jest.fn();

const resetAuthActionMocks = () => {
  fetchOrRestoreUser.mockReset();
  syncWithSupabase.mockReset();
  patchUser.mockReset();
  signInWithPassword.mockReset();
  handleError.mockReset();
  createSupabaseUser.mockReset();
  performSignOut.mockReset();
  createGuest.mockReset();

  fetchOrRestoreUser.mockImplementation(async () => ({ user: null }));
  syncWithSupabase.mockImplementation(async () => ({ user: null }));
  patchUser.mockImplementation(async () => ({ user: null }));
  signInWithPassword.mockImplementation(async () => ({
    user: null,
    error: 'invalid credentials',
  }));
  handleError.mockImplementation((fallback, _error) => fallback);
  createSupabaseUser.mockImplementation(async () => ({
    user: null,
    error: 'signup failed',
  }));
  performSignOut.mockImplementation(async () => undefined);
  createGuest.mockImplementation(async () => ({ user: null, error: 'failed' }));
};

module.exports = {
  fetchOrRestoreUser,
  syncWithSupabase,
  patchUser,
  signInWithPassword,
  handleError,
  createSupabaseUser,
  performSignOut,
  createGuest,
  resetAuthActionMocks,
};
