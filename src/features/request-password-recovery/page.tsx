import React, { useMemo } from 'react';
import { View } from 'react-native';
import { IconLoader2 } from '@tabler/icons-react-native';
import { useForm, Controller } from 'react-hook-form';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react-native';

import { useCountdown } from '@/hooks/use-countdown';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';

import { RequestPasswordRecoverySchema } from '.';
import { RequestPasswordRecoverySchemaType } from './types';
import { errorsCase } from './utils';

type LatestShipments = {
  date: Date;
  email: string;
  success: boolean;
};

export default function PasswordRecoveryScreen() {
  const { sendResetPasswordByEmail, isLoading } = useAuthStore();

  const [latestShipments, setLatestShipments] = React.useState<LatestShipments[]>([]);

  const SEND_EMAIL_DELAY = 60 * 1000;

  const lastShipment = latestShipments.at(-1);
  const targetDate = useMemo(
    () => (lastShipment ? new Date(lastShipment.date.getTime() + SEND_EMAIL_DELAY) : null),
    [lastShipment]
  );

  const { formattedTime, timeLeft } = useCountdown(targetDate);
  const isBlocked = timeLeft > 0;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordRecoverySchemaType>({
    resolver: zodResolver(RequestPasswordRecoverySchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: RequestPasswordRecoverySchemaType) => {
    try {
      if (!data.email) throw new Error('email-required');
      if (!data.email.includes('@')) throw new Error('email-invalid');
      if (
        latestShipments.filter((shipment) => shipment.email === data.email && shipment.success)
          .length > 5
      )
        throw new Error('five-emails-per-hour');
      if (
        latestShipments.length &&
        latestShipments[latestShipments.length - 1].email === data.email &&
        latestShipments[latestShipments.length - 1].success &&
        latestShipments[latestShipments.length - 1].date.getTime() + SEND_EMAIL_DELAY >
          new Date().getTime()
      )
        throw new Error('one-email-per-minute');

      const sucess = await sendResetPasswordByEmail({ email: data.email });
      if (!sucess) throw new Error('email-not-found');

      setLatestShipments((prev) => [
        ...prev,
        { date: new Date(), email: data.email, success: sucess },
      ]);
    } catch (error) {
      console.error('Error on password recovery:', error);

      if (error instanceof Error) {
        errorsCase(error.message);
      }
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
            <Icon as={Mail} className="mr-2 text-primary-foreground" size={20} />
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
