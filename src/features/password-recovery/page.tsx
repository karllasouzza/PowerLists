import React, { useState } from 'react';
import { View } from 'react-native';
import { IconEye, IconEyeClosed, IconLoader2 } from '@tabler/icons-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/auth';

import { PasswordRecoverySchema } from '.';
import { PasswordRecoverySchemaType } from './types';
import { Mail } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';

export default function PasswordRecoveryScreen() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthStore();

  const [isSecureNewPassword, setIsSecureNewPassword] = useState(true);
  const [isSecureNewPasswordConfirmation, setIsSecureNewPasswordConfirmation] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordRecoverySchemaType>({
    resolver: zodResolver(PasswordRecoverySchema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const onSubmit = async (data: PasswordRecoverySchemaType) => {
    try {
      if (!data.newPassword) throw new Error('password is required');
      if (!data.newPasswordConfirmation) throw new Error('password confirmation is required');

      if (data.newPassword !== data.newPasswordConfirmation)
        throw new Error('passwords do not match');

      await resetPassword(data.newPassword);
      router.back();
    } catch (error) {
      console.log('Error on password recovery:', error);
    }
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
          <Text className="text-center text-3xl font-bold text-foreground">
            Crie uma nova senha!
          </Text>
        </View>
      </View>

      <View className="w-full flex-1 flex-col items-center gap-6 px-8 py-4">
        <View className="w-full flex-1 flex-col items-center justify-center gap-12">
          <View className="w-full flex-col gap-8">
            <Controller
              control={control}
              name="newPassword"
              render={({ field, ...props }) => (
                <View className="w-full flex-col gap-2">
                  <Label htmlFor="newPassword">*Nova senha</Label>
                  <View className="flex-row items-center gap-2">
                    <Input
                      autoComplete="off"
                      secureTextEntry={isSecureNewPassword}
                      value={field.value}
                      onChangeText={field.onChange}
                      className="flex-1"
                      {...props}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onPress={() => setIsSecureNewPassword(!isSecureNewPassword)}>
                      <Icon as={isSecureNewPassword ? IconEye : IconEyeClosed} size={20} />
                    </Button>
                  </View>
                  {errors.newPassword && (
                    <Text variant="small" className="mt-1 text-destructive">
                      {errors.newPassword.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="newPasswordConfirmation"
              render={({ field, ...props }) => (
                <View className="w-full flex-col gap-2">
                  <Label htmlFor="newPasswordConfirmation">*Confirme a nova senha</Label>
                  <View className="flex-row items-center gap-2">
                    <Input
                      autoComplete="off"
                      secureTextEntry={isSecureNewPasswordConfirmation}
                      value={field.value}
                      onChangeText={field.onChange}
                      className="flex-1"
                      {...props}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onPress={() =>
                        setIsSecureNewPasswordConfirmation(!isSecureNewPasswordConfirmation)
                      }>
                      <Icon
                        as={isSecureNewPasswordConfirmation ? IconEye : IconEyeClosed}
                        size={20}
                      />
                    </Button>
                  </View>
                  {errors.newPasswordConfirmation && (
                    <Text variant="small" className="mt-1 text-destructive">
                      {errors.newPasswordConfirmation.message}
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
            <Icon as={Mail} className="mr-2 text-primary-foreground" size={20} />
            <Text variant="large" className="font-bold">
              Enviar email de recuperação
            </Text>
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
