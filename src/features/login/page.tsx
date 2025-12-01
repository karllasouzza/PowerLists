import React, { useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { IconEye, IconEyeClosed, IconLoader2, IconRocket } from '@tabler/icons-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

import { LoginSchema } from '.';
import { LoginSchemaType } from './types';

export default function LoginScreen({ navigation }: any) {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const { signIn, user, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await signIn(data.email, data.password);
      router.push('/(tabs)');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const continueAsGuest = () => {
    router.push('/(tabs)');
  };

  return (
    <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
      <View className="flex-1 bg-background pt-0">
        <View className="w-[80%] flex-grow items-center justify-center gap-4 self-center">
          <Text variant="h2" className="text-center font-bold text-foreground">
            Seja bem vindo de volta!
          </Text>
          <Text variant="p" className="text-center text-foreground">
            Acesse sua conta existente utilizando seu e-mail e senha.
          </Text>
        </View>

        <View className="w-[90%] flex-grow items-center gap-4 pt-10">
          {/* Botão primário: Continuar sem login */}
          <Button
            variant="default"
            className="w-full"
            onPress={continueAsGuest}
            disabled={isLoading}>
            <IconRocket className="mr-2" size={20} />
            <Text variant="large" className="font-bold">
              Continuar sem login
            </Text>
          </Button>

          {/* Divisor */}
          <View className="my-2 w-full flex-row items-center gap-4">
            <View className="h-[1px] flex-1 bg-border" />
            <Text variant="muted" className="text-muted-foreground">
              ou
            </Text>
            <View className="h-[1px] flex-1 bg-border" />
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field, ...props }) => (
              <View className="w-full">
                <Input
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
              <View className="w-full">
                <View className="flex-row items-center gap-2">
                  <Input
                    placeholder="********"
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
                    {isSecureTextEntry ? <IconEye size={20} /> : <IconEyeClosed size={20} />}
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

          <Button
            variant="outline"
            className="w-full"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 animate-spin" size={20} />}
            <Text variant="large" className="font-bold">
              Fazer login
            </Text>
          </Button>

          {/* Info card se for guest */}
          {user?.isGuest && (
            <View className="mt-4 w-full rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <Text variant="small" className="text-center text-blue-600 dark:text-blue-400">
                💡 Você está no modo guest. Faça login para backup em nuvem!
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-center py-10">
          <Text variant="muted">Ainda não possui uma conta? </Text>
          <Button variant="link" onPress={() => navigation.navigate('CreateAccount')}>
            <Text className="text-primary">Crie uma agora</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
