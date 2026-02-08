import { profiles$ } from '@/data/states/profile';
import { useAuth } from '@/hooks/use-auth';
import { useValue } from '@legendapp/state/react';

const useProfileData = () => {
  const { user, signOut } = useAuth();
  const profiles = useValue(profiles$.get());
  const profile = profiles[user!.id!] || null;

  return { user, signOut, profile };
};

export default useProfileData;
