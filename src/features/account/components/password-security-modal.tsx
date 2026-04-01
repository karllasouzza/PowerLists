import {
  AppModal,
  AppModalContent,
  AppModalFooter,
  AppModalHandle,
  AppModalHeader,
} from '@/components/molecules/app-modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { updatePassword } from '@/data/actions/profile';
import { showToast } from '@/services/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual'),
    newPassword: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

type PasswordSecurityModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PasswordSecurityModal({ open, onOpenChange }: PasswordSecurityModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { error } = await updatePassword(data.currentPassword, data.newPassword);
      if (error) {
        showToast({ type: 'error', title: 'Erro ao atualizar senha', subtitle: error });
        return;
      }
      showToast({ type: 'success', title: 'Senha atualizada com sucesso' });
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppModal open={open} onOpenChange={handleClose}>
      <AppModalContent>
        <AppModalHandle />
        <AppModalHeader title="Senha e Segurança" />
        <View className="gap-4 px-6 pb-2">
          <View className="gap-1.5">
            <Label nativeID="current-password-label">Senha atual</Label>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  aria-labelledby="current-password-label"
                />
              )}
            />
            {errors.currentPassword && (
              <Text className="text-destructive text-xs">{errors.currentPassword.message}</Text>
            )}
          </View>
          <View className="gap-1.5">
            <Label nativeID="new-password-label">Nova senha</Label>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  aria-labelledby="new-password-label"
                />
              )}
            />
            {errors.newPassword && (
              <Text className="text-destructive text-xs">{errors.newPassword.message}</Text>
            )}
          </View>
          <View className="gap-1.5">
            <Label nativeID="confirm-password-label">Confirmar nova senha</Label>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  aria-labelledby="confirm-password-label"
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-destructive text-xs">{errors.confirmPassword.message}</Text>
            )}
          </View>
        </View>
        <AppModalFooter
          onCancel={handleClose}
          onConfirm={handleSubmit(onSubmit)}
          confirmLabel="Atualizar senha"
          confirmingLabel="Atualizando..."
          isLoading={isLoading}
        />
      </AppModalContent>
    </AppModal>
  );
}
