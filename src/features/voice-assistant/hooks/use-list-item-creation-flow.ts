import { useCallback } from 'react';
import type { AudioPlayer } from 'expo-audio';

import { createNewListItem } from '@/data/states/list-items';
import { generateUUID } from '@/utils/generate-uuid';

import type { AssistantAcknowledgmentMessage, ChatMessage } from '../types';
import type { PlayAudio } from '../services/audio-queue';

interface CreationFlowPlayers {
  addingListItemPlayer: AudioPlayer;
  successPlayer: AudioPlayer;
  assistantNewItemPlayer: AudioPlayer;
  errorPlayer: AudioPlayer;
  errorNotificationPlayer: AudioPlayer;
}

interface CreationFlowItem {
  title: string;
  amount: number;
  listId: string;
}

export const useListItemCreationFlow = (
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  players: CreationFlowPlayers,
  playAudio: PlayAudio,
) => {
  const executeCreationFlow = useCallback(
    async ({ title, amount, listId }: CreationFlowItem) => {
      const acknowledgeId = generateUUID();

      // Step 2: append assistant acknowledgment card (processing) + play audio
      const acknowledgmentMessage: AssistantAcknowledgmentMessage = {
        id: acknowledgeId,
        type: 'assistant-acknowledgment',
        text: 'Entendi! Estou anotando seu item...',
        item: { title, amount, status: 'processing' },
      };

      setChatMessages((prev) => [...prev, acknowledgmentMessage]);
      await playAudio(players.addingListItemPlayer);

      // Step 3: create the item
      const isSaved = await createNewListItem({
        title,
        amount,
        listId,
        profileId: '',
        price: null,
        isChecked: false,
      });

      if (isSaved) {
        // Step 4: success — update status
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.type === 'assistant-acknowledgment' && msg.id === acknowledgeId
              ? { ...msg, item: { ...msg.item, status: 'success' } }
              : msg,
          ),
        );
        await playAudio(players.successPlayer);

        // Step 4b: follow-up prompt
        setChatMessages((prev) => [
          ...prev,
          { type: 'assistant', text: 'Se quiser adicionar outro item, é só me falar' },
        ]);
        await playAudio(players.assistantNewItemPlayer);
      } else {
        // Step 5: error — update item status
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.type === 'assistant-acknowledgment' && msg.id === acknowledgeId
              ? { ...msg, item: { ...msg.item, status: 'error' } }
              : msg,
          ),
        );
        await playAudio(players.errorPlayer);

        // Step 6: append error message + play error notification
        setChatMessages((prev) => [
          ...prev,
          {
            type: 'assistant',
            text: 'Ocorreu um erro! Para tentar novamente, por favor acione novamente a gravação!',
          },
        ]);
        await playAudio(players.errorNotificationPlayer);
      }
    },
    [setChatMessages, players, playAudio],
  );

  return { executeCreationFlow };
};
