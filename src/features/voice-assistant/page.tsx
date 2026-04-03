import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LegendList } from '@legendapp/list';

import { ChatMessageItem } from './components';
import { useVoiceAssistantLogics } from './hooks/use-voice-assistant-logics';
import { VoiceAssistantFooter } from './components/voice-assistant-footer';

export default function AssistantPage() {
  const { id: listId } = useLocalSearchParams<{ id: string }>();
  const {
    recognizing,
    transcript,
    directMode,
    chatMessages,
    handleStart,
    handleStop,
    handleDirectModeChange,
  } = useVoiceAssistantLogics(listId ?? '');

  const handleMainAction = () => {
    if (recognizing) {
      handleStop();
      return;
    }

    void handleStart();
  };

  return (
    <View className="flex-1 bg-background">
      <LegendList
        className="flex-1"
        data={chatMessages}
        estimatedItemSize={70}
        renderItem={({ item }) => <ChatMessageItem message={item} />}
        keyExtractor={(_, index) => String(index)}
        extraData={chatMessages}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 16,
        }}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />

      <VoiceAssistantFooter
        handleDirectModeChange={handleDirectModeChange}
        transcript={transcript}
        recognizing={recognizing}
        directMode={directMode}
        isFirstItem={chatMessages.length === 0}
        handleMainAction={handleMainAction}
        handleStop={handleStop}
      />
    </View>
  );
}
