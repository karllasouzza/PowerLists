import { auth$ } from '@/data/states/auth';
import { computed } from '@legendapp/state';
import { resetListItemsStore } from './actions/list-items';
import { resetListStore } from './actions/lists';
import { resetProfilesStore } from './states/profile';

let previousUserId: string | null = null;

// Watch for user changes and reset stores when user ID changes
export const initSessionStore = () => {
  computed(() => {
    const user = auth$.user.get();
    const currentUserId = user?.id || null;

    if (currentUserId !== previousUserId) {
      resetListStore();
      resetListItemsStore();
      resetProfilesStore();

      previousUserId = currentUserId;
    }
  });
};
