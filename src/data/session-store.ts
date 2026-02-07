import { computed } from '@legendapp/state';
import { auth$ } from '@/data/states/auth';
import { resetListStore } from './states/lists';
import { resetListItemsStore } from './states/list-items';
import { resetProfilesStore } from './states/profile';

let previousUserId: string | null = null;

// Watch for user changes and reset stores when user ID changes
export const initSessionStore = () => {
  console.log('[session-store] Initializing session listener');

  computed(() => {
    const user = auth$.user.get();
    const currentUserId = user?.id || null;

    // Only act if userId has changed
    if (currentUserId !== previousUserId) {
      console.log(`[session-store] User ID changed from ${previousUserId} to ${currentUserId}`);

      // Reset all stores to ensure clean state for new user (or logout)
      resetListStore();
      resetListItemsStore();
      resetProfilesStore();

      previousUserId = currentUserId;
    }
  });
};
