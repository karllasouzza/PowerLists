import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'powerlists://password-recovery'),
}));

jest.mock('@legendapp/state/react', () => require('../../../__mocks__/legend-state-react.cjs'));
jest.mock('@/lib/supabase', () => require('../../../__mocks__/supabase.cjs'));
jest.mock('@/data/actions/auth', () => require('../../../__mocks__/auth-actions.cjs'));
jest.mock('@/services', () => require('../../../__mocks__/services.cjs'));
jest.mock('@/data/storage', () => require('../../../__mocks__/storage.cjs'));
jest.mock('@/data/states/auth', () => require('../../../__mocks__/auth-state.cjs'));

const { useAuth } = require('@/hooks/use-auth') as { useAuth: () => any };
const { auth$, resetAuthState } = require('../../../__mocks__/auth-state.cjs') as {
  auth$: any;
  resetAuthState: () => void;
};
const { supabase, resetSupabaseMocks } = require('../../../__mocks__/supabase.cjs') as {
  supabase: any;
  resetSupabaseMocks: () => void;
};
const authActions = require('../../../__mocks__/auth-actions.cjs') as Record<string, jest.Mock> & {
  resetAuthActionMocks: () => void;
};
const { clearAllStorage, resetStorageMocks } = require('../../../__mocks__/storage.cjs') as {
  clearAllStorage: jest.Mock;
  resetStorageMocks: () => void;
};
const { showToast, SyncService, promptDataMigration, resetServiceMocks } =
  require('../../../__mocks__/services.cjs') as {
    showToast: jest.Mock;
    SyncService: jest.Mock;
    promptDataMigration: jest.Mock;
    resetServiceMocks: () => void;
  };

describe('useAuth', () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    resetAuthState();
    resetSupabaseMocks();
    authActions.resetAuthActionMocks();
    resetServiceMocks();
    resetStorageMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('initializes auth state when no current user exists', async () => {
    const auth = useAuth();

    const result = await auth.fetchUserDataAsync();

    expect(result).toBe(false);
    expect(auth$.isInitialized.get()).toBe(true);
    expect(auth$.isLoading.get()).toBe(false);
  });

  it('signs in successfully and migrates guest data', async () => {
    const previousGuest = {
      id: 'guest-1',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
    };
    const signedUser = { id: 'user-1', is_guest: false };

    auth$.user.set(previousGuest as any);
    (authActions.signInWithPassword as jest.Mock).mockImplementation(async () => ({
      user: signedUser,
      error: null,
    }));

    const auth = useAuth();
    const result = await auth.signInWithPassword({
      email: 'user@example.com',
      password: '12345678',
    });

    expect(result).toBe(true);
    expect(SyncService).toHaveBeenCalledTimes(1);
    expect(promptDataMigration).toHaveBeenCalledWith({
      guestId: previousGuest.id,
      userId: signedUser.id,
    });
    expect(auth$.user.get()).toEqual(signedUser);
    expect(auth$.session.get()).toEqual({ access_token: 'token' });
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
      }),
    );
  });

  it('returns false and shows error toast when sign in fails', async () => {
    (authActions.signInWithPassword as jest.Mock).mockImplementation(async () => ({
      user: null,
      error: 'invalid credentials',
    }));

    const auth = useAuth();
    const result = await auth.signInWithPassword({ email: 'wrong@example.com', password: 'wrong' });

    expect(result).toBe(false);
    expect(auth$.isLoading.get()).toBe(false);
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
      }),
    );
  });

  it('signs out and clears user, session, and storage', async () => {
    auth$.user.set({
      id: 'user-1',
      is_guest: false,
      created_at: '2026-04-05T00:00:00.000Z',
    } as any);
    auth$.session.set({ access_token: 'token' } as any);

    const auth = useAuth();
    const result = await auth.signOut();

    expect(result).toBe(true);
    expect(authActions.performSignOut).toHaveBeenCalledTimes(1);
    expect(clearAllStorage).toHaveBeenCalledTimes(1);
    expect(auth$.user.get()).toBeNull();
    expect(auth$.session.get()).toBeNull();
  });

  it('updates password when resetPassword succeeds', async () => {
    const auth = useAuth();

    const result = await auth.resetPassword({ password: 'new-password-123' });

    expect(result).toBe(true);
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'new-password-123' });
  });
});
