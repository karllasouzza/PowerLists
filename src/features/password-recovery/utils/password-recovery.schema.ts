import * as z from 'zod/mini';

z.config(z.locales.pt());

export const PasswordRecoverySchema = z
  .object({
    newPassword: z
      .string({ message: 'Senha inválida' })
      .check(z.minLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })),
    newPasswordConfirmation: z.string({ message: 'Senha inválida' }),
  })
  .check(
    z.refine((data) => data.newPassword === data.newPasswordConfirmation, {
      message: 'As senhas não coincidem',
      path: ['newPasswordConfirmation'],
    })
  );
