import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { IconCloud, IconFolder, IconUserPlus } from '@tabler/icons-react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function AuthScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-background">
      <View className="h-[45vh] w-full items-center justify-center">
        <Image
          source={require('../../../assets/adaptive-icon.png')}
          style={{ width: 200, height: 200 }}
          contentFit="contain"
        />
        <Text variant="h2" className="mt-5 font-bold text-foreground">
          Bem-vindo!
        </Text>
        <Text variant="p" className="mt-2 px-10 text-center text-foreground">
          Guarde seus dados localmente ou opte por se conectar e armazenar suas informações na
          nuvem.
        </Text>
      </View>

      <View className="h-[55vh] w-full items-center justify-start gap-4 bg-background pt-10">
        <Button
          variant="default"
          className="h-12 w-[80%]"
          onPress={() => navigation.navigate('CreateAccount')}>
          <IconUserPlus className="mr-2" size={20} />
          <Text variant="large" className="font-bold">
            Criar conta
          </Text>
        </Button>

        <Button
          variant="secondary"
          className="h-12 w-[80%]"
          onPress={() => navigation.navigate('Login')}>
          <IconCloud className="mr-2" size={20} />
          <Text variant="large" className="font-bold">
            Entrar
          </Text>
        </Button>

        <Button
          variant="outline"
          className="h-12 w-[80%]"
          onPress={() => navigation.navigate('Login')}>
          <IconFolder className="mr-2" size={20} />
          <Text variant="large" className="font-bold">
            Usar sem conta
          </Text>
        </Button>
      </View>
    </View>
  );
}
