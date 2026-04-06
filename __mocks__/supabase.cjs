'use strict';
/* global jest */

const supabase = {
  auth: {
    getSession: jest.fn(),
    getUser: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
  functions: {
    invoke: jest.fn(),
  },
};

const resetSupabaseMocks = () => {
  supabase.auth.getSession.mockReset();
  supabase.auth.getUser.mockReset();
  supabase.auth.resetPasswordForEmail.mockReset();
  supabase.auth.updateUser.mockReset();
  supabase.functions.invoke.mockReset();

  supabase.auth.getSession.mockImplementation(async () => ({
    data: { session: { access_token: 'token' } },
  }));
  supabase.auth.getUser.mockImplementation(async () => ({ data: { user: null } }));
  supabase.auth.resetPasswordForEmail.mockImplementation(async () => ({ error: null }));
  supabase.auth.updateUser.mockImplementation(async () => ({ error: null }));
  supabase.functions.invoke.mockImplementation(async () => ({ error: null }));
};

module.exports = {
  supabase,
  resetSupabaseMocks,
};
