import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { IconEye, IconEyeClosed, IconLoader2, IconMail } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import React from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { usePasswordRecoveryLogic } from './hooks/use-password-recovery-page-logic';

export default function PasswordRecoveryScreen() {
  const {
    control,
    handleSubmit,
    errors,
    isSecureNewPassword,
    setIsSecureNewPassword,
    isSecureNewPasswordConfirmation,
    setIsSecureNewPasswordConfirmation,
    isLoading,
    onSubmit,
  } = usePasswordRecoveryLogic();

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      bottomOffset={62}
      contentContainerClassName="flex-grow justify-between">
      <View className="flex w-full items-center justify-center gap-6 p-6">
        <View className="w-full max-w-md items-center justify-center gap-2">
          <Image
            source={require('/assets/adaptive-icon.png')}
            contentFit="contain"
            className="size-40"
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
            <Icon as={IconMail} className="mr-2 text-primary-foreground" size={20} />
            <Text variant="large" className="font-bold">
              Enviar email de recuperação
            </Text>
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
