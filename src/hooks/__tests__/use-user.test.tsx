import { beforeEach, describe, expect, it, jest } from '@jest/globals';
/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock('@legendapp/state/react', () => require('../../../__mocks__/legend-state-react.cjs'));
jest.mock('@/data/states/auth', () => require('../../../__mocks__/auth-state.cjs'));
jest.mock('@/data/actions/auth', () => require('../../../__mocks__/auth-actions.cjs'));
jest.mock('@/lib/supabase', () => require('../../../__mocks__/supabase.cjs'));

const { useUser } = require('@/hooks/use-user') as { useUser: () => any };
const { auth$, resetAuthState } = require('../../../__mocks__/auth-state.cjs') as {
  auth$: any;
  resetAuthState: () => void;
};
const authActions = require('../../../__mocks__/auth-actions.cjs') as Record<string, jest.Mock> & {
  resetAuthActionMocks: () => void;
};
const { supabase, resetSupabaseMocks } = require('../../../__mocks__/supabase.cjs') as {
  supabase: any;
  resetSupabaseMocks: () => void;
};

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    resetAuthState();
    authActions.resetAuthActionMocks();
    resetSupabaseMocks();
  });

  it('returns current user snapshot', () => {
    const current = {
      id: 'guest-1',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
    };

    auth$.user.set(current as any);

    const userHook = useUser();

    expect(userHook.user).toEqual(current);
  });

  it('updates user by patching current id and setting returned value', async () => {
    const current = {
      id: 'guest-1',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
    };
    const updated = {
      ...current,
      name: 'Maria',
    };

    auth$.user.set(current as any);
    (authActions.patchUser as jest.Mock).mockImplementation(async () => ({ user: updated }));

    await useUser().updateUser({ updates: { name: 'Maria' } as any });

    expect(authActions.patchUser).toHaveBeenCalledWith({
      id: current.id,
      name: 'Maria',
    });
    expect(auth$.user.get()).toEqual(updated);
  });

  it('creates guest and resets session', async () => {
    const guest = {
      id: 'guest-2',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
      name: 'Convidado',
    };

    auth$.session.set({ access_token: 'old-token' } as any);
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

  it('soft deletes guest user locally without calling supabase auth update', async () => {
    const guest = {
      id: 'guest-2',
      is_guest: true,
      created_at: '2026-04-05T00:00:00.000Z',
    };

    auth$.user.set(guest as any);

    const result = await useUser().softDeleteUser(guest.id);

    expect(result.user).toEqual(
      expect.objectContaining({
        id: guest.id,
        deleted_at: expect.any(String),
      }),
    );
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it('hard deletes non-guest user with edge function and clears local user', async () => {
    const signedUser = {
      id: 'user-1',
      is_guest: false,
      created_at: '2026-04-05T00:00:00.000Z',
    };

    auth$.user.set(signedUser as any);

    const result = await useUser().hardDeleteUser(signedUser.id);

    expect(result.success).toBe(true);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('user-self-deletion');
    expect(auth$.user.get()).toBeNull();
  });
});
