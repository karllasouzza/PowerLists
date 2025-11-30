import React, { useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { IconEye, IconEyeClosed, IconLoader2, IconUserPlus } from '@tabler/icons-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

import { CreateAccountSchema } from '.';
import { CreateAccountSchemaType } from './types';

export default function CreateAccountScreen({ navigation }: any) {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const { signUp, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountSchemaType>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: CreateAccountSchemaType) => {
    try {
      await signUp(data.name, data.email, data.password);
      router.push('/(tabs)');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    }
  };

  return (
    <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
      <View className="flex-1 bg-background pt-0">
        <View className="w-[80%] flex-grow items-center justify-center gap-4 self-center">
          <Text variant="h2" className="text-center font-bold text-foreground">
            Seja bem vindo!
          </Text>
          <Text variant="p" className="text-center text-foreground">
            Cadastre seu nome, seu email e sua senha para poder usar os recursos de salvamento
            online.
          </Text>
        </View>

        <View className="w-[90%] flex-grow items-center gap-4 pt-10">
          <Controller
            control={control}
            name="name"
            render={({ field, ...props }) => (
              <View className="w-full">
                <Input
                  placeholder="Seu nome"
                  autoComplete="name"
                  autoCapitalize="words"
                  value={field.value}
                  onChangeText={field.onChange}
                  {...props}
                />
                {errors.name && (
                  <Text variant="small" className="mt-1 text-destructive">
                    {errors.name.message}
                  </Text>
                )}
              </View>
            )}
          />

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

        <View className="flex-row items-center justify-center py-10">
          <Text variant="muted">Já possui uma conta? </Text>
          <Button variant="link" onPress={() => navigation.navigate('Login')}>
            Faça o login
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
