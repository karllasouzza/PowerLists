import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';

import { MicrophoneCta, TranscriptSection } from './components';
import { useVoiceAssistantLogics } from './hooks/use-voice-assistant-logics';
import { Button } from '@/components/ui/button';

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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 16,
        }}>
        <View className="items-center gap-5 pt-3">
          <TranscriptSection messages={chatMessages} recognizing={recognizing} />
        </View>
      </ScrollView>
      <View className="w-full flex items-center justify-center">
        <View className="max-w-[84%] bg-muted overflow-hidden  rounded-b-none !rounded-2xl px-4 py-3">
          <Text className="text-sm text-center">
            {transcript
              ? 'processando...'
              : recognizing
                ? 'ouvindo...'
                : 'Ative o modo Direto ou toque no microfone.'}
          </Text>
        </View>
      </View>
      <View className="w-full flex flex-col gap-4 items-center overflow-hidden rounded-[28px] border border-border/40 bg-black p-4">
        <View className="w-min flex-row gap-2 p-2 border border-border/50 rounded-lg justify-center">
          <Button
            variant={directMode === 'manual' ? 'default' : 'ghost'}
            onPress={() => handleDirectModeChange('manual')}>
            <Text>Manual</Text>
          </Button>
          <Button
            variant={directMode === 'auto' ? 'default' : 'ghost'}
            onPress={() => handleDirectModeChange('auto')}>
            <Text>Automático</Text>
          </Button>
        </View>

        <MicrophoneCta
          active={recognizing}
          onPress={handleMainAction}
          onStop={handleStop}
          isAuto={directMode === 'auto'}
        />
      </View>
    </View>
  );
}
