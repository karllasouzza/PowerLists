import { useTheme } from '@/context/themes';
import { profiles$ } from '@/data/states/profile';
import { useAuth } from '@/hooks/use-auth';
import { useValue } from '@legendapp/state/react';

const useProfileData = () => {
  const { user, signOut } = useAuth();
  const profiles = useValue(profiles$);
  const profile = (user?.id ? profiles[user.id] : null) ?? null;
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();

  return { user, signOut, profile, theme, colorScheme, setTheme, setColorScheme };
};

export default useProfileData;
