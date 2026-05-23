'use strict';
/* global jest */

let currentUser = null;
let currentSession = null;
const listeners = new Set();

const getCurrentUser = jest.fn(() => currentUser);
const getCurrentSession = jest.fn(() => currentSession);

const setAuthState = jest.fn(({ user, session }) => {
  if (user !== undefined) currentUser = user;
  if (session !== undefined) currentSession = session;
  listeners.forEach((l) => l());
});

const clearAuthState = jest.fn(() => {
  currentUser = null;
  currentSession = null;
  listeners.forEach((l) => l());
});

const subscribe = jest.fn((listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
});

const resetAuthState = () => {
  currentUser = null;
  currentSession = null;
  listeners.clear();
};

module.exports = {
  getCurrentUser,
  getCurrentSession,
  setAuthState,
  clearAuthState,
  subscribe,
  resetAuthState,
};
