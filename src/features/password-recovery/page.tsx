import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { IconLoader2, IconMail } from '@tabler/icons-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

import { PasswordRecoverySchema } from '.';
import { PasswordRecoverySchemaType } from './types';

export default function PasswordRecoveryScreen({ navigation }: any) {
  const { resetPassword, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordRecoverySchemaType>({
    resolver: zodResolver(PasswordRecoverySchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: PasswordRecoverySchemaType) => {
    try {
      await resetPassword(data.email);
      // Volta para a tela de login após enviar o email
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
    }
  };

  return (
    <KeyboardAvoidingView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
      <View className="flex-1 bg-background pt-0">
        <View className="w-[80%] flex-grow items-center justify-center gap-4 self-center">
          <Text variant="h2" className="text-center font-bold text-foreground">
            Recuperar senha!
          </Text>
          <Text variant="p" className="text-center text-foreground">
            Recupere sua conta existente através do seu e-mail. Enviaremos um link de recuperação.
          </Text>
        </View>

        <View className="w-[90%] flex-grow items-center gap-4 pt-10">
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

          <Button
            variant="default"
            className="w-full"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 animate-spin" size={20} />}
            <IconMail className="mr-2" size={20} />
            <Text variant="large" className="font-bold">
              Enviar email de recuperação
            </Text>
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onPress={() => navigation.goBack()}
            disabled={isLoading}>
            <Text variant="large" className="font-bold">
              Voltar para login
            </Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
