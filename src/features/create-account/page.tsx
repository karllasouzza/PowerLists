import React, { useState } from 'react';
import { View } from 'react-native';
import { IconEye, IconEyeClosed, IconLoader2, IconUserPlus } from '@tabler/icons-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

import { CreateAccountSchema } from '.';
import { CreateAccountSchemaType } from './types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Image } from 'expo-image';
import { Icon } from '@/components/ui/icon';
import { HatGlasses } from 'lucide-react-native';
import { Label } from '@/components/ui/label';

export default function CreateAccountScreen() {
  const router = useRouter();
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const { signUp, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountSchemaType>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: CreateAccountSchemaType) => {
    try {
      await signUp(data.email, data.password);
      router.push('/(tabs)');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    }
  };

  const handleLogin = () => {
    router.navigate('/login');
  };

  const handleGuest = () => {
    router.navigate('/guest');
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      bottomOffset={62}
      contentContainerClassName="flex-grow justify-between">
      <View className="flex w-full items-center justify-center gap-6 p-6">
        <View className="w-full max-w-md items-center justify-center gap-2">
          <Image
            source={require('../../../assets/new-icon-concept.png')}
            style={{ width: 150, height: 150 }}
            contentFit="contain"
          />
        </View>
        <View className="w-full max-w-md items-center justify-center gap-2">
          <Text className="text-3xl font-bold text-foreground">Crie sua conta!</Text>
        </View>
      </View>

      <View className="w-full flex-1 flex-col items-center gap-6 px-8 py-4">
        <View className="w-full flex-1 flex-col items-center justify-center gap-6">
          <View className="w-full flex-col gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field, ...props }) => (
                <View className="w-full flex-col gap-2">
                  <Label htmlFor="email">*Email:</Label>
                  <Input
                    id="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={field.value}
                    onChangeText={field.onChange}
                    {...props}
                  />
                  {errors.email && (
                    <Text variant="small" className="mt-1 text-destructive">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field, ...props }) => (
                <View className="w-full flex-col gap-2">
                  <Label htmlFor="password">*Senha:</Label>
                  <View className="flex-row items-center gap-2">
                    <Input
                      autoComplete="off"
                      secureTextEntry={isSecureTextEntry}
                      value={field.value}
                      onChangeText={field.onChange}
                      className="flex-1"
                      {...props}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}>
                      <Icon as={isSecureTextEntry ? IconEye : IconEyeClosed} size={20} />
                    </Button>
                  </View>
                  {errors.password && (
                    <Text variant="small" className="mt-1 text-destructive">
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <Button
            variant="default"
            className="w-full"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 animate-spin" size={20} />}
            <IconUserPlus className="mr-2" size={20} />
            <Text variant="large" className="font-bold">
              Criar Conta
            </Text>
          </Button>
        </View>

        <View className="flex-row items-center justify-center">
          <Text variant="muted">Já possui uma conta? </Text>
          <Button variant="link" onPress={handleLogin}>
            <Text variant="muted" className="font-bold">
              Faça o login
            </Text>
          </Button>
        </View>

        <View className="w-full flex-row items-center justify-center gap-4 px-4">
          <View className="h-[1px] w-full bg-border" />
          <Button variant="link" className="w-full" onPress={handleGuest}>
            <Icon as={HatGlasses} size={20} />
            <Text className="font-bold">Continuar com conta local</Text>
          </Button>
          <View className="h-[1px] w-full bg-border" />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
