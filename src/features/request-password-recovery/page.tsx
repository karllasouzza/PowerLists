import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { IconLoader2, IconMail } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useRequestPasswordRecoveryLogic } from './hooks/use-request-password-recovery-page-logic';

export default function RequestPasswordRecoveryScreen() {
  const {
    control,
    handleSubmit,
    errors,
    isLoading,
    isBlocked,
    formattedTime,
    onSubmit,
    lastShipment,
  } = useRequestPasswordRecoveryLogic();

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      bottomOffset={62}
      contentContainerClassName="flex-grow justify-between">
      <View className="flex w-full items-center justify-center gap-6 p-6">
        <View className="w-full max-w-md items-center justify-center gap-2">
          <Image
            source={require('/assets/adaptive-icon.png')}
            style={{ width: 150, height: 150 }}
            contentFit="contain"
          />
        </View>
        <View className="w-full max-w-md items-center justify-center gap-2">
          <Text className="text-center text-3xl font-bold text-foreground">
            Envie o email de recuperação!
          </Text>
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
                    readOnly={isLoading || isBlocked}
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
          </View>

          <Button
            variant="default"
            className="w-full"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || isBlocked}>
            {isLoading && (
              <Icon
                as={IconLoader2}
                className="mr-2 animate-spin text-primary-foreground"
                size={20}
              />
            )}
            <Icon as={IconMail} className="mr-2 text-primary-foreground" size={20} />
            <Text variant="large" className="font-bold">
              {isBlocked
                ? `Aguarde ${formattedTime} para reenviar`
                : lastShipment
                  ? 'Reenviar email de recuperação'
                  : 'Enviar email de recuperação'}
            </Text>
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
