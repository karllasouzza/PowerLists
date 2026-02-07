import { Alert } from 'react-native';
import { lists$ } from '@/data/states/lists';
import { showToast } from './toast';

interface MigrationDataParams {
  guestId: string;
  userId: string;
}

interface MigrationResult {
  success: boolean;
  itemsMigrated: number;
  error?: string;
}

/**
 * Service responsible for synchronizing guest user data to authenticated user accounts.
 *
 * Provides functionality to detect guest data, prompt users for migration, and handle
 * the migration process of lists from guest accounts to registered user accounts.
 *
 * @remarks
 * - All methods catch errors internally and provide safe fallback returns
 * - Relies on LegendApp State management for automatic Supabase synchronization
 * - Uses native Alert dialogs for user interaction on mobile platforms
 *
 * @example
 * ```typescript
 * const syncService = new SyncService();
 *
 * // Check if guest has data
 * const hasData = await syncService.hasGuestData('guest_123');
 *
 * // Prompt migration flow
 * await syncService.promptDataMigration({
 *   guestId: 'guest_123',
 *   userId: 'user_456'
 * });
 * ```
 */
export class SyncService {
  /**
   * Checks if a guest has any associated lists in the system.
   * @param guestId - The unique identifier of the guest to check
   * @returns A promise that resolves to true if the guest has at least one list, false otherwise
   * @throws Does not throw; catches and logs errors internally, returning false on failure
   */
  async hasGuestData(guestId: string): Promise<boolean> {
    try {
      const listsData = lists$.get();
      const listsArray = Object.values(listsData || {});

      const guestLists = listsArray.filter((list: any) => list.profile_id === guestId);

      return guestLists.length > 0;
    } catch (error) {
      console.error('Erro ao verificar dados guest:', error);
      return false;
    }
  }

  /**
   * Retrieves the count of lists associated with a specific guest.
   * @param guestId - The unique identifier of the guest
   * @returns A promise that resolves to the number of lists owned by the guest
   * @throws Silently catches errors and returns 0 if count operation fails
   */
  async getGuestListsCount(guestId: string): Promise<number> {
    try {
      const listsData = lists$.get();
      const listsArray = Object.values(listsData || {});

      // Conta listas do guest
      const guestLists = listsArray.filter((list: any) => list.profile_id === guestId);

      return guestLists.length;
    } catch (error) {
      console.error('Erro ao contar listas guest:', error);
      return 0;
    }
  }

  /**
   * Prompts the user to migrate guest data to their user account.
   *
   * Checks if the guest has any saved data. If data exists, displays an alert
   * allowing the user to either discard the local data or migrate it to their
   * authenticated account. On successful migration, shows a success toast with
   * the number of migrated items. On failure, shows an error toast.
   *
   * @param params - The migration parameters
   * @param params.guestId - The ID of the guest account
   * @param params.userId - The ID of the user account to migrate data to
   * @returns A promise that resolves when the user completes the migration flow
   *
   * @example
   * await syncService.promptDataMigration({
   *   guestId: 'guest_123',
   *   userId: 'user_456'
   * });
   */
  async promptDataMigration({ guestId, userId }: MigrationDataParams): Promise<void> {
    const hasData = await this.hasGuestData(guestId);

    if (!hasData) {
      return;
    }

    const listsCount = await this.getGuestListsCount(guestId);

    return new Promise((resolve) => {
      Alert.alert(
        '🔄 Migrar dados locais?',
        `Você tem ${listsCount} lista${listsCount > 1 ? 's' : ''} salva${listsCount > 1 ? 's' : ''} localmente.\n\nDeseja sincronizar com sua conta?`,
        [
          {
            text: 'Não, descartar dados',
            style: 'cancel',
            onPress: () => {
              resolve();
            },
          },
          {
            text: 'Sim, migrar',
            onPress: async () => {
              // Migra dados do guest para o usuário
              const result = await this.migrateGuestDataToUser({ guestId, userId });

              if (result.success) {
                showToast({
                  type: 'success',
                  title: 'Sucesso!',
                  subtitle: `${result.itemsMigrated} lista${result.itemsMigrated > 1 ? 's' : ''} migrada${result.itemsMigrated > 1 ? 's' : ''}!`,
                });
              } else {
                showToast({
                  type: 'error',
                  title: 'Erro na migração',
                  subtitle: result.error ?? 'Tente novamente',
                });
              }

              resolve();
            },
          },
        ],
        { cancelable: false }
      );
    });
  }

  /**
   * Migrates all lists owned by a guest user to a registered user.
   *
   * @param params - The migration parameters
   * @param params.guestId - The ID of the guest user whose lists will be migrated
   * @param params.userId - The ID of the registered user who will own the lists
   * @returns A promise that resolves to a migration result containing success status and the count of migrated lists
   * @throws Does not throw; errors are caught and returned in the result object
   *
   * @remarks
   * - This method automatically syncs changes to Supabase through the LegendApp State
   * - If no lists are found for the guest, returns success with 0 items migrated
   * - The migration updates the `profile_id` field of each list to the new user ID
   */
  async migrateGuestDataToUser({ guestId, userId }: MigrationDataParams): Promise<MigrationResult> {
    try {
      const listsData = lists$.get();
      const listsArray = Object.entries(listsData || {});

      // Filtra listas do guest
      const guestLists = listsArray.filter(
        ([_, list]: [string, any]) => list.profile_id === guestId
      );

      if (guestLists.length === 0) {
        return {
          success: true,
          itemsMigrated: 0,
        };
      }

      // Atualiza profile_id de cada lista
      // O LegendApp State sincroniza automaticamente com Supabase
      for (const [listId] of guestLists) {
        lists$[listId].profile_id.set(userId);
      }

      return {
        success: true,
        itemsMigrated: guestLists.length,
      };
    } catch (error) {
      console.error('Erro ao migrar dados:', error);
      return {
        success: false,
        itemsMigrated: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }
}
