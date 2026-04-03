import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LegendList } from '@legendapp/list';

import { ChatMessageItem } from './components';
import { useVoiceAssistantLogics } from './hooks/use-voice-assistant-logics';
import { VoiceAssistantFooter } from './components/voice-assistant-footer';
import { TopBar } from '@/components/top-bar';

export default function AssistantPage() {
  const router = useRouter();
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
    <View className="flex-1 w-full h-full bg-background">
      <TopBar title="Assistente de Voz" showBack onBack={() => router.back()} />
      <LegendList
        initialScrollAtEnd
        maintainScrollAtEnd
        data={chatMessages}
        estimatedItemSize={70}
        renderItem={({ item }) => <ChatMessageItem message={item} />}
        keyExtractor={(_, index) => String(index)}
        extraData={chatMessages}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 20,
        }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        scrollEnabled={true}
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
