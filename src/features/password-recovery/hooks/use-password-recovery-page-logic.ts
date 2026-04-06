import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordRecoverySchemaType } from '../types';
import { PasswordRecoverySchema } from '../utils/schema';

export const usePasswordRecoveryLogic = () => {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();

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

      await resetPassword({ password: data.newPassword });
      router.back();
    } catch (error) {
      console.error('Error on password recovery:', error);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isSecureNewPassword,
    setIsSecureNewPassword,
    isSecureNewPasswordConfirmation,
    setIsSecureNewPasswordConfirmation,
    isLoading,
    onSubmit,
  };
};
