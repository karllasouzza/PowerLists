import * as z from 'zod/mini';

export const CreateAccountSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  password: z
    .string()
    .check(z.minLength(7, { message: 'A senha deve ter pelo menos 7 caracteres' }), z.trim()),
});
