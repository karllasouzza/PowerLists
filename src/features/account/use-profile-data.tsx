import { useMemo } from 'react';
import { Q } from '@nozbe/watermelondb';

import { useUserPreferences } from '@/context/themes/context';
import { database } from '@/database';
import { Profile as ProfileModel } from '@/database/models/Profile';
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/hooks/use-user';
import { useObservableQuery } from '@/hooks/use-observable-query';

const useProfileData = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { theme, colorScheme, setTheme, setColorScheme } = useUserPreferences();

  const userId = user?.id ?? '';
  const profileQuery = useMemo(
    () =>
      database
        .get<ProfileModel>('profiles')
        .query(Q.where('user_id', userId), Q.where('deleted_at', Q.eq(null))),
    [userId],
  );
  const profiles = useObservableQuery<ProfileModel>(profileQuery);
  const profile = profiles[0] ?? null;

  return { user, signOut, profile, theme, colorScheme, setTheme, setColorScheme };
};

export default useProfileData;
