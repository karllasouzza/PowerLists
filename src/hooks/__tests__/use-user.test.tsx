import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Session } from '@supabase/supabase-js';
import type { UserGuestType, UserOperationResult, UserType } from '@/data/types/user';
/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock('@legendapp/state/react', () => require('../../../__mocks__/legend-state-react.cjs'));
jest.mock('@/data/states/auth', () => require('../../../__mocks__/auth-state.cjs'));
jest.mock('@/data/actions/auth', () => require('../../../__mocks__/auth-actions.cjs'));
jest.mock('@/lib/supabase', () => require('../../../__mocks__/supabase.cjs'));

type Cell<T> = {
  get: () => T;
  set: (next: T) => void;
};

type AuthStoreMock = {
  user: Cell<UserType>;
  session: Cell<Session | null>;
  isInitialized: Cell<boolean>;
  isLoading: Cell<boolean>;
};

type UseUserContract = {
  user: UserType;
  updateUser: (params: { updates: { name?: string } }) => Promise<void>;
  createGuest: (params: { name?: string }) => Promise<UserType>;
  softDeleteUser: (id: string) => Promise<UserOperationResult>;
  hardDeleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;
};

type AuthActionsMock = {
  patchUser: jest.Mock;
  createGuest: jest.Mock;
  resetAuthActionMocks: () => void;
};

type SupabaseMock = {
  auth: {
    updateUser: jest.Mock;
  };
  functions: {
    invoke: jest.Mock;
  };
};

const { useUser } = require('@/hooks/use-user') as { useUser: () => UseUserContract };
const { auth$, resetAuthState } = require('../../../__mocks__/auth-state.cjs') as {
  auth$: AuthStoreMock;
  resetAuthState: () => void;
};
const authActions = require('../../../__mocks__/auth-actions.cjs') as AuthActionsMock;
const { supabase, resetSupabaseMocks } = require('../../../__mocks__/supabase.cjs') as {
  supabase: SupabaseMock;
  resetSupabaseMocks: () => void;
};

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    resetAuthState();
    authActions.resetAuthActionMocks();
    resetSupabaseMocks();
  });

  it('should return current user snapshot', () => {
    const current: UserGuestType = {
      id: 'guest-1',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
    };

    auth$.user.set(current);

    const userHook = useUser();

    expect(userHook.user).toEqual(current);
  });

  it('should update user by patching current id and setting the returned value', async () => {
    const current: UserGuestType = {
      id: 'guest-1',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
    };
    const updated: UserGuestType = {
      ...current,
      name: 'Maria',
    };

    auth$.user.set(current);
    (authActions.patchUser as jest.Mock).mockImplementation(async () => ({ user: updated }));

    await useUser().updateUser({ updates: { name: 'Maria' } });

    expect(authActions.patchUser).toHaveBeenCalledWith({
      id: current.id,
      name: 'Maria',
    });
    expect(auth$.user.get()).toEqual(updated);
  });

  it('should create guest and reset session', async () => {
    const guest: UserGuestType = {
      id: 'guest-2',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
      name: 'Convidado',
    };

    auth$.session.set({ access_token: 'old-token' } as Session);
    (authActions.createGuest as jest.Mock).mockImplementation(async () => ({
      user: guest,
      error: null,
    }));

    const created = await useUser().createGuest({ name: 'Convidado' });

    expect(created).toEqual(guest);
    expect(auth$.user.get()).toEqual(guest);
    expect(auth$.session.get()).toBeNull();
    expect(auth$.isLoading.get()).toBe(false);
  });

  it('should soft delete guest user locally without calling supabase auth update', async () => {
    const guest: UserGuestType = {
      id: 'guest-2',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
    };

    auth$.user.set(guest);

    const result = await useUser().softDeleteUser(guest.id);

    const deletedUser = result.user as UserGuestType | null;
    expect(deletedUser?.id).toBe(guest.id);
    expect(typeof deletedUser?.deleted_at).toBe('string');
    expect(Boolean(deletedUser?.deleted_at)).toBe(true);
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it('should hard delete non-guest user with edge function and clear local user', async () => {
    const signedUser: UserGuestType = {
      id: 'user-1',
      is_guest: false,
      created_at: '2026-04-05T00:00:00.000Z',
    };

    auth$.user.set(signedUser);

    const result = await useUser().hardDeleteUser(signedUser.id);

    expect(result.success).toBe(true);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('user-self-deletion');
    expect(auth$.user.get()).toBeNull();
  });
});
