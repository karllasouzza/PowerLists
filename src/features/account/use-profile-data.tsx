import { useTheme } from '@/context/themes';
import { profiles$ } from '@/data/states/profile';
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/hooks/use-user';
import { useValue } from '@legendapp/state/react';

const useProfileData = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const profiles = useValue(profiles$);
  const profile = (user?.id ? profiles[user.id] : null) ?? null;
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();

  return { user, signOut, profile, theme, colorScheme, setTheme, setColorScheme };
};

export default useProfileData;
