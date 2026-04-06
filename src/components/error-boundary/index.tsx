import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({ hasError: false, error: null });

  const handleReset = () => {
    setState({ hasError: false, error: null });
  };

  useEffect(() => {
    if (state.hasError) {
      console.error('[ErrorBoundary] Erro capturado:', state.error);
    }
  }, [state.hasError, state.error]);

  if (state.hasError) {
    if (props.fallback) {
      return props.fallback;
    }

    return (
      <View className="flex-1 items-center justify-center gap-6 bg-background px-8">
        <View className="items-center gap-3">
          <Text className="text-center text-2xl font-semibold text-foreground">
            Algo deu errado
          </Text>
          <Text className="text-center text-base text-muted-foreground">
            Ocorreu um erro inesperado. Tente novamente ou reinicie o aplicativo.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleReset}
          className="rounded-xl bg-primary px-6 py-3"
          activeOpacity={0.8}>
          <Text className="font-medium text-primary-foreground">Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return props.children;
}
