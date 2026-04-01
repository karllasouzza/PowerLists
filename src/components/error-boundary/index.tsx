import React from 'react';
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

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Erro capturado:', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
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
            onPress={this.handleReset}
            className="rounded-xl bg-primary px-6 py-3"
            activeOpacity={0.8}>
            <Text className="font-medium text-primary-foreground">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
