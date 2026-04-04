import { useAudioPlayer } from 'expo-audio';

const useAssistantAudios = () => {
  const startRecordingPlayer = useAudioPlayer(require('/assets/sounds/assistant/select-click.wav'));
  const assistantCourtesyPlayer = useAudioPlayer(
    require('/assets/sounds/assistant/assistant-courtesy.mp3'),
  );
  const assistantNewFirstItemPlayer = useAudioPlayer(
    require('/assets/sounds/assistant/first-new-list-item.mp3'),
  );
  const assistantNewItemPlayer = useAudioPlayer(
    require('/assets/sounds/assistant/want-add-another-new-list-item.mp3'),
  );
  const addingListItemPlayer = useAudioPlayer(
    require('/assets/sounds/assistant/adding-list-item.mp3'),
  );
  const successPlayer = useAudioPlayer(require('/assets/sounds/assistant/sucess.wav'));
  const errorPlayer = useAudioPlayer(require('/assets/sounds/assistant/error.wav'));
  const errorNotificationPlayer = useAudioPlayer(
    require('/assets/sounds/assistant/error-notification.mp3'),
  );

  return {
    startRecordingPlayer,
    assistantCourtesyPlayer,
    assistantNewFirstItemPlayer,
    assistantNewItemPlayer,
    addingListItemPlayer,
    successPlayer,
    errorPlayer,
    errorNotificationPlayer,
  };
};

export default useAssistantAudios;
