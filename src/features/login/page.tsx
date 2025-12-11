import React, { useState } from 'react';
import { View } from 'react-native';
import { IconEye, IconEyeClosed, IconLoader2 } from '@tabler/icons-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

import { LoginSchema } from '.';
import { LoginSchemaType } from './types';
import { useRouter } from 'expo-router';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { HatGlasses, LogIn } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const { signIn, isLoading } = useAuthStore();

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
      const success = await signIn(data.email, data.password);
      if (!success) throw new Error('Erro no login');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const handleCreateAccount = () => {
    router.navigate('/create-account');
  };

  const handleGuest = () => {
    router.navigate('/guest');
  };

  const handleRecoveryPassword = () => {
    router.navigate('/request-password-recovery');
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
          <Text className="text-3xl font-bold text-foreground">Acesse sua conta!</Text>
        </View>
      </View>

      <View className="w-full flex-1 flex-col items-center gap-6 px-8 py-4">
        <View className="w-full flex-1 flex-col items-center justify-center gap-12">
          <View className="w-full flex-col gap-8">
            <Controller
              control={control}
              name="email"
              render={({ field, ...props }) => (
                <View className="w-full flex-col gap-4">
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
                  <View className="flex-row items-center justify-between">
                    <Label htmlFor="password">*Senha</Label>
                    <Button
                      variant="link"
                      className="p-0! h-max w-max"
                      onPress={handleRecoveryPassword}>
                      <Text variant="small" className="p-0! text-primary">
                        Esqueceu sua senha?
                      </Text>
                    </Button>
                  </View>
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
            {isLoading && (
              <Icon
                as={IconLoader2}
                className="mr-2 animate-spin text-primary-foreground"
                size={20}
              />
            )}
            <Icon as={LogIn} className="mr-2 text-primary-foreground" size={20} />
            <Text variant="large" className="font-bold">
              Entrar
            </Text>
          </Button>
        </View>

        <View className="flex-row items-center justify-center">
          <Text variant="muted">Ainda não possui uma conta? </Text>
          <Button variant="link" onPress={handleCreateAccount}>
            <Text variant="muted" className="font-bold">
              Crie uma agora
            </Text>
          </Button>
        </View>

        <View className="w-full flex-row items-center justify-center gap-4 px-4">
          <View className="h-[1px] w-full bg-border" />
          <Button variant="link" className="w-max p-0" onPress={handleGuest}>
            <Icon as={HatGlasses} className="text-secondary-foreground" size={20} />
            <Text className="font-bold text-secondary-foreground">Continuar com conta local</Text>
          </Button>
          <View className="h-[1px] w-full bg-border" />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
