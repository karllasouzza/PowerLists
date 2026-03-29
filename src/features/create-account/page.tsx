import React, { useState } from 'react';
import { View } from 'react-native';
import { IconEye, IconEyeClosed, IconLoader2, IconUserPlus } from '@tabler/icons-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

import { CreateAccountSchema } from '.';
import { CreateAccountSchemaType } from './types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Image } from 'expo-image';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export default function CreateAccountScreen() {
  const router = useRouter();
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const { signUpWithPassword, isLoading } = useAuth();

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
      await signUpWithPassword({ email: data.email, password: data.password });
      router.replace('/');
    } catch (error) {
      console.error('Error on signUpWithPassword:', error);
    }
  };

  const handleLogin = () => {
    router.navigate('/login');
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
                  <Label htmlFor="email">*Email</Label>
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
                  <Label htmlFor="password">*Senha</Label>
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
            size="lg"
            className="w-full"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            <Icon
              key={isLoading ? 'loader' : 'user-plus'}
              as={isLoading ? IconLoader2 : IconUserPlus}
              className={cn('mr-2 text-primary-foreground', isLoading && 'animate-spin')}
              size={20}
            />
            <Text variant="large" className="font-bold text-primary-foreground">
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
      </View>
    </KeyboardAwareScrollView>
  );
}
