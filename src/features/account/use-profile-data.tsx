import { profiles$ } from '@/data/states/profile';
import { useAuthStore } from '@/hooks/use-auth';
import { useValue } from '@legendapp/state/react';

const useProfileData = () => {
  const { user, signOut } = useAuthStore();
  const profiles = useValue(profiles$.get());
  const profile = profiles[user!.id!] || null;

  console.log('[useProfileData] profile:', profile);

  return { user, signOut, profile };
};

export default useProfileData;
