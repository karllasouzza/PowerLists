import { View } from 'react-native';
import { MicrophoneCta } from './microphone-cta';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

type VoiceAssistantFooterProps = {
  handleDirectModeChange: (mode: 'manual' | 'auto') => void;
  transcript: string;
  recognizing: boolean;
  directMode: 'manual' | 'auto';
  isFirstItem: boolean;
  handleMainAction: () => void;
  handleStop: () => void;
};

const getFooterLabel = ({
  transcript,
  recognizing,
  directMode,
  isFirstItem,
}: {
  transcript: string;
  recognizing: boolean;
  directMode: 'manual' | 'auto';
  isFirstItem: boolean;
}) => {
  if (transcript) return 'processando...';
  if (recognizing) return 'ouvindo...';
  if (directMode === 'manual') {
    return isFirstItem
      ? 'Toque no microfone ou ative o automático!'
      : 'Toque no microfone para continuar a falar!';
  }

  return isFirstItem ? 'Toque no microfone para iniciar o reconhecimento!' : 'ouvindo...';
};

export const VoiceAssistantFooter = ({
  handleDirectModeChange,
  transcript,
  recognizing,
  directMode,
  isFirstItem,
  handleMainAction,
  handleStop,
}: VoiceAssistantFooterProps) => {
  return (
    console.log({ transcript, recognizing, directMode, isFirstItem }),
    (
      <View className="w-full flex flex-col">
        <View className="w-full flex items-center justify-center">
          <View className="bg-muted overflow-hidden  rounded-b-none !rounded-3xl px-4 py-3">
            <Text className="text-sm text-center">
              {getFooterLabel({ transcript, recognizing, directMode, isFirstItem })}
            </Text>
          </View>
        </View>
        <View className="w-full flex flex-col gap-10 items-center overflow-hidden rounded-t-3xl bg-primary p-4">
          <View className="w-min flex-row gap-2 p-2 border border-border/50 rounded-lg justify-center">
            <Button
              variant={directMode === 'manual' ? 'secondary' : 'ghost'}
              onPress={() => handleDirectModeChange('manual')}>
              <Text>Manual</Text>
            </Button>
            <Button
              variant={directMode === 'auto' ? 'secondary' : 'ghost'}
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
    )
  );
};
