import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateAccountSchemaType } from '../types';
import { CreateAccountSchema } from '../utils';

export const useCreateAccountLogic = () => {
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

  return {
    control,
    handleSubmit,
    errors,
    isSecureTextEntry,
    setIsSecureTextEntry,
    onSubmit,
    handleLogin,
    isLoading,
  };
};
