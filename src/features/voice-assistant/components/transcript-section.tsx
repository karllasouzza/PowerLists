import { Text } from '@/components/ui/text';
import { View } from 'react-native';

interface TranscriptSectionProps {
  transcript: string;
  recognizing: boolean;
}

export const TranscriptSection = ({ transcript, recognizing }: TranscriptSectionProps) => {
  return (
    <View className="w-full gap-3 px-1">
      <View className="max-w-[84%] self-start rounded-2xl bg-card px-4 py-3">
        <Text className="text-sm text-foreground">O que gostaria de adicionar na lista hoje?</Text>
      </View>

      <View className="max-w-[84%] self-end rounded-2xl bg-primary px-4 py-3">
        <Text className="text-sm text-primary-foreground">{transcript}</Text>
      </View>
    </View>
  );
};
