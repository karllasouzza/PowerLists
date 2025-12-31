import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';

import { useAuthStore } from '@/stores/auth';
import { getProfile } from '@/data/actions/profile';
import '@/css/global.css';

export default function RootLayout() {
  const { user } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Redirect to the index page if the user is not authenticated and trying to access the tabs
      router.replace('/');
    }
  }, [user, router]);

  useEffect(() => {
    const init = async () => {
      const { profile } = await getProfile();
      if (!profile) {
        router.replace('/account');
      }
    };
    init();
  }, [router]);

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="account" options={{ headerShown: false }} />
    </Tabs>
  );
}
