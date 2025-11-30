import * as z from 'zod/mini';

export const PasswordRecoverySchema = z.object({
  email: z.email({ message: 'Email inválido' }),
});
