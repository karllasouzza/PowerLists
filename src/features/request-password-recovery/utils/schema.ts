import * as z from 'zod/mini';

export const RequestPasswordRecoverySchema = z.object({
  email: z.email({ message: 'Email inválido' }),
});
