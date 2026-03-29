import {
  AppModal,
  AppModalContent,
  AppModalFooter,
  AppModalHandle,
  AppModalHeader,
} from '@/components/molecules/app-modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEmail } from '@/data/actions/profile';
import { updateProfile } from '@/data/states/profile';
import { showToast } from '@/services/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
});

type FormData = z.infer<typeof schema>;

type ManageProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  currentEmail: string;
};

export function ManageProfileModal({
  open,
  onOpenChange,
  currentName,
  currentEmail,
}: ManageProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: currentName, email: currentEmail },
  });

  useEffect(() => {
    if (open) {
      reset({ name: currentName, email: currentEmail });
    }
  }, [open, currentName, currentEmail, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const nameChanged = data.name !== currentName;
      const emailChanged = data.email !== currentEmail;

      const results = await Promise.all([
        nameChanged ? updateProfile({ name: data.name }) : Promise.resolve({ profile: null }),
        emailChanged ? updateEmail(data.email) : Promise.resolve({ error: null }),
      ]);

      const profileResult = results[0] as { profile: unknown };
      const emailResult = results[1] as { error: string | null };

      if (emailResult.error) {
        showToast({
          type: 'error',
          title: 'Erro ao atualizar e-mail',
          subtitle: emailResult.error,
        });
        return;
      }

      if (nameChanged && !profileResult.profile) {
        showToast({ type: 'error', title: 'Erro ao atualizar nome' });
        return;
      }

      showToast({ type: 'success', title: 'Perfil atualizado com sucesso' });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppModal open={open} onOpenChange={onOpenChange}>
      <AppModalContent>
        <AppModalHandle />
        <AppModalHeader title="Gerenciar Perfil" />
        <View className="gap-4 px-6 pb-2">
          <View className="gap-1.5">
            <Label nativeID="name-label">Nome</Label>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Seu nome"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  aria-labelledby="name-label"
                />
              )}
            />
            {errors.name && <Text className="text-destructive text-xs">{errors.name.message}</Text>}
          </View>
          <View className="gap-1.5">
            <Label nativeID="email-label">E-mail</Label>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="seu@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  aria-labelledby="email-label"
                />
              )}
            />
            {errors.email && (
              <Text className="text-destructive text-xs">{errors.email.message}</Text>
            )}
          </View>
        </View>
        <AppModalFooter
          onCancel={() => onOpenChange(false)}
          onConfirm={handleSubmit(onSubmit)}
          confirmLabel="Salvar"
          confirmingLabel="Salvando..."
          isLoading={isLoading}
        />
      </AppModalContent>
    </AppModal>
  );
}
