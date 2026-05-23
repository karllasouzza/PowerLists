import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Session } from '@supabase/supabase-js';
/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'powerlists://password-recovery'),
}));

jest.mock('@/lib/supabase', () => require('../../../__mocks__/supabase.cjs'));
jest.mock('@/data/actions/auth', () => require('../../../__mocks__/auth-actions.cjs'));
jest.mock('@/services', () => require('../../../__mocks__/services.cjs'));
jest.mock('@/features/auth/authState', () => require('../../../__mocks__/auth-state.cjs'));

type UseAuthContract = {
  session: Session | null;
  isInitialized: boolean;
  isLoading: boolean;
  fetchUserDataAsync: () => Promise<boolean>;
  signInWithPassword: (params: { email: string; password: string }) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  resetPassword: (params: { password: string }) => Promise<boolean>;
};

type AuthActionsMock = {
  signInWithPassword: jest.Mock;
  performSignOut: jest.Mock;
  resetAuthActionMocks: () => void;
};

type SupabaseMock = {
  auth: {
    updateUser: jest.Mock;
  };
  resetSupabaseMocks: () => void;
};

type ServicesMock = {
  showToast: jest.Mock;
  SyncService: jest.Mock;
  promptDataMigration: jest.Mock;
  resetServiceMocks: () => void;
};

const { useAuth } = require('@/hooks/use-auth') as { useAuth: () => UseAuthContract };
const {
  getCurrentUser,
  getCurrentSession,
  setAuthState,
  resetAuthState,
} = require('../../../__mocks__/auth-state.cjs');
const { supabase, resetSupabaseMocks } = require('../../../__mocks__/supabase.cjs') as {
  supabase: SupabaseMock;
  resetSupabaseMocks: () => void;
};
const authActions = require('../../../__mocks__/auth-actions.cjs') as AuthActionsMock;
const { showToast, SyncService, promptDataMigration, resetServiceMocks } =
  require('../../../__mocks__/services.cjs') as ServicesMock;

describe('useAuth', () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    resetAuthState();
    resetSupabaseMocks();
    authActions.resetAuthActionMocks();
    resetServiceMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should initialize auth state when no current user exists', async () => {
    const auth = useAuth();

    const result = await auth.fetchUserDataAsync();

    expect(result).toBe(false);
    expect(auth.isInitialized).toBe(true);
    expect(auth.isLoading).toBe(false);
  });

  it('should sign in successfully and migrate guest data', async () => {
    const previousGuest = {
      id: 'guest-1',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
    };
    const signedUser = { id: 'user-1', is_guest: false };

    setAuthState({ user: previousGuest });
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
    expect(getCurrentUser()).toEqual(signedUser);
    expect(getCurrentSession()).toEqual({ access_token: 'token' });
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
      }),
    );
  });

  it('should return false and show error toast when sign in fails', async () => {
    (authActions.signInWithPassword as jest.Mock).mockImplementation(async () => ({
      user: null,
      error: 'invalid credentials',
    }));

    const auth = useAuth();
    const result = await auth.signInWithPassword({ email: 'wrong@example.com', password: 'wrong' });

    expect(result).toBe(false);
    expect(auth.isLoading).toBe(false);
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
      }),
    );
  });

  it('should sign out and clear user and session', async () => {
    setAuthState({
      user: {
        id: 'user-1',
        is_guest: false,
        created_at: '2026-04-05T00:00:00.000Z',
      },
      session: { access_token: 'token' } as Session,
    });

    const auth = useAuth();
    const result = await auth.signOut();

    expect(result).toBe(true);
    expect(authActions.performSignOut).toHaveBeenCalledTimes(1);
    expect(getCurrentUser()).toBeNull();
    expect(getCurrentSession()).toBeNull();
  });

  it('should update password when resetPassword succeeds', async () => {
    const auth = useAuth();

    const result = await auth.resetPassword({ password: 'new-password-123' });

    expect(result).toBe(true);
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'new-password-123' });
  });
});
