import { useAuth } from '@/hooks/use-auth';
import { useCountdown } from '@/hooks/use-countdown';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RequestPasswordRecoverySchemaType } from '../types';
import { errorsCase } from '../utils/errors-case';
import { RequestPasswordRecoverySchema } from '../utils/schema';

type LatestShipments = {
  date: Date;
  email: string;
  success: boolean;
};

const SEND_EMAIL_DELAY = 60 * 1000;

export const useRequestPasswordRecoveryLogic = () => {
  const [latestShipments, setLatestShipments] = useState<LatestShipments[]>([]);

  const { sendResetPasswordByEmail, isLoading } = useAuth();

  const lastShipment = useMemo(() => latestShipments.at(-1), [latestShipments]);
  const targetDate = useMemo(
    () => (lastShipment ? new Date(lastShipment.date.getTime() + SEND_EMAIL_DELAY) : null),
    [lastShipment],
  );

  const { formattedTime, timeLeft } = useCountdown(targetDate);
  const isBlocked = useMemo(() => timeLeft > 0, [timeLeft]);

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

  return {
    control,
    handleSubmit,
    errors,
    isLoading,
    onSubmit,
    formattedTime,
    isBlocked,
    lastShipment,
  };
};
