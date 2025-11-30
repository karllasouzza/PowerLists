import { Alert } from 'react-native';
import { MigrationResult } from '@/stores/auth';
import { lists$ } from '@/data/actions/lists.actions';
import { showToast } from '../toast';

/**
 * Serviço responsável pela migração de dados entre usuários
 * A sincronização automática é feita pelo LegendApp State
 */
export class SyncService {
  /**
   * Verifica se existem dados do guest para migrar
   */
  async hasGuestData(guestId: string): Promise<boolean> {
    try {
      const listsData = lists$.get();
      const listsArray = Object.values(listsData || {});

      // Verifica se existem listas do guest
      const guestLists = listsArray.filter((list: any) => list.profile_id === guestId);

      return guestLists.length > 0;
    } catch (error) {
      console.error('Erro ao verificar dados guest:', error);
      return false;
    }
  }

  /**
   * Conta quantas listas o guest possui
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
   * Mostra dialog perguntando se quer migrar dados
   */
  async promptDataMigration(guestId: string, userId: string): Promise<void> {
    const hasData = await this.hasGuestData(guestId);

    if (!hasData) {
      // Não tem dados para migrar
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
              const result = await this.migrateGuestDataToUser(guestId, userId);

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
   * Migra dados de guest para usuário authenticated
   * Atualiza o profile_id das listas no observable
   * O LegendApp State sincroniza automaticamente com Supabase
   */
  async migrateGuestDataToUser(guestId: string, userId: string): Promise<MigrationResult> {
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
