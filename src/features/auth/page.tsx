import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { HatGlasses } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export default function AuthScreen() {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.navigate('/create-account');
  };

  const handleLogin = () => {
    router.navigate('/login');
  };

  const handleGuest = () => {
    router.navigate('/guest');
  };

  return (
    <View className="h-full w-full flex-1 flex-col items-center justify-between gap-2 overflow-hidden bg-background">
      <View className="w-full items-center justify-center">
        <View className="h-[300px] max-h-[300px] w-full items-center justify-center gap-2">
          <Image
            source={require('../../../assets/new-icon-concept.png')}
            style={{ width: 250, height: 250 }}
            contentFit="contain"
          />
        </View>
        <View className="w-full items-center justify-center gap-2 p-8 py-4">
          <Text className="text-4xl font-bold text-foreground">Bem-vindo!</Text>
          <Text className="text-center text-lg font-normal text-foreground">
            Guarde seus dados localmente ou opte por se conectar e armazenar suas informações na
            nuvem.
          </Text>
        </View>
      </View>

      <View className="w-full flex-col items-center justify-center gap-6 px-4 py-8">
        <View className="w-full items-center justify-center gap-4 p-2">
          <Button variant="default" className="h-12 w-full" onPress={handleCreateAccount}>
            <Text className="text-base font-bold text-primary-foreground">Começe agora!</Text>
          </Button>
          <Button variant="secondary" className="h-12 w-full" onPress={handleLogin}>
            <Text className="font-bold text-secondary-foreground">Já tem uma conta?</Text>
          </Button>
        </View>

        <View className="w-full items-center justify-end gap-4 bg-background">
          <View className="w-full flex-row items-center justify-center gap-4 bg-background px-4">
            <View className="h-[1px] w-full bg-border" />
            <Text className="font-bold uppercase text-muted-foreground">ou</Text>
            <View className="h-[1px] w-full bg-border" />
          </View>

          <Button variant="ghost" className="h-12 w-full" onPress={handleGuest}>
            <Icon as={HatGlasses} className="text-secondary-foreground" size={20} />
            <Text className="font-bold text-secondary-foreground">Continuar com conta local</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
